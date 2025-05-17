const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseTitle: {
        type: String, 
        required: true
    }, 
    subTitle: {
        type: String
    }, 
    description: {
        type: String
    }, 
    category: {
        type: String, 
        required: true
    }, 
    courseLevel: {
        type: String,
        enum: ["Beginner", "Medium", "Advance"]
    },
    coursePrice: {
        type: Number
    }, 
    courseThumbnail: {
        type: String
    }, 
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users'
    }],
    lectures: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Lectures" // provide collection name which we create at the time of model creation which we called as a model.
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, {timestamps: true, versionKey: false})

const courseModel = mongoose.model("Courses", courseSchema)

module.exports = {
    courseModel
}