import createApp from './create-app'

export default context => { // 此处的context就是server-render.js中传入的context
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    if (context.user) {
      store.state.user = context.user
    }

    router.push(context.url)

    router.onReady(() => {  // 在上一步push的路由里所有异步操作都执行完了
      // 主要做一些服务端获取数据的操作

      const matchedComponents = router.getMatchedComponents()  // 根据url配置响应的组件
      if (!matchedComponents.length) {
        return reject(new Error('no component matched'))
      }

      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            route: router.currentRoute,
            router,  // 把整个router对象传过去
            store
          })
        }
      })).then(data => {
        context.meta = app.$meta()  // 服务端渲染使用vue-meta的方式
        context.state = store.state  // 指定context.state = store.state
        context.router = router
        resolve(app)
      })
    })
  })
}
