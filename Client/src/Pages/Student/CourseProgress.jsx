import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useGetCourseProgressQuery,
  useMarkAsCompletedMutation,
  useMarkAsInCompletedMutation,
  useUpdateLectureProgressMutation,
} from "@/Features/Api/courseProgressApi";
import { CheckCircle, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const [currentLecture, setCurrentLecture] = useState("");
  const params = useParams();
  const { courseId } = params;
  const { data, isLoading, isSuccess, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress, { isSuccess: isUpdateLectureSuccess }] =
    useUpdateLectureProgressMutation();
  const [
    markAsCompleted,
    { data: markAsCompletedData, isSuccess: completedSuccess },
  ] = useMarkAsCompletedMutation();
  const [
    markAsInCompleted,
    { data: markAsInCompletedData, isSuccess: inCompletedSuccess },
  ] = useMarkAsInCompletedMutation();

  useEffect(() => {
    if (completedSuccess) {
      toast.success(
        markAsCompletedData?.message || "Course completed successfully"
      );
    }
    if (inCompletedSuccess) {
      toast.success(
        markAsInCompletedData?.message || "Course incompleted successfully"
      );
    }
  }, [completedSuccess, inCompletedSuccess]);

  useEffect(() => {
    if (data?.data?.CourseDetails?.lectures?.length > 0 && !currentLecture) {
      setCurrentLecture(data.data.CourseDetails.lectures[0]);
    }
  }, [data]);

  if (isLoading) {
    return <p className="flex align-middle self-center">Loading...</p>;
  }

  if (isError) {
    toast.error("Error getting course progress!!");
    return null;
  }

  const { CourseDetails, progress, completed } = data?.data || {};
  const { courseTitle } = CourseDetails || {};

  // initialize first lecture if it not exist
  const initialLecture =
    currentLecture || (CourseDetails?.lectures && CourseDetails?.lectures[0]);

  console.log(data);

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });

    if (isUpdateLectureSuccess) {
      // Find the index of the current lecture
      const currentIndex = CourseDetails.lectures.findIndex(
        (lect) => lect._id === currentLecture._id
      );

      // Move to the next lecture if available
      const nextLecture = CourseDetails.lectures[currentIndex + 1];
      if (nextLecture) {
        setCurrentLecture(nextLecture);
      } else {
        toast.success("All lectures completed!");
      }
    }
    refetch();
  };

  const hanldeCompleteCourse = async () => {
    await markAsCompleted(courseId);
    refetch();
  };
  const hanldeInCompleteCourse = async () => {
    await markAsInCompleted(courseId);
    refetch();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      {/* Course Name */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button
          onClick={completed ? hanldeInCompleteCourse : hanldeCompleteCourse}
          variant={completed ? "outline" : "default"}
          className={
            completed && "bg-green-200 text-green-600 border-2 border-gray-200"
          }
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      {/* video section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          {/* video */}
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onEnded={() =>
                handleLectureProgress(
                  currentLecture?._id || initialLecture?._id
                )
              }
            />
          </div>
          {/* display current watching */}
          <div className="mt-2 ">
            <h3 className="font-medium text-lg ">{`Lecture ${
              CourseDetails.lectures.findIndex(
                (lect) =>
                  lect._id === (currentLecture?.id || initialLecture?._id)
              ) + 1
            } : ${
              currentLecture?.lectureTitle || initialLecture?.lectureTitle
            }`}</h3>
          </div>
        </div>

        {/* Lecture SideBar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:bottom-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4 ">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto ">
            {CourseDetails &&
              CourseDetails?.lectures?.map((lecture, index) => (
                <Card
                  key={lecture._id}
                  className={`mb-3 hover:cursor-pointer transition transform py-0 ${
                    lecture._id === currentLecture?._id
                      ? "bg-gray-200 dark:bg-gray-600"
                      : "dark:bg-gray-800"
                  }`}
                  onClick={() => handleSelectLecture(lecture)}
                >
                  <CardContent
                    className={"flex items-center justify-between p-4"}
                  >
                    <div className="flex items-center">
                      {isLectureCompleted(lecture._id) ? (
                        <CheckCircle
                          size={24}
                          className="text-green-500 mr-2"
                        />
                      ) : (
                        <CirclePlay size={24} className="text-gray-500 mr-2" />
                      )}

                      <div className="">
                        <CardTitle className={"text-lg font-medium"}>
                          Lecture {index + 1} | {lecture?.lectureTitle}
                        </CardTitle>
                      </div>
                    </div>
                    {isLectureCompleted(lecture._id) && (
                      <Badge
                        variant={"outline"}
                        className={"bg-green-200 text-green-600"}
                      >
                        Completed{" "}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
