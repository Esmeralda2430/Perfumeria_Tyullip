const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Función creadora de middleware de almacenamiento por entidad
const createUploader = (entityFolder) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, `../../uploads/${entityFolder}`);
      
      // Crea el directorio recursivamente si no existe
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Genera un nombre único: timestamp + número aleatorio + extensión original
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${entityFolder}-${uniqueSuffix}${ext}`);
    }
  });

  // Filtro para validar que solo se suban imágenes
  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png, webp, gif)'));
    }
  };

  return multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5 MB
    fileFilter: fileFilter
  });
};

module.exports = createUploader;