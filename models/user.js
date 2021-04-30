var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
    name:{
        type:String,
        default : ''
    },
    description: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['donor', 'ngo', 'admin'],
        default: 'donor'
    },
    address: {
        type: String,
        default: ''
    },
    contact:{
        type: Number,
        default: ''
    }
},
{timestamps: true}
);



User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',User);