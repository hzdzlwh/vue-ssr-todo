const koa = require('koa')
const send = require('koa-send')
const path = require('path')
const koaBody = require('koa-body')
const koaSession = require('koa-session')

const staticRouter = require('./routers/static')
const apiRouter = require('./routers/api')
const userRouter = require('./routers/user')
const createDb = require('./db/db')
const config = require('../app.config')

const db = createDb(config.db.appId, config.db.appKey)  // 把db放入全局

const app = new koa()

app.keys = ['vue ssr tech']
app.use(koaSession({
    key: 'v-ssr-id',
    maxAge: 2 * 60 * 60 * 1000
}, app))

const isDev = process.env.NODE_ENV === 'development' // 服务端渲染分开发和正式两种情况


// 此中间件的作用记录中间状态和排查错误
app.use(async (ctx, next) => {
    try {
        console.log(`request with path ${ctx.path}`)  // 打印请求
        await next()
    } catch (err) {
        console.log(err)
        ctx.status = 500
        if (isDev) {
            ctx.body = err.message
        } else {
            ctx.body = 'place try again later'
        }
    }
})

// koa默认没有处理body的， 利用此中间件可以获取post请求返回的body内容，
app.use(koaBody())

app.use(async (ctx, next) => {
    ctx.db = db
    await next()
})

app.use(async (ctx, next) => {
    if (ctx.path === '/favicon.ico') {
        await send(ctx, '/favicon.ico', { root: path.join(__dirname, '../') })
    } else {
        await next()
    }
})

app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.use(staticRouter.routes()).use(staticRouter.allowedMethods())
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())

let pageRouter

/* 用no-bundle的模式是为了减少服务端开销使性能更好 */
if (isDev) {
    pageRouter = require('./routers/dev-ssr')
    // pageRouter = require('./routers/dev-ssr-no-bundle')  // 如果用这个，路由组件不能异步获取
} else {
    // pageRouter = require('./routers/ssr')
    pageRouter = require('./routers/ssr-no-bundle')   // 正式环境中此处不用服务端生成json的模式，在webpack.config.server.js中不用VueServerPlugin就不会生成json文件
}

app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

app.listen(PORT, HOST, () => {
    console.log(`server is listening on ${HOST}:${PORT}`)
})
