const express = require('express');
const { isAuthenticated } = require('../Middlewares/isAuthenticated');
const { generateOrder, validatePayment, getPaymentById } = require('../Controllers/razorpay.controller');
const { getAllPurchasedCourse } = require('../Controllers/course.controller');
const razorPayRouter = express.Router();


// RAZORPAY 
razorPayRouter.route("/order/:courseId").post(isAuthenticated, generateOrder)
razorPayRouter.route("/validate").post(isAuthenticated, validatePayment)
razorPayRouter.route("/payment/:payment_Id").get(isAuthenticated, getPaymentById)


razorPayRouter.route("/all-purchased").get(isAuthenticated, getAllPurchasedCourse)

module.exports= {
    razorPayRouter
}