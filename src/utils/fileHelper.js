const fs = require('fs');
const path = require('path');

const deleteFile = (relativePath) => {
  if (!relativePath) return;
  const fullPath = path.join(__dirname, '../../', relativePath);
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error(`Error al eliminar archivo: ${err.message}`);
    });
  }
};

module.exports = { deleteFile };