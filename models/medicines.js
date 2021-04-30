const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicineSchema = Schema({
    name: {
        type: String,
        default: ''
    },

    expirydate: {
        type: String,
        required: true,
    },

    amount: {
        type: String,
        required: true,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

}, { timestamps: true })


const Medicines = mongoose.model('medicines', medicineSchema);

module.exports = Medicines;