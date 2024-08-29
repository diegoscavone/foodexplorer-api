const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class CategoriesController {
  async create(request, response) {
    const { name } = request.body
    const categoryExists = await knex('category').where({ name }).first()

    if (categoryExists) {
      throw new AppError('Categoria informada já existe!', 400)
    }

    const [categoryID] = await knex('category').insert({ name })

    return response.status(201).json()
  }

  async index(request, response){
    const categories = await knex('category')
    return response.json(categories)
  }

  async delete(request, response){
    const { id } = request.params
    await knex('category').where({ id }).delete()
    console.log
    return response.json()
  }
}

module.exports = CategoriesController