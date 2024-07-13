const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images'); //do nothing when error, second parameter is path
    },
    filename: function (req, file, cb) {
        const volunteerId = req.params.id;
        const ext = path.extname(file.originalname);
        cb(null, `volid${volunteerId}${ext}`); //do nothing when error, second parameter is path
    }
});

const upload = multer({ storage: storage, limits: { fieldSize: 2 * 1024 * 1024 } }); //use the storage object we just defined

module.exports = upload;
