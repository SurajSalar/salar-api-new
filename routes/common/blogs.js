const BlogsController = require('../../controller/common/blog');

module.exports = (router, app) => {
    router.post('/common/blogs', (req, res, next) => {
        const addBlogS = (new BlogsController()).boot(req, res);
        return addBlogS.addBlogs();
    });

     router.get('/common/getblogs', (req, res, next) => {
        const addBlogS = (new BlogsController()).boot(req, res);
        return addBlogS.getBlogs();
    });

     router.post('/common/autherblogs', (req, res, next) => {
        const addBlogS = (new BlogsController()).boot(req, res);
        return addBlogS.addAuthers();
    });

     router.get('/common/getautherblogs', (req, res, next) => {
        const addBlogS = (new BlogsController()).boot(req, res);
        return addBlogS.getAuthers();
    });

      router.post('/common/blogautherblogs', (req, res, next) => {
        const addBlogS = (new BlogsController()).boot(req, res);
        return addBlogS.addBlogArticle();
    });

     router.get('/common/getblogautherblogs', (req, res, next) => {
        const addBlogS = (new BlogsController()).boot(req, res);
        return addBlogS.getBlogArticle();
    });

}