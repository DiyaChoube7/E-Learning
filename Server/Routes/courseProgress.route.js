const express = require("express")
const { isAuthenticated } = require("../Middlewares/isAuthenticated")
const { getCourseProgress, updateLectureProgress, markAsCompleted, markAsInCompleted } = require("../Controllers/courseProgress.controller")
const courseProgressRouter = express.Router()

courseProgressRouter.route("/:courseId").get(isAuthenticated, getCourseProgress)
courseProgressRouter.route("/:courseId/lecture/:lectureId/view").post(isAuthenticated, updateLectureProgress)
courseProgressRouter.route("/:courseId/complete").post(isAuthenticated, markAsCompleted)
courseProgressRouter.route("/:courseId/incomplete").post(isAuthenticated, markAsInCompleted)

module.exports = {
    courseProgressRouter
}