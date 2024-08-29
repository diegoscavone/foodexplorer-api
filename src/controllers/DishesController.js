const knex = require('../database/knex')
const path = require('path')
const fs = require('fs')
const DiskStorage = require('../providers/DiskStorage')
const uploadConfig = require('../configs/upload')
const AppError = require('../utils/AppError')

class DishesController {
  async create(request, response) {
    const { title, description, price, category_id, ingredients } = request.body
    const [dish_id] = await knex('dishes').insert({
      title,
      description,
      price,
      category_id
    })
    const ingredientsInsert = ingredients.map(name => {
      return {
        dish_id,
        name
      }
    })
    await knex('ingredients').insert(ingredientsInsert)
    return response.json({dish_id})
  }
  async show(request, response) {
    const { id } = request.params
    const dish = await knex('dishes').where({ id }).first()
    const ingredients = await knex('ingredients')
      .where({ dish_id: id })
      .orderBy('name')

    return response.json({
      ...dish,
      ingredients
    })
  }
  async index(request, response) {
    const dishes = await knex('dishes')
    return response.json(dishes)
  }
  async update(request, response) {
    const { title, description, price, category_id, ingredients } = request.body
    const { id } = request.params

    const dish = await knex('dishes').where({ id }).first()

    if (!dish) {
      throw new AppError('Prato não encontrado.', 404)
    }

    dish.title = title ?? dish.title
    dish.description = description ?? dish.description
    dish.price = price ?? dish.price
    dish.category_id = category_id ?? dish.category_id

    await knex('dishes').where({ id }).update({
      title: dish.title,
      description: dish.description,
      price: dish.price,
      category_id: dish.category_id
    })

    if(ingredients && Array.isArray(ingredients)){
      await knex('ingredients').where({ dish_id: id }).delete()
      const newIngredients = ingredients.map(ingredient => ({
        dish_id: id,
        name: ingredient.trim()
      })
      )
      await knex('ingredients').insert(newIngredients)
    }
    return response.json()
  }
  async delete(request, response) {
    const { id } = request.params
    await knex('dishes').where({ id }).delete()
    return response.json()
  }
  async filter(request, response) {
    const { search } = request.query
    let dishes

    if (search) {
      const filterIngredients = search
        .split(',')
        .map(ingredient => ingredient.trim())
      dishes = await knex('dishes')
        .select([
          'dishes.id',
          'dishes.title',
          'dishes.description',
          'dishes.price',
          'dishes.picture',
          'dishes.category_id',
          knex.raw(
            'GROUP_CONCAT(ingredients.name ORDER BY ingredients.name ASC) as ingredients'
          )
        ])
        .innerJoin('ingredients', 'dishes.id', 'ingredients.dish_id')
        .where(function () {
          this.where('dishes.title', 'like', `%${search}%`)
          filterIngredients.forEach(ingredient => {
            this.orWhere('ingredients.name', 'like', `%${ingredient}%`)
          })
        })
        .groupBy('dishes.id')
        .orderBy('dishes.title')
    } else {
      dishes = await knex('dishes').orderBy('title')
    }

    const dishIds = dishes.map(dish => dish.id)

    const allIngredients = await knex('ingredients').whereIn('dish_id', dishIds)

    const dishWithIngredients = dishes.map(dish => {
      const dishIngredients = allIngredients.filter(
        ingredient => ingredient.dish_id === dish.id
      )
      return {
        ...dish,
        ingredients: dishIngredients
      }
    })
    return response.json(dishWithIngredients)
  }
}

module.exports = DishesController
