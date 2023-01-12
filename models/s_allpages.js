const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AllpagesSchema = Schema({
    pagename: {
        type: String
    },
    imageone: {
        type: String
    },
    imagetow: {
        type: String
    },
    imagethree: {
         type: String
    },
    title: {
         type: String
    },
     description: {
         type: String
    },
    descriptionsecond: {
         type: String
    },
    stauts: {
         type: String
    },
     status: { type: Boolean, default: true },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = { Allpages: mongoose.model('Allpages', AllpagesSchema) };