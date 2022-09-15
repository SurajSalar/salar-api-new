const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const TeamLevelsSchema = new Schema({
    width: { type: Number },
    depth: { type: Number },
    levels: { type: Number },
    isDeleted: { type: Boolean, default: false },
    status: { type: Boolean, default: true }
}, { timestamps: true });

const TeamLevels = mongoose.model('teamlevels', TeamLevelsSchema);

module.exports = {
    TeamLevels: TeamLevels,
}