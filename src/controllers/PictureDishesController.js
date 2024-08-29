const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')
const uploadConfig = require('../configs/upload')
const path = require('path')
const fs = require('fs')

class PictureDishesController {
  async update(request, response) {
    try {
      const { id } = request.params

      if (!request.file) {
        throw new AppError('Imagem não enviada.', 400)
      }

      const pictureFileName = request.file.filename
      const diskStorage = new DiskStorage()

      const dish = await knex('dishes').where({ id }).first()
      if (!dish) {
        throw new AppError('Prato não encontrado.', 404)
      }

      if (dish.picture) {
        await diskStorage.deleteFile(dish.picture)
      }

      const fileName = await diskStorage.saveFile(pictureFileName)
      dish.picture = fileName

      await knex('dishes').where({ id }).update(dish)

      return response.json(dish)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  async show(request, response) {
    //     const { id } = request.params
    //     const dishFileName = path.join(
    //       __dirname,
    //       '..',
    //       'images',
    //       'uploads',
    //       `${id}`
    //     )

    //     if(!fs.existsSync(dishFileName)){
    //       return response.status(404).json({ error: 'Imagem não encontrada.'})
    //     }
    //     try {
    //       const imageBuffer = fs.readFileSync(dishFileName)
    //       const base64Image = imageBuffer.toString('base64')
    //       const extension = path.extname(dishFileName).substring(1)
    //       const mimeType = `image/${extension}`
    // clear
    //       return response.json({ base64Image, mimeType })
    //     } catch (error) {
    //       return response.status(500).json({ error: 'Erro ao processar a imagem.'})
    //     }

    const { id } = request.params
    const dishFileName = path.join(__dirname, '..', 'images', 'uploads', id)

    if(!fs.existsSync(dishFileName)){
      return response.status(404).json({ error: 'Imagem não encontrada.'})
    }

    try {
      return response.sendFile(dishFileName)
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao processar imagem.'})
    }
  }
}
module.exports = PictureDishesController
