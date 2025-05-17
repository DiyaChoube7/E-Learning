import { MenuIcon, School, UserX } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DarkMode } from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { userLoggedOut } from "@/Features/authSlice";
import { useLogoutUserMutation } from "@/Features/Api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [logoutUser, { data, isLoading, isSuccess }] = useLogoutUserMutation();

  console.log(user);

  const logoOutHandler = async () => {
    await logoutUser();
    navigate("/login");
  };

  useEffect(() => {
    if (isSuccess) {
      toast.message(data.message || "User Log Out Successfully !!");
    }
  }, [isSuccess]);
  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Dekstop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full ">
        <Link to={"/"}>
          <div className="flex gap-2">
            <School size={"30"} />
            <h1 className="hidden md:block font-extrabold text-2xl">
              HD-Learing
            </h1>
          </div>
        </Link>
        <div>
          {/* User Icon and Mode Changing Icon */}
          <div className="flex items-center gap-6">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={
                        (user && user.photoUrl) ||
                        "https://tse4.mm.bing.net/th?id=OIP.NUnJtiDFWXZTd1QptrMEIgHaHa&pid=Api&P=0&h=220"
                      }
                      alt="DP"
                    />
                    <AvatarFallback className={"cursor-default"}>
                      CN
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link to={"/profile"}>Edit Profile</Link>
                      {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to={"/my-learnings"}>My Learnings</Link>
                      {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {user && user.role === "instructor" && (
                    <DropdownMenuItem>
                      <Link to={"/admin"}>Dashboard</Link>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logoOutHandler}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1">
                <Button variant="outline">
                  <Link to={"/login"}>Login</Link>
                </Button>
                <Button>
                  <Link to={"/login"}>Sign Up</Link>
                </Button>
              </div>
            )}
            <DarkMode />
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex items-center justify-between md:hidden px-4 h-full">
        <div className="flex gap-2">
          <School size={"30"} />
          <h1 className="font-extrabold text-2xl">HD-Learing</h1>
        </div>
        <MobileNavbar user={user}/>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({user}) => {
  // const {user} = useSelector(store=> store.auth)
  const navigate = useNavigate()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className={"rounded-full hover:bg-gray-500"}
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className={"flex flex-col"}>
        <SheetHeader
          className={
            "flex font-extrabold text-[20px] flex-row items-center justify-between mt-7"
          }
        >
          <SheetTitle>HD-Learning</SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-3 font-medium ml-5">
          <span>Edit Profile</span>
          <span>My Learning</span>
          <p>Log Out</p>
        </nav>

        {user?.role === "instructor" && (
          <SheetClose asChild>
            <Button type="submit" className={" flex self-center w-[90%]"} onClick={()=> navigate("/admin/dashboard")}>
              Dashboard
            </Button>
          </SheetClose>
        )}
      </SheetContent>
    </Sheet>
  );
};
