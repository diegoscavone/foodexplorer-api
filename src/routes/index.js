const { Router } = require('express')

const usersRoutes = require('./users.routes')
const sessionsRoutes = require('./sessions.routes')
const categoriesRoutes = require('./categories.routes')
const dishesRoutes = require('./dishes.routes')

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)
routes.use('/categories', categoriesRoutes)
routes.use('/dishes', dishesRoutes)

module.exports = routes