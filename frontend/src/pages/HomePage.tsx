import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CourseType } from "../Types/SchemaTypes";
import { toast } from "react-toastify";
import { PageLoader } from "../utils/Utils";
import { ToastContainer } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
const URL = import.meta.env.VITE_Backend_URL;
const File_URL = import.meta.env.VITE_FILE_URL;

const HomePage = () => {
  const { query } = useOutletContext<{ query: string }>();
  const [pageLoader, setPageLoader] = useState(true);
  const count = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<CourseType[]>([]);
  const [filter, setFilter] = useState<CourseType[]>([]);
  const fetchData = async () => {
    try {
      const course = await fetch(`${URL}/get-allcourse`);
      const result = await course.json();
      if (!course.ok) {
        toast.error(result.message);
      } else {
        setData(result);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setPageLoader(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const totalItems = filter.length > 0 ? filter.length : data?.length || 0;
  const totalPages = Math.ceil(totalItems / count);
  const paginatedItems =
    filter?.length > 0
      ? filter?.slice((currentPage - 1) * count, currentPage * count)
      : data?.slice((currentPage - 1) * count, currentPage * count);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (query && query.length > 0) {
      setFilter(
        data?.filter((product) =>
          product.courseTitle.toLowerCase().includes(query.toLowerCase())
        ) || []
      );
    } else {
      setFilter([]);
    }
  }, [query, data]);
  return (
    <div className="md:w-[95%] mt-10 sm:mt-20 mx-auto">
      <ToastContainer />
      {!pageLoader ? (
        paginatedItems.length > 0 ? (
          <>
            <div className="flex justify-center flex-wrap gap-4">
              {paginatedItems &&
                paginatedItems.length > 0 &&
                paginatedItems.map((d, index) => (
                  <div
                    key={index}
                    className="bg-neutral-100 shadow-sm border font-lexend rounded-xl p-[10px] w-full mx-auto  max-w-[300px] xl:max-w-[360px]"
                  >
                    <div className="flex flex-col ">
                      <img
                        src={`${File_URL}/${d.thumbnail}`}
                        alt="Image May not be availabe as render don`t haev free storage "
                        className="h-[15rem] object-contain"
                      />
                      <div className="flex gap-3 justify-between mt-1">
                        <span className="p-1 px-2   rounded-lg text-black">
                          {d.status === "true" ? "Active" : "Inactive"}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <FaStar color="#FFC300" />
                          4.5(1234)
                        </span>
                      </div>
                      <h5 className="mt-1">{d.courseTitle}</h5>

                      <div className="relative inline-block    py-2 text-sm">
                        Duration: {d.duration}
                      </div>
                      <hr />
                      <div className="flex justify-center mb-1 gap-3 text-white font-semibold">
                        <Link
                          to={`course-detail/${d.courseId}`}
                          className="bg-green-600 text-white !no-underline w-full p-2 hover:bg-green-700 text-center !rounded-lg"
                        >
                          Explore
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex items-center justify-center space-x-2 my-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <span className="text-center flex  w-full h-screen">
            No Data Found
          </span>
        )
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

export default HomePage;
