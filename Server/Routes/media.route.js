const express = require("express")
const {upload} = require('../utils/multer')
const {uploadMedia} = require('../utils/cloudinary')

const mediaRouter = express.Router()

mediaRouter.route("/upload-video").post(upload.single('file'), async (req, res)=> {
    try {
        const result = await uploadMedia(req.file.path)
        res.status(200).json({
            success: true,
            message: "File Uploaded Successfully !!",
            data: result
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Failed to upload media !!",
        });
      }
})

module.exports ={ 
    mediaRouter
}