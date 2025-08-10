import { AiOutlineBars } from "react-icons/ai";
import { FaStar, FaUserPlus } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { TfiPencilAlt } from "react-icons/tfi";
import { TiBook } from "react-icons/ti";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error: any) {
      toast.error("logout Failed");
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <AiOutlineBars />
              </button>
              <a href="/" className="flex ms-2 md:me-24">
                <img src="/lmslogo.png" className="h-8 me-3" alt="" />
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex text-sm bg-black text-white p-2 !rounded-lg"
                  aria-expanded="false"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-24 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full !space-y-4 pb-4 px-4 overflow-y-auto bg-white ">
          <Link to="/admin" className="!no-underline">
            <h2
              className={`flex !text-[1.2rem] gap-3 text-black  hover:!text-green-500 cursor-pointer items-center`}
            >
              {" "}
              <FaHouse /> Dashboard{" "}
            </h2>
          </Link>
          <div>
            <h6 className="!text-[1rem] !text-gray-500">Course management</h6>
            <ul className="!space-y-1 font-medium">
              <li className="flex items-center p-1  rounded-lg hover:text-green-500 hover:bg-gray-100 text-black !no-underline">
                <span className="flex-1 flex items-center gap-2  whitespace-nowrap">
                  <FaUserPlus />{" "}
                  <Link
                    to="/admin/course/addcourse"
                    className={`${
                      path === "/admin/course/addcourse"
                        ? "!text-green-500"
                        : "!text-black"
                    } flex items-center p-1  rounded-lg hover:!text-green-500  text-black !no-underline`}
                  >
                    Add New Course
                  </Link>
                </span>
              </li>
              <li className="flex items-center p-1  rounded-lg hover:text-green-500 hover:bg-gray-100 text-black !no-underline">
                <span className="flex-1 flex items-center gap-2 whitespace-nowrap">
                  <TiBook />{" "}
                  <Link
                    to="/admin/course"
                    className={`${
                      path === "/admin/course"
                        ? "!text-green-500"
                        : "!text-black"
                    } flex items-center p-1  rounded-lg hover:!text-green-500   !no-underline`}
                  >
                    Course List
                  </Link>
                </span>
              </li>

              <li>
                <a
                  href="#"
                  className="flex items-center p-1  rounded-lg hover:text-green-500 hover:bg-gray-100 text-black !no-underline"
                >
                  <span className="flex-1 flex items-center gap-2  whitespace-nowrap">
                    <TfiPencilAlt />
                    Assignments
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-1  rounded-lg hover:text-green-500 hover:bg-gray-100 text-black !no-underline"
                >
                  <span className="flex-1 flex items-center gap-2  whitespace-nowrap">
                    <FaStar />
                    Review
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <div className="bg-gray-100 p-2 mt-16 h-full sm:ml-64">
        <Outlet />
      </div>
    </>
  );
};
