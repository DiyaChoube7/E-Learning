import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if(searchQuery.trim() !== ""){
      navigate(`/course/search?query=${searchQuery}`)
    }
    setSearchQuery("")
  };
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 pt-25 pb-17 px-4 text-center">
      <div className="max-w-3xl mx-auto ">
        <h1 className="text-white text-4xl font-bold mb-4">
          Find The Best Course For You
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn and Upskill with our wide range of courses.
        </p>

        <form
          onSubmit={searchHandler}
          className="flex items-center bg-white  dark:bg-gray-800 shadow-lg overflow-hidden max-w-xl mx-auto rounded-full"
        >
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Courses..."
            className={
              "flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-100"
            }
          />
          <Button
            type="submit"
            className={
              "bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800"
            }
          >
            Search
          </Button>
        </form>

        <Button
          className={
            "bg-white dark:bg-gray-800 text-blue-600 hover:bg-gray-300 rounded-full mt-4"
          }
          onClick={()=> navigate(`/course/search?query`)}
        >
          Explore Course
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
