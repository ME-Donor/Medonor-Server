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
    blogs: [
        {
            blog: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ngoblog",
            },
        },
    ],
},
{timestamps: true}
);



User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',User);