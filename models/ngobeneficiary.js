const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ngobeneficiarySchema = Schema({
    heading: {
        type: String,
        required: true,
    },
    description: {
        type:String,
        required:true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    dateNum: {
        type: Number,
        required: true,
    },

}, { timestamps: true })


const NgoBeneficiary = mongoose.model('ngobeneficiary', ngobeneficiarySchema);

module.exports =  NgoBeneficiary ;