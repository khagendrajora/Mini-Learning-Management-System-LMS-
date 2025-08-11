import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PageLoader } from "../../utils/Utils";
const URL = import.meta.env.VITE_Backend_URL;

export const DashboardData = () => {
  const [users, setUsers] = useState<number>();
  const [course, setCourse] = useState<number>();
  const [pageLoader, setPageLoader] = useState(true);

  const fetchData = async () => {
    try {
      const course = await fetch(`${URL}/get-allcourse`);
      const result = await course.json();
      if (!course.ok) {
        toast.error(result.message);
      } else {
        setCourse(result.length);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };
  const fetchUsers = async () => {
    try {
      const course = await fetch(`${URL}/get-users`);
      const result = await course.json();
      if (!course.ok) {
        toast.error(result.message);
      } else {
        const filterData = result.filter((u: any) => u.role === "STUDENT");

        setUsers(filterData.length);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setPageLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);
  return (
    <>
      {!pageLoader ? (
        <>
          <h1 className="mt-2">Admin Dashboard</h1>
          <div className="flex gap-3 mt-4  text-white flex-wrap">
            <div className="p-3 bg-green-400 border min-w-[18rem] sm:min-w-[20rem] rounded shadow">
              <h3>Users</h3>
              <span>{users}</span>
            </div>
            <div className="p-3 bg-blue-600 border  min-w-[18rem] sm:min-w-[20rem] rounded shadow">
              <h3>Courses</h3>
              <span>{course}</span>
            </div>
          </div>
        </>
      ) : (
        <PageLoader />
      )}
    </>
  );
};
