import createApp from './create-app'
import bus from './util/bus'

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {  // 此处的__INITIAL_STATE__来源于server-ernder.js的20行，目的是为了拿到服务端请求过来的数据，以免客户端再次请求数据
    store.replaceState(window.__INITIAL_STATE__)
}

bus.$on('auth', () => {
  router.push('/login')
})

router.onReady(() => {
    app.$mount('#root')
})
