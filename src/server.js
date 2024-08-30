require('dotenv/config')
require('express-async-errors')
const AppError = require('./utils/AppError')
const path = require('path')

const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const cookieParser = require('cookie-parser')

const app = express()

app.use('/images/uploads', express.static(path.join(__dirname, 'images', 'uploads')));

app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: ['https://foodexplorerscavone.netlify.app','http://localhost:5173'],
    credentials: true
  }))

app.use(routes)

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }
  console.error(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  })
})

const PORT = 3333
app.listen(PORT, () =>
  console.log(`Server Food Explorer is running on Port ${PORT}`)
)