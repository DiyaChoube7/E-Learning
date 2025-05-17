const mongoose = require('mongoose')

const purchasedCourseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    payment_Id: {
        type: String,
        required: true
    }    
}, {timestamps: true, versionKey: false})

const purchasedCourseModel = mongoose.model("PurchasedCourse", purchasedCourseSchema)

module.exports = {
    purchasedCourseModel
}