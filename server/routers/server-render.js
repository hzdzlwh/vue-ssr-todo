// 此方法进行服务端渲染
const ejs = require('ejs')

module.exports = async (ctx, renderer, template) => {
    ctx.headers['Content-Type'] = 'text/html'  // 返回html内容

    const context = { url: ctx.path, user: ctx.session.user }  // 此对象传到server renderer里，渲染完后会插入一堆属性供渲染html，包括客户端的js路径，css路径

    try {
        const appString = await renderer.renderToString(context)

        // 服务端进行重定向,正是因为使用的createBundleRenderer的原因，此步操作必须在上面的renderToString后面执行，renderToString在服务端是最耗性能的一步，此部分可以用no-bundle进行优化，在服务端redirect的时候其实可以不用渲染html
        if (context.router.currentRoute.fullPath !== ctx.path) {
            return ctx.redirect(context.router.currentRoute.fullPath)
        }

        const {
            title
        } = context.meta.inject()  // 此处获取的meta是server-entry.js的30

        const html = ejs.render(template, {
            appString,
            style: context.renderStyles(),    // 带有style标签的整个字符串
            scripts: context.renderScripts(),
            title: title.text(),
            initalState: context.renderState()  // 这样写源于server-entry.js已经指定过context的state, 然后在模版中插入此值便会自动插入一段script脚本，state便会挂载到window.__INITIAL_STATE__下面
        })

        ctx.body = html  // 返回给客户端的html
    } catch (err) {
        console.log('render error', err)
        throw err
    }
}
