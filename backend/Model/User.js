const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    provider: {
        type: String,
        required: true,
        enum: ['guest', 'email and password', 'google', 'facebook'],
    },
    profileImage: {
        type: String,
        default: 'https://api.dicebear.com/5.x/thumbs/png?shapeColor=FD8A8A,F1F7B5,82AAE3,9EA1D4,A084CA,EBC7E8,A7D2CB,F07DEA,EC7272,FFDBA4,59CE8F,ABC270,FF74B1,31C6D4&backgroundColor=554994,594545,495579,395144,3F3B6C,2B3A55,404258,344D67&translateY=5&&seed=660bcb1934f82c3fdf6da053&scale=110&eyesColor=000000,ffffff&faceOffsetY=0' // add &size=80 for resizing
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;