const { default: mongoose } = require("mongoose");
const { courseModel } = require("../Models/course.model");
const { purchasedCourseModel } = require("../Models/purchaseCourse.model");

const {
  deleteMediaFromCloudinary,
  uploadMedia,
} = require("../utils/cloudinary");

const getCreatorCourse = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await courseModel.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        success: false,
        courses: [],
        message: "Course Not Found !!",
      });
    }

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get creator course !!",
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Course Title and category are required !!",
      });
    }
    const course = await courseModel.create({
      courseTitle,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      success: true,
      message: "Course Created !!",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course !!",
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;
    const courseId = req.params.courseId;

    let course = await courseModel.findById(courseId);

    if (course.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found!!",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID!",
      });
    }

    let courseThumbnail;
    if (thumbnail) {
      if (course?.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId); // delete previous image
      }
      // upload thumbnail on cloudinary
      courseThumbnail = await uploadMedia(thumbnail?.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };

    course = await courseModel.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      course,
      message: "Course updated successfully !!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course !!",
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await courseModel.findById(courseId);

    // Validate courseId before querying the database
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID !!",
      });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found !!",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course by Id !!",
    });
  }
};

const getPublishCourse = async (req, res) => {
  try {
    const courses = await courseModel
      .find({ isPublished: true })
      .populate({ path: "creator", select: "name photoUrl" });
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "No Course Found !!",
      });
    }

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get publish courses !!",
    });
  }
};

const removeCourse = async (req, res) => {};

const getCourseDetailsWithPaymentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await courseModel
      .findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await purchasedCourseModel.findOne({ userId, courseId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found !!",
      });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // its like !(!purchased)  || true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed To Get Course Details With Payment Status !!",
    });
  }
};

const getAllPurchasedCourse = async (req, res) => {
  try {
    const purchasedCourses = await purchasedCourseModel
    .find({ status: "completed" })
    .populate({ path: "courseId" });
    
    if (!purchasedCourses) {
      return res.status(404).json({
        success: false,
        message: "No Purchased Courses Found !!",
        purchasedCourses: [],
      });
    }

    return res.status(200).json({
      success: true,
      purchasedCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Get All Purchased Course !!",
    });
  }
};

const getSearchedCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;

    //create serch query
    const searchCriteria = {
      isPublished: true,
      $or: [
        // if the search item found in any of the below fields
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    // if categories are selected
    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    // define sorting order
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; // sort by price in ascending order
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; // sort by price in descending order
    }

    let courses = await courseModel
      .find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);
    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Get All Purchased Course !!",
    });
  }
};

// Publish and Unpublish Course
const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; // true / false
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found !!",
      });
    }

    // publish status based on the query parameter
    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      success: true,
      message: `Course is ${statusMessage} !!`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Toggle Course Status !!",
    });
  }
};

module.exports = {
  getCreatorCourse,
  getSearchedCourse,
  createCourse,
  updateCourse,
  getCourseById,
  togglePublishCourse,
  getPublishCourse,
  getCourseDetailsWithPaymentStatus,
  getAllPurchasedCourse,
};
