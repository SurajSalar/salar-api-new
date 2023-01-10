const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BlogarticlesSchema = Schema({
     blogtitle: {
        type: String
    },
    description: {
        type: String
    },
    metakeyword: {
        type: String
    },
    metatitle: {
        type: String
    },
    metadescription: {
        type: String
    },
    image: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    auther: {
        type: Schema.Types.ObjectId,
        ref: 'Authers'
    },
     isDeleted: { type: Boolean, default: false},
    status: { type: Boolean, default: true},
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = { Blogarticles: mongoose.model('Blogarticles', BlogarticlesSchema) };