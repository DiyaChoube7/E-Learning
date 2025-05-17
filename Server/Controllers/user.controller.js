const { userModel } = require("../Models/user.model")
const bcrypt = require("bcryptjs")
const { generateToken } = require("../utils/generateToken")
const { deleteMediaFromCloudinary, uploadMedia } = require("../utils/cloudinary")

const register = async(req, res) => {
    try {
        const{name, email, password, contact} = req.body
        if(!name || !email || !password || !contact){
            return res.status(400).json({
                success: false,
                message: "All fields are manditarry !!"
            })
        }

        const user = await userModel.findOne({email})
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exist with this email !!"
            })
        } else{
            const hashPassword = await bcrypt.hash(password, 10)
            await userModel.create({
                name,
                email,
                password : hashPassword,
                contact
            })
            //201 is used when something is created
            return res.status(201).json({
                success: true,
                message: "User Registered Successfully !!"
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to register !!"
        })
    }
}

const login = async (req, res) => {
    try {
        const{email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are manditarry !!"
            })
        }

        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Incorrect Email or Password !!"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Incorrect Email or Password !!",
            })
        } 

        generateToken(res, user, `Welcome back ${user.name} !!`)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to Login !!"
        })
    }
}

const logout = (req, res) => {
    try {
        return res.status(200).cookie('token', '', {maxAge: 0}).json({
            success: true,
            message: "Logged out successfully !!"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to Log out !!"
        })
    }
}

const getUserProfile = async(req, res) => {
    try {
        //userId come from iisAuthenticated middleware
        const userId = req.id
        const user = await userModel.findById(userId).select("-password").populate("enrolledCourses")
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Profile Not Found !!"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to Load User !!"
        })
    }
}

const updateProfile = async(req, res) => {
    try {
        const userId = req.id
        const {name, email} = req.body
        const profilePhoto = req.file

        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Not Found !!"
            })
        }
        // extract publicId of the old image from the url is it exists
        if(user.photoUrl){
            //extract public Id
            const publicId = user.photoUrl?.split("/").pop(".")[0]
            deleteMediaFromCloudinary(publicId)
        }

        //upload new photo 
        const cloudRespone = await uploadMedia(profilePhoto.path)
        const photoUrl = cloudRespone?.secure_url

        const updatedData = {name, email, photoUrl}
        const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, {new: true}).select("-password")

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile Updated !!"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to Load User !!"
        })
    }
}

module.exports={
    register,
    login,
    logout,
    getUserProfile,
    updateProfile
}