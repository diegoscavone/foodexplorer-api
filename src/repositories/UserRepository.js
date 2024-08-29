const sqliteConnection = require('../database/sqlite')

class UserRepository {
  async findByEmail(email) {
    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE email = (?)', [
      email
    ])
    return user
  }

  async create({ name, email, password, isAdmin }) {
    const database = await sqliteConnection()
    const userID = await database.run(
      'INSERT INTO users (name, email, password, isAdmin) VALUES (?,?,?,?)',
      [name, email, password, isAdmin]
    )
    return { id: userID }
  }
}

module.exports = UserRepository