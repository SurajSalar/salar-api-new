const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BlogsSchema = Schema({
    image: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = { Blogs: mongoose.model('Blogs', BlogsSchema) };