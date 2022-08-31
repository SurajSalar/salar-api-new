const FileUploadController = require('../../controller/user/fileUpload');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/fileUpload', isAuthorised, (req, res, next) => {
        const fileObj = (new FileUploadController()).boot(req, res);
        return fileObj.fileUpload();
    });
}