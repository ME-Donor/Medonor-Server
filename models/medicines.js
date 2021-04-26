const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicineSchema = Schema({
    name: {
        type: String,
        default: ''
    },

    expirydate: {
        type: Number,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

}, { timestamps: true })


const Medicines = mongoose.model('medicines', medicineSchema);

module.exports = Medicines;