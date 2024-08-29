const { Router } = require('express')

const CategoriesController = require('../controllers/CategoriesController')
const categoriesController = new CategoriesController()

const categoriesRoutes = Router()
categoriesRoutes.post('/', categoriesController.create)
categoriesRoutes.get('/', categoriesController.index)
categoriesRoutes.delete('/:id', categoriesController.delete)

module.exports = categoriesRoutes