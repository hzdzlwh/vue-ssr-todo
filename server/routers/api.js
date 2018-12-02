const Router = require('koa-router')

const apiRouter = new Router({ prefix: '/api' })  // 只处理api开头的

// 登录的验证
const validateUser = async (ctx, next) => {
    if (!ctx.session.user) {
        ctx.status = 401
        ctx.body = 'need login'
    } else {
        await next()
    }
}

apiRouter.use(validateUser)

const successResponse = (data) => {
    return {
        success: true,
        data
    }
}

apiRouter
    .get('/todos', async (ctx) => {  // 获取所有todo
        const todos = await ctx.db.getAllTodos()
        todos.map(item => {
            if (item.completed === 'false') {
                item.completed = false
            } else if (item.completed === 'true') {
                item.completed = true
            }
        })
        ctx.body = successResponse(todos)
    })
    .post('/todo', async (ctx) => {  // 创建todo
        const data = await ctx.db.addTodo(ctx.request.body)
        ctx.body = successResponse(data)
    })
    .put('/todo/:id', async (ctx) => {
        const data = await ctx.db.updateTodo(ctx.params.id, ctx.request.body)
        ctx.body = successResponse(data)
    })
    .delete('/todo/:id', async (ctx) => {
        const data = await ctx.db.deleteTodo(ctx.params.id)
        ctx.body = successResponse(data)
    })
    .post('/delete/completed', async (ctx) => {
        console.log(ctx.request.body.ids)
        const data = await ctx.db.deleteCompleted(ctx.request.body.ids)
        console.log(data)
        ctx.body = successResponse(data)
    })

module.exports = apiRouter
