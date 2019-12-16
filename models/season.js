const mongoose = require('mongoose')
const Schema = mongoose.Schema

const seasonSchema = new Schema({
    id: String,
    name: String,
    from: Date,
    upTo: Date,
    // img: Object,
    active: Boolean
})

module.exports = mongoose.model('Season', seasonSchema)