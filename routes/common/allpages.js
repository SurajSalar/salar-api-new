const allpagesController = require('../../controller/common/allpages');

module.exports = (router, app) => {
    router.post('/common/addpages', (req, res, next) => {
        const addBlogS = (new allpagesController()).boot(req, res);
        return addBlogS.addPages();
    });

     router.get('/common/getpages', (req, res, next) => {
        const addBlogS = (new allpagesController()).boot(req, res);
        return addBlogS.getPages();
    });

    

}