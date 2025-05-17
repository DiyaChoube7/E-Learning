const { courseModel } = require("../Models/course.model");
const { lectureModel } = require("../Models/lecture.model");
const { deleteMediaFromCloudinary } = require("../utils/cloudinary");

// API faching from front End is Done in CourseApi only //

const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res
        .status(400)
        .json({ message: "Please provide a Lecture Title !!" });
    }

    //creating a lecture
    const lecture = await lectureModel.create({ lectureTitle });
    const course = await courseModel.findById(courseId);

    if (course && lecture?._id) {
      course.lectures.push(lecture?._id);
      await course.save();
    }

    return res.status(201).json({
      success: true,
      message: "Lecture Created Succesfully !!",
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Lecture !!",
    });
  }
};

const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await courseModel.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found !",
      });
    }

    return res.status(200).json({
      success: true,
      lectures: course?.lectures,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get Lecture !!",
    });
  }
};

const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { lectureId, courseId } = req.params;

    const lecture = await lectureModel.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture Not Found!!",
      });
    }

    //update lecture
    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }
    if (videoInfo?.videoUrl) {
      lecture.videoUrl = videoInfo?.videoUrl;
    }
    if (videoInfo?.publicId) {
      lecture.publicId = videoInfo?.publicId;
    }
    lecture.isPreviewFree = isPreviewFree

    //Ensure the course still has the lecture id if it was not already added
    const course = await courseModel.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    await lecture.save();
    return res.status(200).json({
      success: true,
      lecture,
      message: "Lecture Updated Successfully!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit Lecture !!",
    });
  }
};

const removeLecture = async (req, res) => {
  try {
    const { lectureId, courseId } = req.params;
    const lecture = await lectureModel.findByIdAndDelete(lectureId);

    //remove video from cloudinary
    if (lecture.publicId) {
      await deleteMediaFromCloudinary(lecture.publicId);
    }

    // removing the lecture reference from respected course
    const course = await courseModel.findById(courseId);
    if (course && course.lectures.includes(lecture._id)) {
      course.lectures.pull(lecture._id);
      await course.save();
    }

    return res.status(200).json({
      success: true,
      message: "Lecture Deleted Successfully !!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove Lecture !!",
    });
  }
};

const getLectureById = async (req, res)=> {
    try {
        const {lectureId} = req.params
        const lecture = await lectureModel.findById(lectureId)
        if(!lecture){
            return res.status(404).json({
                success: false,
                message: "Lecture Not Found !!",
              });
        }

        return res.status(200).json({
            success: true,
            lecture
          });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error to get Lecture by Id!!",
          });
    }
}

module.exports = {
  createLecture,
  getCourseLecture,
  editLecture,
  removeLecture,
  getLectureById
};
