const mongoose = require("mongoose")

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true
    },
    videoUrl:{
        type: String
    },
    publicId: {
        type: String
    },
    isPreviewFree: {
        type: Boolean
    }
}, {timestamps: true, versionKey: false})

const lectureModel = mongoose.model("Lectures", lectureSchema)

module.exports = {
    lectureModel
}
