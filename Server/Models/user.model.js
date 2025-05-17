const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["instructor", "student"],
        default: "student"
    },
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Courses'
        }
    ],
    photoUrl:{
        type: String,
        default: ""
    }
}, {
    timestamps: true,
    versionKey: false
})

const userModel = mongoose.model('Users', userSchema)

module.exports={
    userModel
}