const crypto = require("crypto");
const Razorpay = require("razorpay");
const { courseModel } = require("../Models/course.model");
const { purchasedCourseModel } = require("../Models/purchaseCourse.model");
const { userModel } = require("../Models/user.model");
const { lectureModel } = require("../Models/lecture.model");

const generateOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    const user = await userModel.findById(userId);
    const firstName = user?.name?.split(" ")[0];

    const receiptId = "Reciept" + "_" + firstName + "_" + Date.now();
    const { amount, currency } = req.body;

    const course = await courseModel.findById(courseId);
    // console.log("COURSE : ", course)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found !!",
      });
    }

    // Check if the course has lectures
    if (course.lectures.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This course has no lectures. Cannot proceed with payment!",
      });
    }

    // Check if the user already purchased the course
    const existingPurchase = await purchasedCourseModel.findOne({
      userId,
      courseId,
      status: "completed",
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this course!",
      });
    }

    // create new course purchase record
    // const newCoursePurchase = new purchasedCourseModel({
    //   courseId,
    //   userId,
    //   amount: course?.coursePrice,
    //   status: "pending",
    // });

    // Check if a pending payment already exists for this user and course
    const existingPendingPurchase = await purchasedCourseModel.findOne({
      userId,
      courseId,
      status: "pending",
    });

    // Ensure environment variables are present
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay credentials missing!",
      });
    }

    const RAZORPAY = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Bad Request !!",
      });
    }

    const options = {
      amount,
      currency,
      receipt: receiptId,
      payment_capture: 1,
    };

    const order = await RAZORPAY.orders.create(options);

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Failed generate order ID !!",
      });
    }

    //save payment record
    // newCoursePurchase.payment_Id = order.id;
    // await newCoursePurchase.save();

    // If found, update the existing record instead of creating a new one
    if (existingPendingPurchase) {
      existingPendingPurchase.amount = course?.coursePrice;
      existingPendingPurchase.payment_Id = order.id; // Reset payment ID since it's a new attempt
      await existingPendingPurchase.save();
    } else {
      // If no pending payment exists, create a new one
      const newCoursePurchase = new purchasedCourseModel({
        courseId,
        userId,
        amount: course?.coursePrice,
        payment_Id: order.id,
        status: "pending",
      });
      await newCoursePurchase.save();
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Order ID Generation Error !!",
    });
  }
};

const validatePayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Transaction is not Legit !!",
      });
    }

    // Find course purchase record for the user and course
    const existingPurchase = await purchasedCourseModel.findOne({
      userId: req.id,
      status: "pending",
    });

    if (!existingPurchase) {
      return res.status(404).json({
        success: false,
        message: "No pending purchase found for this user!",
      });
    }

    // Update the purchase record with payment ID
    existingPurchase.payment_Id = razorpay_payment_id;
    existingPurchase.status = "completed";
    await existingPurchase.save();

    // Add course to user's enrolledCourses
    await userModel.findByIdAndUpdate(req.id, {
      $addToSet: { enrolledCourses: existingPurchase.courseId },
    });

    // Update all lectures of the purchased course to isPreviewFree = true
    await lectureModel.updateMany(
      {
        _id: {
          $in: (await courseModel.findById(existingPurchase.courseId)).lectures,
        },
      },
      { $set: { isPreviewFree: true } }
    );

    // update course to add user's id to the enrolled students
    await courseModel.findByIdAndUpdate(
      existingPurchase.courseId,
      {
        $addToSet: { enrolledStudents: existingPurchase.userId },
      }, // add userId
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Transaction Legit & Course Access Granted!!",
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      success_url: `${process.env.FRONTEND_URL}course-progress/${existingPurchase.courseId}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Order ID Generation Error !!",
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { payment_Id } = req.params;
    if (!payment_Id) {
      return res.status(404).json({
        status: false,
        message: "Payment Id not found !!",
      });
    }
    const RAZORPAY = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const payment = await RAZORPAY.payments.fetch(payment_Id);
    if (!payment) {
      return res.status(404).json({
        status: false,
        message: "Payment not found !!",
      });
    }

    const response = {
      status: payment?.status,
      method: payment?.method,
      amount: payment?.amount,
      currency: payment?.currency,
    };

    return res.status(200).json({
      status: true,
      response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Order ID Generation Error !!",
    });
  }
};

module.exports = {
  generateOrder,
  validatePayment,
  getPaymentById,
};
