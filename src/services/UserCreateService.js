const { hash } = require('bcrypt')
const AppError = require('../utils/AppError')

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }
  async execute({ name, email, password, isAdmin }) {
    const checkUserExists = await this.userRepository.findByEmail(email)

    if (checkUserExists) {
      throw new AppError('Este e-mail já está em uso.')
    }

    const hashedPassword = await hash(password, 8)
    const userCreated = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false
    })
    return userCreated
  }
}

module.exports = UserCreateService
