import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { Loader, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useUpdateCourseMutation,
} from "@/Features/Api/courseApi";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const CourseTab = () => {
  const { courseId } = useParams();
  const [updateCourse, { data, isLoading, isSuccess, error }] =
    useUpdateCourseMutation();


  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLavel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const { data: courseByIdData, isLoading: courseByIdLoading, refetch } =
    useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

  const [
    publishCourse,
    {
      data: publishData,
      isLoading: isPublishLoading,
      isSuccess: isPublishSuccess,
      error: isPublishError,
    },
  ] = usePublishCourseMutation();
  //Populate data
  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData?.course;
      setInput({
        courseTitle: course?.courseTitle,
        subTitle: course.subTitle,
        description: course?.description,
        category: course?.category,
        courseLavel: course?.courseLevel,
        coursePrice: course?.coursePrice,
        courseThumbnail: course?.courseThumbnail
      });
    }
  }, [courseByIdData]);

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLavel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewThumbnail(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();

    formData.append("courseTitle", input?.courseTitle);
    formData.append("subTitle", input?.subTitle);
    formData.append("description", input?.description);
    formData.append("category", input?.category);
    formData.append("courseLevel", input?.courseLavel);
    formData.append("coursePrice", input?.coursePrice);
    formData.append("courseThumbnail", input?.courseThumbnail);

    await updateCourse({ courseId, formData });
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  };

  const publishStatusHandler = async (action) => {
    try {
      const res = await publishCourse({ courseId, query: action });
      if(res?.data){
        toast.success(res.data?.message)
        refetch()
      }
    } catch (error) {
      console.log(error);
      toast.error(publishData?.error?.message)
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course Updated !!");
    }
    if (error) {
      toast.error(error.data.message || "Failed to update course !!");
    }
  }, [isSuccess, error]);


  return (
    <>
      {courseByIdLoading ? (
        <CourseFormSkeleton />
      ) : (
        <Card>
          <CardHeader className={"flex flex-row justify-between"}>
            <div>
              <CardTitle>Basic Course Information</CardTitle>
              <CardDescription>
                Make changes to your courses here. Click save when your done.
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button
                variant={"outline"}
                disabled={courseByIdData?.course?.lectures.length === 0 || isPublishLoading}
                onClick={() =>
                  publishStatusHandler(
                    courseByIdData?.course?.isPublished ? "false" : "true"
                  )
                }
              >
                {isPublishLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2"/>Please wait</> : courseByIdData?.course?.isPublished ? "Unpublish" : "Publish"}
              </Button>
              <Button>Remove Course</Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 mt-5">
              <div className="flex flex-col gap-2">
                <Label>Course Title</Label>
                <Input
                  type={"text"}
                  name="courseTitle"
                  placeholder="Ex. FullStack Developer"
                  value={input?.courseTitle}
                  onChange={changeEventHandler}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Sub-title</Label>
                <Input
                  type={"text"}
                  name="subTitle"
                  placeholder="Ex. Become a FullStack Developer from 0 to Hero."
                  value={input?.subTitle}
                  onChange={changeEventHandler}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <RichTextEditor input={input} setInput={setInput} />
              </div>

              <div className="flex items-start gap-5 flex-col md:flex-row lg:flex-row md:items-center ">
                <div className="flex flex-col gap-2">
                  <Label>Category</Label>
                  <Select
                    onValueChange={selectCategory}
                    value={input?.category}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        <SelectItem value="web-development">
                          Web Development
                        </SelectItem>
                        <SelectItem value="data-science">
                          Data Science
                        </SelectItem>
                        <SelectItem value="machine-learning">
                          Machine Learning & AI
                        </SelectItem>
                        <SelectItem value="cloud-computing">
                          Cloud Computing
                        </SelectItem>
                        <SelectItem value="cybersecurity">
                          Cybersecurity
                        </SelectItem>
                        <SelectItem value="blockchain">
                          Blockchain & Cryptocurrency
                        </SelectItem>
                        <SelectItem value="mobile-development">
                          Mobile App Development
                        </SelectItem>
                        <SelectItem value="ui-ux-design">
                          UI/UX Design
                        </SelectItem>
                        <SelectItem value="digital-marketing">
                          Digital Marketing
                        </SelectItem>
                        <SelectItem value="graphic-design">
                          Graphic Design
                        </SelectItem>
                        <SelectItem value="game-development">
                          Game Development
                        </SelectItem>
                        <SelectItem value="devops">
                          DevOps & Software Engineering
                        </SelectItem>
                        <SelectItem value="business">
                          Business & Entrepreneurship
                        </SelectItem>
                        <SelectItem value="finance">
                          Finance & Investment
                        </SelectItem>
                        <SelectItem value="language-learning">
                          Language Learning
                        </SelectItem>
                        <SelectItem value="photography">
                          Photography & Video Editing
                        </SelectItem>
                        <SelectItem value="music-production">
                          Music Production
                        </SelectItem>
                        <SelectItem value="personal-development">
                          Personal Development
                        </SelectItem>
                        <SelectItem value="health-fitness">
                          Health & Fitness
                        </SelectItem>
                        <SelectItem value="cooking">
                          Cooking & Baking
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Course Level</Label>
                  <Select
                    onValueChange={selectCourseLevel}
                    value={input?.courseLavel}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Course Levels</SelectLabel>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Advance">Advance</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Price in INR</Label>
                  <Input
                    type={"number"}
                    name="coursePrice"
                    value={input?.coursePrice}
                    onChange={changeEventHandler}
                    placeholder="1234"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Course Thubnail</Label>
                <Input
                  className={"w-fit"}
                  type={"file"}
                  eccept="image/*"
                  name="coursePrice"
                  onChange={selectThumbnail}
                  placeholder="1234"
                />
                {previewThumbnail && (
                  <img
                    src={previewThumbnail}
                    alt="preview"
                    className="w-64 my-2"
                  />
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant={"outline"}
                  onClick={() => navigate("/admin/course")}
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} onClick={updateCourseHandler}>
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 w-4 h-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CourseTab;

const CourseFormSkeleton = () => {
  return (
    <Card>
      <CardHeader className={"flex flex-row justify-between"}>
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardHeader>

      <div className="space-y-4 mt-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>

        <div className="flex flex-col md:flex-row lg:flex-row md:items-center gap-5">
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-40 w-64" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </Card>
  );
};
