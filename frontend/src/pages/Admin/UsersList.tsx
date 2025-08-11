import { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { toast, ToastContainer } from "react-toastify";
import { GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { HiArchiveBoxXMark } from "react-icons/hi2";

import type { User } from "../../Types/SchemaTypes";
import { PageLoader } from "../../utils/Utils";

const URL = import.meta.env.VITE_Backend_URL;

export const UsersList = () => {
  const navigate = useNavigate();
  const [deleteLoader, setdeleteLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(true);
  const count = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<User[]>([]);
  const [filter, setFilter] = useState<User[]>([]);

  const fetchData = async () => {
    try {
      const course = await fetch(`${URL}/get-users`);
      const result = await course.json();
      if (!course.ok) {
        toast.error(result.message);
      } else {
        const filterData = result.filter((u: User) => u.role === "STUDENT");

        setData(filterData);
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

  const handleSearch = (query: string) => {
    const filter = data.filter(
      (d) => d.name.toLowerCase() === query.toLowerCase()
    );
    if (filter.length > 0) {
      setFilter(filter);
    } else {
      setFilter([]);
    }
  };
  const deleteUser = async (id: number) => {
    const Okey = confirm(" Delete this USer ? ");
    if (!Okey) return;
    try {
      setdeleteLoader(true);
      const response = await fetch(`${URL}/delete-user/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        toast.error("Failed to Delete!");
      } else {
        toast.success("Deleted");
        setData(data.filter((d) => d.userId != id));
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setdeleteLoader(false);
    }
  };
  return (
    <>
      <ToastContainer />
      <h1>User List</h1>{" "}
      {!pageLoader ? (
        paginatedItems.length > 0 ? (
          <div className="">
            {deleteLoader === true && (
              <div className="absolute inset-0 bg-gray-50 opacity-70">
                <PageLoader />
              </div>
            )}

            <div className=" bg-white p-2  py-3 rounded-xl mt-5">
              {" "}
              <Form.Group
                as={Col}
                className="max-w-[15rem] relative"
                controlId="formGridPassword"
              >
                <Form.Control
                  type="text"
                  name="search"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="border-black !pl-10 !border-[0.1rem]"
                  placeholder="Search...."
                />
                <GoSearch
                  size={25}
                  className="absolute  top-1/2 -translate-y-1/2 ml-2 "
                />
              </Form.Group>
            </div>
            <Table responsive hover striped className="mt-[1.5rem] w-full z-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems &&
                  paginatedItems.length > 0 &&
                  paginatedItems.map((d, index) => (
                    <tr
                      key={index}
                      className="hover:cursor-pointer"
                      onClick={() => navigate(`/admin/user-detail/${d.userId}`)}
                    >
                      <td>{d.userId}</td>

                      <td>{d.name} </td>

                      <td>{d.email} </td>

                      {/* <td>{d.status} </td> */}

                      <td className="grid grid-cols-2 gap-2 z-20 ">
                        <HiArchiveBoxXMark
                          size={20}
                          className="text-red-600  w-fit cursor-pointer hover:scale-110 "
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUser(d.userId || 0);
                          }}
                        />
                        {/* <FaRegEdit
                          size={20}
                          title="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/admin/course/course-update/${d.courseId}`
                            );
                          }}
                          className="text-blue-600 w-fit hover:scale-110 "
                        /> */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
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
          </div>
        ) : (
          <span className="text-center flex  w-full h-screen">
            No Data Found
          </span>
        )
      ) : (
        <PageLoader />
      )}
    </>
  );
};
