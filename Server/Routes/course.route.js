const express = require("express")
const courseRouter = express.Router()
const { isAuthenticated } = require("../Middlewares/isAuthenticated")
const { createCourse, getCreatorCourse, updateCourse, getCourseById, togglePublishCourse, getPublishCourse, getCourseDetailsWithPaymentStatus, getAllPurchasedCourse, getSearchedCourse} = require("../Controllers/course.controller")
const {upload} = require("../utils/multer")
const { createLecture, getCourseLecture, editLecture, removeLecture, getLectureById } = require("../Controllers/lecture.controller");


//Course
courseRouter.route("/create").post(isAuthenticated, createCourse)
courseRouter.route("/search").get(isAuthenticated, getSearchedCourse)
courseRouter.route("/published-courses").get(getPublishCourse)

courseRouter.route("/").get(isAuthenticated, getCreatorCourse)
courseRouter.route("/update/:courseId").put(isAuthenticated,upload.single('courseThumbnail'), updateCourse)
courseRouter.route("/:courseId").get(isAuthenticated, getCourseById)
courseRouter.route("/:courseId/details-with-status").get(isAuthenticated, getCourseDetailsWithPaymentStatus)
// courseRouter.route("/all-purchased").get(isAuthenticated, getAllPurchasedCourse)


//Lecture
courseRouter.route("/:courseId/lecture").post(isAuthenticated, createLecture)
courseRouter.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture)
courseRouter.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture)
courseRouter.route("/:courseId/lecture/:lectureId").delete(isAuthenticated, removeLecture)
courseRouter.route("/lecture/:lectureId").get(isAuthenticated, getLectureById)

// Publish 
courseRouter.route("/:courseId").patch(isAuthenticated, togglePublishCourse)

module.exports= {
    courseRouter
}