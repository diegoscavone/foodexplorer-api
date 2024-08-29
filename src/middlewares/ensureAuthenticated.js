const { verify } = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers

  if (!authHeader.cookie) {
    throw new AppError('Token não informado', 401)
  }

  const [, token] = authHeader.cookie.split('token=')

  // Verifica se o token JWT é válido
  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret)
    request.user = {
      id: Number(user_id)
    }
    return next()
  } catch {
    throw new AppError('Token inválido', 401)
  }
}

// function ensureAuthenticated(request, response, next) {
//   // Verifica se o cabeçalho 'cookie' está presente
//   const cookies = request.headers.cookie;
//   console.log(cookies);

//   if (!cookies) {
//     throw new AppError('Token não informado', 401);
//   }

//   // Busca o token JWT a partir do cookie
//   const token = cookies
//     .split('; ')
//     .find(cookie => cookie.startsWith('token='))
//     ?.split('=')[1];

//   if (!token) {
//     throw new AppError('Token não informado', 401);
//   }

//   try {
//     // Verifica a validade do token JWT
//     const { sub: user_id } = verify(token, authConfig.jwt.secret);

//     // Armazena o ID do usuário na requisição para uso futuro
//     request.user = {
//       id: Number(user_id)
//     };

//     // Prossegue para a próxima etapa do middleware
//     return next();
//   } catch (err) {
//     throw new AppError('Token inválido', 401);
//   }
// }

module.exports = ensureAuthenticated
