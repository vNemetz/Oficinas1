const mongoose = require('mongoose');

const fechaduraSchema = new mongoose.Schema({
    numeroFechadura: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true,
    }
});

const Fechadura = mongoose.model('Fechadura', fechaduraSchema);
module.exports = Fechadura;
