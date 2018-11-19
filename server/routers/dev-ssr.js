const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')
const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')

const serverCompiler = webpack(serverConfig)
const mfs = new MemoryFS()

serverCompiler.outputFileSystem = mfs     // 存入内存，不写入磁盘

let bundle
serverCompiler.watch({}, (err, stats) => {
    if (err) throw err   // 如果打包出错
    stats = stats.toJson()
    stats.errors.forEach(err => console.log(err))
    stats.warnings.forEach(warn => console.warn(err))

    const bundlePath = path.join(
        serverConfig.output.path,
        'vue-ssr-server-bundle.json' // 使用VueServerPlugin默认输出的文件名
    )

    bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))  // 把输出的内容以utf-8读出并转化为json格式，此处即为服务端打包的结果
    console.log('new bundle generated')
})

const handleSSR = async (ctx) => {
    if (!bundle) {
        ctx.body = '你等一会，别着急....'
        return
    }

    const clientManifestResp = await axios.get(
        'http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'    // 此处文件名是由webpack.config.client.js中的VueClientPlugin自动生成的文件名
    )
    const clientManifest = clientManifestResp.data
    console.log(clientManifest)

    const template = fs.readFileSync(
        path.join(__dirname, '../server.template.ejs'),
        'utf-8'
    )

    const renderer = VueServerRenderer
        .createBundleRenderer(bundle, {
            inject: false,
            clientManifest
        })

    await serverRender(ctx, renderer, template)
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router
