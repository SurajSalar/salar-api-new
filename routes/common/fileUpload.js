const FileUploadController = require('../../controller/common/fileUpload');

module.exports = (router, app) => {
    router.post('/fileUpload', (req, res, next) => {
        const fileObj = (new FileUploadController()).boot(req, res);
        return fileObj.fileUpload();
    });
}