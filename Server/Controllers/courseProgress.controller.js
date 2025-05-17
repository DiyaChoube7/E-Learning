const { courseModel } = require("../Models/course.model");
const { courseProgressModel } = require("../Models/CourseProgress.model");

const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    //fetch user course progree
    let courseProgress = await courseProgressModel
      .findOne({ courseId, userId })
      .populate({ path: "courseId"});
    const CourseDetails = await courseModel.findById(courseId).populate("lectures");

    if (!CourseDetails) {
      return res.status(404).json({
        success: false,
        message: "course Not Found !!",
      });
    }

    // if no course progree found, return course details with am empty progress
    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: {
          CourseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    // return user course progress along with course details
    return res.status(200).json({
      success: true,
      data: {
        CourseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed To Get Course Progress !!",
    });
  }
};

const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // fetch or create course progress
    let courseProgress = await courseProgressModel.findOne({
      courseId,
      userId,
    });

    // if no course progree found, return course details with am empty progress
    if (!courseProgress) {
      // if no course Progree exist, create new record
      courseProgress = new courseProgressModel({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    // find the lecture progress in course progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );

    if (lectureIndex !== -1) {
      // if lecture already exists, update lecture
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      // add new lecture progress
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    // if all lectures completed
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProgress) => lectureProgress.viewed
    ).length;
    const course = await courseModel.findById(courseId);

    if (course?.lectures.length === lectureProgressLength) {
      courseProgress.completed = true;
    }

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Lecture Progress Updated Successfully !!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed To Update Lecture Progress !!",
    });
  }
};

const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    
    const courseProgress = await courseProgressModel.findOne({
      courseId,
      userId,
    });
    

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "No Course Progress Found !!",
      });
    }

    //   mark all lecture progress viewed
    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true)
    );
    courseProgress.completed = true;

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course Marked as completed !!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in mark as Completed !!",
    });
  }
};

const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    console.log(courseId, " || ", userId)

    const courseProgress = await courseProgressModel.findOne({
      courseId,
      userId,
    });

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "No Course Progress Found !!",
      });
    }

    //   mark all lecture progress viewed
    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = false)
    );
    courseProgress.completed = false;

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course Marked as Incompleted !!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in mark as Incompleted !!",
    });
  }
};


module.exports = {
    getCourseProgress,
    updateLectureProgress,
    markAsCompleted,
    markAsInCompleted
}