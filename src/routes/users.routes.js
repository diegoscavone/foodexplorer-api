const { Router } = require('express')
const multer = require('multer')

const UsersController = require('../controllers/UsersControllers')
const UsersValidatedController = require('../controllers/UsersValidatedControlller')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const usersRoutes = Router()

const usersController = new UsersController()
const usersValidatedController = new UsersValidatedController()

usersRoutes.post('/', usersController.create)
usersRoutes.put('/:id', ensureAuthenticated, usersController.update)
usersRoutes.get(
  '/validated',
  ensureAuthenticated,
  usersValidatedController.index
)

module.exports = usersRoutes
