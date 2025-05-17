const express = require("express")
const { register, login, getUserProfile, logout, updateProfile } = require("../Controllers/user.controller")
const { isAuthenticated } = require("../Middlewares/isAuthenticated")
const { upload } = require("../utils/multer")
const userRouter = express.Router()

userRouter.route("/register").post(register)
userRouter.route("/login").post(login)
userRouter.route("/logout").get(logout)
userRouter.route("/profile").get(isAuthenticated, getUserProfile)
userRouter.route("/profile/update").put(isAuthenticated, upload.single("profilePhoto"), updateProfile)

module.exports= {
    userRouter
}