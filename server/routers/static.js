const Router = require('koa-router')
const send = require('koa-send')

const staticRouter = new Router({ prefix: '/public' })  // 只会处理/public开头的路径，目的是为了静态文件的中间件

staticRouter.get('/*', async ctx => {
    await send(ctx, ctx.path)
})

module.exports = staticRouter
