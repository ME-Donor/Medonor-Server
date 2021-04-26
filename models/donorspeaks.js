const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donorspeaksSchema = Schema({
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

}, { timestamps: true })


const DonorSpeaks = mongoose.model('donorspeaks', donorspeaksSchema);

module.exports =  DonorSpeaks ;