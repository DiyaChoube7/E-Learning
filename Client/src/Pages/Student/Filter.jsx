import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

const categories = [
  { id: "web-development", label: "Web Development" },
  { id: "data-science", label: "Data Science" },
  { id: "machine-learning", label: "Machine Learning & AI" },
  { id: "cloud-computing", label: "Cloud Computing" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "blockchain", label: "Blockchain & Cryptocurrency" },
  { id: "mobile-development", label: "Mobile App Development" },
  { id: "ui-ux-design", label: "UI/UX Design" },
  { id: "digital-marketing", label: "Digital Marketing" },
  { id: "graphic-design", label: "Graphic Design" },
  { id: "game-development", label: "Game Development" },
  { id: "devops", label: "DevOps & Software Engineering" },
  { id: "business", label: "Business & Entrepreneurship" },
  { id: "finance", label: "Finance & Investment" },
  { id: "language-learning", label: "Language Learning" },
  { id: "photography", label: "Photography & Video Editing" },
  { id: "music-production", label: "Music Production" },
  { id: "personal-development", label: "Personal Development" },
  { id: "health-fitness", label: "Health & Fitness" },
  { id: "cooking", label: "Cooking & Baking" },
  { id: "reactjs", label: "Next Js" },
];
const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCate) => {
      const newCategories = prevCate.includes(categoryId)
        ? prevCate.filter((id) => id !== categoryId)
        : [...prevCate, categoryId];

      handleFilterChange(newCategories, sortByPrice);
      return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue)
  };
  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
        <Select onValueChange={selectByPriceHandler} >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by Price</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className={"my-4"} />

      <div>
        <h1 className="font-semibold mb-2">Category</h1>
        {categories?.map((category) => (
          <div className="flex items-center space-x-2 mt-1">
            <Checkbox
              id={category?.id}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <label
              htmlFor={category?.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category?.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
