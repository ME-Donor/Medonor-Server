var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
    firstname:{
        type: String,
        default : ''
    },
    lastname:{
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
},
{timestamps: true}
);

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',User);