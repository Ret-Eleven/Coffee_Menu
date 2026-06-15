import multer from 'multer'
import path from 'path'
import { mkdirSync } from 'fs'

const uploadDir = process.env.UPLOAD_PATH || './uploads'
mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

const fileFilter = (_, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/
  const valid = allowed.test(path.extname(file.originalname).toLowerCase())
               && allowed.test(file.mimetype)
  cb(valid ? null : new Error('Images only (jpeg, jpg, png, gif, webp)'), valid)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
})
