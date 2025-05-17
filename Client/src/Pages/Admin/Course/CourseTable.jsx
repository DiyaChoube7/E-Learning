import { Button } from "@/components/ui/button";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { useGetCreatorCourseQuery } from "@/Features/Api/courseApi";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CourseTable = () => {
  const navigate = useNavigate()
  const { data, isLoading, isSuccess, error } = useGetCreatorCourseQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isSuccess) {
    console.log("data--> ", data.courses);
  }

  return (
    <div>
      <Button>
        <Link to={"create"}>Create a new Course</Link>
      </Button>

      <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data?.courses.map((course) => (
              <TableRow key={course?._id}>
                <TableCell className="font-medium">
                {course?.coursePrice ? <>₹ {course?.coursePrice}/-</> : "NA"}
                </TableCell>
                <TableCell>
                  <Badge> {course?.isPublished ? "Published" : "Draft"}</Badge>
                </TableCell>
                <TableCell>{course?.courseTitle || "NA"}</TableCell>
                <TableCell className="text-right">
                  <Button size={"sm"} variant={"ghost"}>
                  <Link to={`edit/${course?._id}`}>
                    <Edit/>
                  </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  );
};

export default CourseTable;
