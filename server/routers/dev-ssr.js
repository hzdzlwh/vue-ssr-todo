const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')
const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')

const serverCompiler = webpack(serverConfig)  // webpack在服务端使用，在node中把webpack跑起来
const mfs = new MemoryFS()

serverCompiler.outputFileSystem = mfs     // 存入内存，不写入磁盘

let bundle                                // 记录webpack打包每次生成的文件
serverCompiler.watch({}, (err, stats) => {   // 调用watch会生成一个用于服务端的bundle，文件修改会重新打包
    if (err) throw err   // 如果打包出错抛出
    stats = stats.toJson()
    stats.errors.forEach(err => console.log(err))  // eslint错误
    stats.warnings.forEach(warn => console.warn(err))

    const bundlePath = path.join(  // 拼接输出的bundle的路径，以及输出的文件名
        serverConfig.output.path,
        'vue-ssr-server-bundle.json' // 使用VueServerPlugin默认输出的文件名，而不用output输出的server-entry.js
    )

    bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))  // 把输出的内容以utf-8读出并转化为json格式，此处即为服务端打包的结果
    console.log('new bundle generated')
})

const handleSSR = async (ctx) => {
    if (!bundle) {  // 判断服务端的bundle存不存在？
        ctx.body = '你等一会，别着急....'
        return
    }

    // 通过axios向webpack devServer发一个请求获取文件
    const clientManifestResp = await axios.get(
        'http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'    // 此处文件名是由webpack.config.client.js中的VueClientPlugin自动生成的文件名
    )
    const clientManifest = clientManifestResp.data
    console.log(clientManifest)

    // 第一步获取模版
    const template = fs.readFileSync(   // 读取模版内容
        path.join(__dirname, '../server.template.ejs'),
        'utf-8'
    )

    // 第二步生成一个render
    const renderer = VueServerRenderer   // 生成一个可以调用render的function
        .createBundleRenderer(bundle, {
            inject: false,   // 不执行注入操作
            clientManifest
        })

    await serverRender(ctx, renderer, template)
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router
