const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')

const knex = require('../database/knex')

const UserRepository = require('../repositories/UserRepository')
const UserCreateService = require('../services/UserCreateService')

class UsersController {
  async create(request, response) {
    const { name, email, password, isAdmin } = request.body

    const userRepository = new UserRepository()
    const userCreateService = new UserCreateService(userRepository)

    await userCreateService.execute({ name, email, password, isAdmin })
    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, old_password, isAdmin } = request.body
    const id = request.user.id

    const user = await knex('users').where({ id }).first()

    if (!user) {
      throw new AppError('Usuário não encontrado!', 404)
    }

    const userWithUpdateEmail = await knex('users').where({ email }).first()

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError('Email já cadastrado!', 400)
    }

    user.name = name ?? user.name
    user.email = email ?? user.email
    user.isAdmin = isAdmin ?? user.isAdmin

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('Senha antiga não confere', 400)
      }
      user.password = await hash(password, 8)
    }
    await knex('users')
      .update({
        name: name,
        email: email,
        password: user.password,
        isAdmin: isAdmin
      })
      .where({ id })

    return response.json()
  }
}

module.exports = UsersController
