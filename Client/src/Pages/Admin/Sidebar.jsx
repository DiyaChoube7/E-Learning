import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState({
    status: false,
    link: ''
  })

  useEffect(() => {
    if(location.pathname.includes("course")){
      setIsActive({
        status: true,
        link: 'course'
      })
    }
    if(location.pathname.includes("dashboard")){
      setIsActive({
        status: true,
        link: 'dashboard'
      })
    }
  }, [location]);

  return (
    <div className="flex">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 sticky top-0 h-screen">
        <div className="space-y-4 mt-20">
          <Link to={"dashboard"} className="flex items-center gap-2">
            <ChartNoAxesColumn size={22} className={isActive.status===true && isActive.link === 'dashboard' ? 'text-blue-500' : ''}/>
            <h1 className={isActive.status===true && isActive.link === 'dashboard' ? 'text-blue-500' : ''}>Dashboard</h1>
          </Link>
          <Link to={"course"} className="flex items-center gap-2">
            <SquareLibrary size={22} className={isActive.status===true && isActive.link === 'course' ? 'text-blue-500' : ''}/>
            <h1 className={isActive.status===true && isActive.link === 'course' ? 'text-blue-500' : ''}>Courses</h1>
          </Link>
        </div>
      </div>

      <div className="flex-1 md:p-20 p-2 mt-20 ml-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
