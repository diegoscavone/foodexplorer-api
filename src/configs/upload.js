const path = require('path')
const multer = require('multer')
const crypto = require('crypto')

const IMG_FOLDER = path.resolve(__dirname, '..', 'images')
const UPLOADS_FOLDER = path.resolve(IMG_FOLDER, 'uploads')

const MULTER = {
    storage: multer.diskStorage({
        destination: IMG_FOLDER,
        filename(request, file, callback){
            const fileHash = crypto.randomBytes(10).toString('hex')
            const fileName = `${fileHash}-${file.originalname}`

            return callback(null, fileName)
        },
    }),
}

module.exports = {
    IMG_FOLDER,
    UPLOADS_FOLDER,
    MULTER
}
