const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images'); //do nothing when error, second parameter is path
    },
    filename: function (req, file, cb) {
        const oppId = req.params.id;
        const ext = path.extname(file.originalname);
        cb(null, `oppid${oppId}${ext}`); //do nothing when error, second parameter is path
    }
});

const oppupload = multer({ storage: storage, limits: { fieldSize: 2 * 1024 * 1024 } }); //use the storage object we just defined

module.exports = oppupload;