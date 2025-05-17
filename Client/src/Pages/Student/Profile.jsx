import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/Features/Api/authApi";
import { toast } from "sonner";

const Profile = () => {
  const { data, isLoading, refetch } = useLoadUserQuery();
  const user = data?.user;

  const [
    updateUser,
    { data: updateUserData, isLoading: updateUserIsLoading, error, isSuccess },
  ] = useUpdateUserMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const firstName = user?.name?.split(" ")[0] || "";
  const lastName = user?.name?.split(" ")[1] || "";
  const initials = firstName.charAt(0) + (lastName.charAt(0) || "");

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "Error Occured !!");
    }
    if (isSuccess) {
      refetch();
      toast.success(data?.message || "Profile Updated Successfully !! ");
    }
  }, [error, updateUserData, isSuccess]);

  useEffect(() => {
    refetch();
  }, []);

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("profilePhoto", profilePhoto);

    await updateUser(formData);

    console.log(name, email, profilePhoto);
  };

  if (isLoading) {
    return (
      <>
        <Loader2 size={24} className="mt-24" />
        <span>Profile Loading...</span>
      </>
    );
  } else {
    console.log(data);
  }

  return (
    <div className="max-w-4xl mx-auto my-24 px-4 md:px-0 ">
      <h1 className="font-bold text-2xl text-center md:text-left">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start mt-6 gap-2 md:gap-10">
        <div className="flex flex-col items-center ">
          <Avatar className={"h-24 w-24 md:h-32 md:w-32 mb-4"}>
            <AvatarImage
              className={"object-cover bg-no-repeat"}
              src={
                user?.photoUrl ||
                "https://tse4.mm.bing.net/th?id=OIP.NUnJtiDFWXZTd1QptrMEIgHaHa&pid=Api&P=0&h=220"
              }
              alt="@shadcn"
            />
            <AvatarFallback className={"cursor-default"}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user && user.name}
              </span>
            </h1>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user && user.email}
              </span>
            </h1>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user && user.role.toUpperCase()}
              </span>
            </h1>
          </div>

          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className={"mt-2"}>
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription className={"text-gray-700"}>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Diya Japanease"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="username"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="diya@gmail.com"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Profile
                    </Label>
                    <Input
                      id="username"
                      type="file"
                      name="profile"
                      onChange={onChangeHandler}
                      accept="image/*"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={updateUserIsLoading}
                    onClick={updateUserHandler}
                  >
                    {updateUserIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Please Wait</span>
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-lg text-center md:text-left">
          Courses You'are Enrolled In
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 my-5">
          {user && user.enrolledCourses?.length !== 0 ? (
            user.enrolledCourses.map((course, index) => <Course key={index} course={course} />)
          ) : (
            <h1 className="">You have'nt enrolled in any courses yet !!</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
