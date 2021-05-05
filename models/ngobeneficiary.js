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
    name: {
        type:String,
        required:true,
        default:''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

}, { timestamps: true })


const NgoBeneficiary = mongoose.model('ngobeneficiary', ngobeneficiarySchema);

module.exports =  NgoBeneficiary ;