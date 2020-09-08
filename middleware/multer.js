const multer = require("multer")
const path = require("path")

const MIME_TYPE_MAP ={
    'images/png':'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/csv': 'csv'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {

      const isvalid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isvalid) {
        error = null;
        
      }
      callback(null, path.join(__dirname, '../public/misc'));
    },
    filename: (req, file, callback) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, name + '_' + Date.now() + '.' + ext);
    }
  })

  module.exports = storage;