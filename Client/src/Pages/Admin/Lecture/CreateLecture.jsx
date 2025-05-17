import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateCourseMutation,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/Features/Api/courseApi";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const { courseId } = useParams();
  const [lectureTitle, setLectureTitle] = useState("");
  const navigate = useNavigate();

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();
  const {
    data: lectureData,
    isLoading: isLectureLoading,
    error: lectureError,
    refetch,
  } = useGetCourseLectureQuery({ courseId });

  console.log("lectureData", lectureData);

  const createLectureHandler = async () => {
    console.log(courseId, lectureTitle);
    await createLecture({ courseId, lectureTitle });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data?.message || "Lecture Created Successfully !!");
      //   navigate(`/admin/course/edit/${courseId}`);
    }
    if (error) {
      toast.error(error?.data?.message || "Error Occured !!");
    }
  }, [isSuccess, error]);



  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add lectures, add some lecture details for your new lecture.
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis,
          quam!{" "}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Title: </Label>
          <Input
            type={"text"}
            name="lectureTitle"
            value={lectureTitle}
            onChange={(e) => {
              setLectureTitle(e.target.value);
            }}
            placeholder="Your Title Name"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            onClick={() => navigate(`/admin/course/edit/${courseId}`)}
          >
            Back To Course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>

        <div className="mt-10">
          {isLectureLoading ? (
            <p>Lectures Loading...</p>
          ) : lectureError ? (
            <p>Failed to Load Lectures !!</p>
          ) : lectureData?.lectures.length === 0 ? (
            <p>No Lecture Available </p>
          ) : (
            lectureData &&
            lectureData.lectures?.map((lecture, index) => (
              <Lecture
                key={lecture?._id}
                lecture={lecture}
                index={index}
                courseId={courseId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
