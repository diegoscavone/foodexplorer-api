const { Router } = require('express')
const multer = require('multer')
const uploadConfig = require('../configs/upload')

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const DishesController = require('../controllers/DishesController')
const dishesController = new DishesController()

const PictureDishesController = require('../controllers/PictureDishesController')
const pictureDishesController = new PictureDishesController()

const upload = multer(uploadConfig.MULTER)

const dishesRoutes = Router()
dishesRoutes.use(ensureAuthenticated)

dishesRoutes.get('/', dishesController.filter)
dishesRoutes.get('/', dishesController.index)
dishesRoutes.post('/', dishesController.create)
dishesRoutes.put('/:id', dishesController.update)
dishesRoutes.get('/:id', dishesController.show)
dishesRoutes.delete('/:id', dishesController.delete)

dishesRoutes.patch(
  '/picture/:id',
  ensureAuthenticated,
  upload.single('picture'),
  pictureDishesController.update
)
dishesRoutes.get('/picture/:id', pictureDishesController.show)

module.exports = dishesRoutes
