import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/Features/Api/courseApi";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, {data, isLoading, isSuccess, error}] = useCreateCourseMutation()

  const navigate = useNavigate();

  const getSeletedCategory = (value) => {
    setCategory(value)
  }

  const createCourseHandler = async () => {
    console.log(courseTitle, category)
    await createCourse({courseTitle, category})
  };

  useEffect(()=> {
    if(isSuccess){
        toast.success(data?.message || "Course Created Successfully !!")
        navigate("/admin/course")
    }
    if(error){
        toast.error(error?.data?.message || "Error Occured !!")
    }
  }, [isSuccess, error])


  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add courses, add some course details for your new course.
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
            name="courseTitle"
            value={courseTitle}
            onChange={(e)=> {setCourseTitle(e.target.value)}}
            placeholder="Your Course Name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Category: </Label>

          <Select onValueChange={getSeletedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="machine-learning">
                  Machine Learning & AI
                </SelectItem>
                <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                <SelectItem value="blockchain">
                  Blockchain & Cryptocurrency
                </SelectItem>
                <SelectItem value="mobile-development">
                  Mobile App Development
                </SelectItem>
                <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                <SelectItem value="digital-marketing">
                  Digital Marketing
                </SelectItem>
                <SelectItem value="graphic-design">Graphic Design</SelectItem>
                <SelectItem value="game-development">
                  Game Development
                </SelectItem>
                <SelectItem value="devops">
                  DevOps & Software Engineering
                </SelectItem>
                <SelectItem value="business">
                  Business & Entrepreneurship
                </SelectItem>
                <SelectItem value="finance">Finance & Investment</SelectItem>
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
                <SelectItem value="health-fitness">Health & Fitness</SelectItem>
                <SelectItem value="cooking">Cooking & Baking</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={"outline"} onClick={() => navigate("/admin/course")}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
