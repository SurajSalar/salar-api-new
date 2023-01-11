const FileUploadController = require('../../controller/common/fileUpload');
const path = require('path');
// module.exports = (router, app) => {
//     router.post('/fileUpload', (req, res, next) => {
//         const fileObj = (new FileUploadController()).boot(req, res);
//         return fileObj.fileUpload();
//     });
// }


module.exports = (router, app) => {
const multer  = require('multer')
// const upload = multer({ dest: './public/uploads/' });

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/uploads/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});


router.post("/fileUpload", upload.single('files'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename);
        return res.send({"data":req.file.filename})
       
        
    }
});


router.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(files)
})



}