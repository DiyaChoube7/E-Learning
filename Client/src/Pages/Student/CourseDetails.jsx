import PurchaseCourseBtn from "@/components/PurchaseCourseBtn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailsWithPaymentStatusQuery } from "@/Features/Api/courseApi";
import { BadgeInfo, PlayCircle } from "lucide-react";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseDetails = () => {
  const params = useParams();
  const { courseId } = params;
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate()

  const {
    data: courseData,
    isLoading: courseDataIsLoading,
    isSuccess: courseDataIsSuccess,
    isError: courseDataError,
    refetch,
  } = useGetCourseDetailsWithPaymentStatusQuery(courseId);

  useEffect(() => {
    toast.error(courseData?.error?.message || "Error while loading details !!");
  }, [courseDataError]);

  const handleContinueCourse = () => {
    if(courseData?.purchased){
      navigate(`/course-progress/${courseId}`)
    }
  }

  console.log("courseData", courseData);

  return (
    <div className="mt-20 space-y-4">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col gap-4">
          <h1 className="font-bold text-2xl md:text-3xl ">
            {(courseData && courseData?.course?.courseTitle) || "NA"}
          </h1>
          <p className="text-base md:text-lg">
            {(courseData && courseData?.course?.subTitle) || "NA"}
          </p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {courseData && courseData?.course?.creator?.name || "NA"}
            </span>
          </p>

          <div className="flex items-center text-sm gap-2">
            <BadgeInfo size={16} />
            <p>
              Last Updated{" "}
              {courseData && courseData?.course?.updatedAt.split("T")[0]}
            </p>
          </div>
          <p>
            Student Enrolled :{" "}
            {(courseData && courseData?.course?.enrolledStudents.length) || "0"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p className="text-sm " dangerouslySetInnerHTML={{__html: courseData?.course?.description}}/>

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {(courseData && courseData?.course?.lectures.length) || "0"}{" "}
                Lectures
              </CardDescription>
            </CardHeader>
            <CardContent className={"space-y-3"}>
              {courseData &&
                courseData?.course?.lectures.map((lecture, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <span>
                      {true ? <PlayCircle size={14} /> : <Lock size={14} />}
                    </span>
                    <p>{lecture?.lectureTitle}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className={"flex flex-col p-4"}>
              <div className="w-full aspect-video mb-4 shadow-sm">
                <ReactPlayer width={'100%'}
                  height={'100%'}
                  controls={true}
                  url={courseData && courseData?.course?.lectures[0].videoUrl}
                />
              </div>
              <h1>
                {(courseData && courseData?.course?.courseTitle) ||
                  "Course Title"}
              </h1>
              <Separator className={"my-2"} />
              <h1 className="text-lg md:text-xl font-semibold">
                Rs. {(courseData && courseData?.course?.coursePrice) || "NA"}/-
              </h1>
            </CardContent>
            <CardFooter className={"flex justify-center p-4"}>
              {courseData && courseData?.purchased ? ( // condition changed for testing
                <Link onClick={handleContinueCourse} className={"w-full"}><Button className={"w-full"}>Continue Course</Button></Link>
              ) : (
                <PurchaseCourseBtn refetch={refetch} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
