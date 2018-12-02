const ejs = require('ejs')

module.exports = async (ctx, renderer, template, bundle) => {
    ctx.headers['Content-Type'] = 'text/html'

    const context = { url: ctx.path, user: ctx.session.user }

    try {
        // const appString = await renderer.renderToString(context)
        const app = await bundle(context)
        
        // 此处先进行redirect，后进行renderToString，优化点在此,如果redirect是不会走到renderToString的，renderToString是最耗费资源的
        if (context.router.currentRoute.fullPath !== ctx.path) {
            return ctx.redirect(context.router.currentRoute.fullPath)
        }

        const appString = await renderer.renderToString(app, context)

        const {
            title
        } = context.meta.inject()

        const html = ejs.render(template, {
            appString,
            style: context.renderStyles(),
            scripts: context.renderScripts(),
            title: title.text(),
            initalState: context.renderState()  // 这样写源于server-entry.js的23行
        })

        ctx.body = html
    } catch (err) {
        console.log('render error', err)
        throw err
    }
}
