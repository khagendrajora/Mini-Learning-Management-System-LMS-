import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Form from "react-bootstrap/Form";
const URL = import.meta.env.VITE_Backend_URL;
const FILE_URL = import.meta.env.VITE_FILE_URL;
import HTMLReactParser from "html-react-parser/lib/index";

import { FiChevronsDown } from "react-icons/fi";
import {
  MdDeleteForever,
  MdOutlineAddToDrive,
  MdOutlineSlowMotionVideo,
} from "react-icons/md";
import { FaRegEdit, FaRegFilePdf } from "react-icons/fa";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { FaXmark } from "react-icons/fa6";
import type { CourseType } from "../../../Types/SchemaTypes";
import { Loader, PageLoader } from "../../../utils/Utils";

export const CourseDescription = () => {
  const [loading, setLoading] = useState<number | null>();
  const [moduleSubmitLoader, setModuleSubmitLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [moduleForm, setModuleForm] = useState(false);
  const [moduleFileForm, setModuleFileForm] = useState<number | null>(null);
  const navigate = useNavigate();
  const [key, setKey] = useState<number | null>(null);
  const params = useParams();
  const courseId = params.id;
  const [data, setData] = useState<CourseType>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const course = await fetch(`${URL}/get-course/${courseId}`);
      const datas = await course.json();
      if (!course.ok) {
        toast.error("Error !");
      } else {
        setData(datas);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleList = (i: number) => {
    if (key === i) {
      setKey(null);
      return;
    } else {
      setKey(i);
      return;
    }
  };

  const handleDelete = async (id: number) => {
    const Okey = confirm(" Delete this module? ");
    if (!Okey) return;

    setLoading(id);
    try {
      const res = await fetch(`${URL}/delete-module/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      console.log(response);
      if (!res.ok) {
        toast.error("Failed !");
      } else {
        toast.success("Module Deleted");
        fetchData();
      }
    } catch (error: any) {
      toast.error("Failed !");
    } finally {
      setLoading(null);
    }
  };

  const [moduleData, setModuleData] = useState<{
    title: string;
    description: string;
    file: File[];
    video: File[];
  }>({
    title: "",
    description: "",
    file: [],
    video: [],
  });

  const [moduleFile, setModuleFile] = useState<{
    file: File[];
    video: File[];
  }>({
    file: [],
    video: [],
  });

  //Addind New Module
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      const form = new FormData();
      form.append("title", moduleData.title);
      form.append("description", moduleData.description);
      moduleData.file.forEach((f) => {
        form.append("file", f);
      });
      moduleData.video.forEach((v) => {
        form.append("video", v);
      });
      const res = await fetch(`${URL}/add-module/${courseId}`, {
        method: "POST",
        body: form,
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Module Added");
        setModuleData({
          title: "",
          description: "",
          file: [],
          video: [],
        });
        setModuleForm(false);
        fetchData();
      } else {
        toast.error("Failed", result.meessage);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLoader(false);
    }
  };

  //Adding Files TO module
  const handleModule = async (e: any) => {
    e.preventDefault();
    setModuleSubmitLoader(true);
    try {
      const form = new FormData();

      moduleFile.file.forEach((f) => {
        form.append("file", f);
      });
      moduleFile.video.forEach((v) => {
        form.append("video", v);
      });
      const res = await fetch(`${URL}/add-file-to-module/${moduleFileForm}`, {
        method: "PUT",
        body: form,
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("New File Added");
        setModuleFile({
          file: [],
          video: [],
        });
      } else {
        toast.error("Failed", result.meessage);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setModuleFileForm(null);
    }
  };

  //delete individual File of module
  const deleteModuleFile = async (id: number, v: string, type: string) => {
    const Okey = confirm(" Delete this File? ");
    if (!Okey) return;
    try {
      const res = await fetch(`${URL}/remove-files-from-module/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ v, type }),
      });

      if (!res.ok) {
        toast.error("Failed");
      } else {
        toast.success("Removed");
      }
    } catch (error: any) {
      toast.error("Failed to Remove");
    }
  };

  return (
    <>
      <ToastContainer />
      {data ? (
        <div className="p-2">
          <div className="mt-3 space-y-5">
            <div className="flex justify-between ">
              <div>
                <h1>{data.courseTitle}</h1>
              </div>
              <div>
                <button
                  onClick={() =>
                    navigate(`/admin/course/course-update/${courseId}`)
                  }
                  className="bg-[var(--darkGreen)] text-white p-2 button !rounded-lg"
                >
                  Update Course
                </button>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <img
                src={`${FILE_URL}/${data.thumbnail}`}
                alt="thumbnail"
                width={100}
                height={100}
              />
              <div className="grid w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:!gap-5">
                <h6>
                  Duration: <span className="opacity-60">{data.duration}</span>
                </h6>

                <h6
                  className={`${
                    data.status === "true" ? "!text-green-600" : "text-black"
                  }`}
                >
                  Status:{" "}
                  <span className="opacity-60">
                    {data.status === "true" ? "Active" : "Inactive"}
                  </span>
                </h6>
              </div>
            </div>
            <p>{HTMLReactParser(data.description)}</p>
          </div>
          <div className="mt-4">
            <div className="flex gap-5 items-baseline">
              <h2>Course Content</h2>
              <Button
                variant="success"
                onClick={() => setModuleForm(true)}
                className="p-1 h-fit !text-sm w-fit"
              >
                + New Chapter
              </Button>
            </div>
            <Form
              onSubmit={handleSubmit}
              className={`${
                moduleForm ? "block" : "hidden"
              } my-2  max-w-[30rem] text-black font-medium lg:!pl-5 space-y-5 p-3 rounded-lg bg-white`}
            >
              <div>
                <HiArchiveBoxXMark
                  size={30}
                  className="text-red-600  cursor-pointer hover:scale-110 "
                  title="Cancel"
                  onClick={() => {
                    setModuleData({
                      title: "",
                      description: "",
                      file: [],
                      video: [],
                    }),
                      setModuleForm(false);
                  }}
                />
                <Form.Group
                  className="max-w-[30rem] mt-3"
                  controlId="formGridAddress2"
                >
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={moduleData.title}
                    onChange={(e) =>
                      setModuleData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="border-black !border-[0.1rem]"
                    placeholder="Title"
                  />
                </Form.Group>
                <Form.Group
                  className="max-w-[30rem] mt-3"
                  controlId="formGridAddress2"
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={moduleData.description}
                    onChange={(e) =>
                      setModuleData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="border-black !border-[0.1rem]"
                    placeholder="Description"
                  />
                </Form.Group>
                <Form.Group
                  className="max-w-[30rem] mt-3"
                  controlId="formGridAddress2"
                >
                  <Form.Label>File</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      setModuleData((prev) => ({
                        ...prev,
                        file: target.files ? Array.from(target.files) : [],
                      }));
                    }}
                    className="border-black !border-[0.1rem]"
                    placeholder="Price"
                  />
                </Form.Group>

                <Form.Group
                  className="max-w-[30rem] mt-3"
                  controlId="formGridAddress2"
                >
                  <Form.Label>Video</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      setModuleData((prev) => ({
                        ...prev,
                        video: target.files ? Array.from(target.files) : [],
                      }));
                    }}
                    className="border-black !border-[0.1rem]"
                    placeholder="Price"
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="max-w-[30rem] my-3 mx-auto"
                >
                  <span>{loader ? <Loader /> : "Submit"}</span>
                </Button>
              </div>
            </Form>

            <div className=" mt-4 max-w-[35rem] space-y-2 ">
              {data.module.length > 0 &&
                data.module.map((m, index) => (
                  <React.Fragment key={index}>
                    <div className=" p-2 hover:!bg-gray-50 text-lg bg-white rounded-lg font-bold ">
                      <span className="flex justify-between  cursor-pointer items-center">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-end"
                            onClick={() => handleList(index)}
                          >
                            <FiChevronsDown
                              size={30}
                              className={`${
                                key === index ? "rotate-180" : "rotate-0"
                              } transition-all duration-700 hover:scale-110`}
                            />
                          </span>
                          {m.title}
                        </div>
                        <div className="flex gap-3 item-center">
                          <span className="text-end">
                            <MdOutlineAddToDrive
                              title="Add Files"
                              size={30}
                              onClick={() => setModuleFileForm(m.moduleId)}
                              className={`hover:scale-110 transition-all duration-500`}
                            />
                          </span>

                          <button className="text-rose-700">
                            {loading === m.moduleId ? (
                              <Loader />
                            ) : (
                              <MdDeleteForever
                                size={30}
                                title="Delete"
                                className="hover:scale-110"
                                onClick={() => handleDelete(m.moduleId)}
                              />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/course/course-detail/module-update/${m.moduleId}`
                              )
                            }
                            className="text-blue-700 hover:scale-110"
                          >
                            <FaRegEdit size={30} title="Edit" />
                          </button>
                        </div>
                      </span>
                    </div>
                    <div
                      className={`${
                        moduleFileForm === m.moduleId ? "block" : "hidden"
                      }`}
                    >
                      <Form
                        onSubmit={handleModule}
                        className="mt-10 relative  text-black font-medium lg:!pl-10 space-y-5 p-3 rounded-lg bg-white"
                      >
                        <FaXmark
                          size={30}
                          className="text-red-600 absolute right-2 top-1  cursor-pointer hover:scale-110 "
                          title="Cancel"
                          onClick={() => {
                            setModuleFile({
                              file: [],
                              video: [],
                            }),
                              setModuleFileForm(null);
                          }}
                        />
                        <Form.Group
                          className="max-w-[30rem] mt-3"
                          controlId="formGridAddress2"
                        >
                          <Form.Label>File</Form.Label>
                          <Form.Control
                            type="file"
                            multiple
                            onChange={(e) => {
                              const target = e.target as HTMLInputElement;
                              setModuleFile((prev) => ({
                                ...prev,
                                file: target.files
                                  ? Array.from(target.files)
                                  : [],
                              }));
                            }}
                            className="border-black !border-[0.1rem]"
                            placeholder="Price"
                          />
                        </Form.Group>

                        <Form.Group
                          className="max-w-[30rem] mt-3"
                          controlId="formGridAddress2"
                        >
                          <Form.Label>Video</Form.Label>
                          <Form.Control
                            type="file"
                            multiple
                            onChange={(e) => {
                              const target = e.target as HTMLInputElement;
                              setModuleFile((prev) => ({
                                ...prev,
                                video: target.files
                                  ? Array.from(target.files)
                                  : [],
                              }));
                            }}
                            className="border-black !border-[0.1rem]"
                            placeholder="Price"
                          />
                        </Form.Group>
                        <Button
                          variant="primary"
                          type="submit"
                          className="max-w-[30rem] my-3 mx-auto"
                        >
                          <span>
                            {moduleSubmitLoader ? <Loader /> : "Submit"}
                          </span>
                        </Button>
                      </Form>
                    </div>
                    <div
                      className={`${
                        key === index
                          ? "block opacity-100 h-auto"
                          : "hidden opacity-0 h-0"
                      }  bg-white  p-2 space-y-3 rounded-b-2xl transition-all duration-700  border-t-0 border-b-1`}
                    >
                      {m.video.length > 0 &&
                        m.video.map((v) => (
                          <div className="flex items-center border-b-1 border-gray-200">
                            <Link
                              to={`${FILE_URL}/${v}`}
                              target="blank"
                              className="flex w-full justify-between text-black items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <MdOutlineSlowMotionVideo size={60} />
                                {v}
                              </div>
                            </Link>
                            <HiArchiveBoxXMark
                              size={30}
                              className="text-red-600 text-end w-fit cursor-pointer hover:scale-110 "
                              title="Delete"
                              onClick={() =>
                                deleteModuleFile(m.moduleId, v, "video")
                              }
                            />
                          </div>
                        ))}

                      {m.file.length > 0 &&
                        m.file.map((f) => (
                          <div className="flex items-center py-2 border-b-1 border-gray-200">
                            <Link
                              to={`${FILE_URL}/${f}`}
                              target="blank"
                              className="flex  w-full justify-between !text-black items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <FaRegFilePdf size={40} />
                                {f}
                              </div>
                            </Link>
                            <HiArchiveBoxXMark
                              size={30}
                              className="text-red-600 text-end w-fit cursor-pointer hover:scale-110 "
                              title="Delete"
                              onClick={() =>
                                deleteModuleFile(m.moduleId, f, "file")
                              }
                            />
                          </div>
                        ))}
                    </div>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <PageLoader />
        </>
      )}
    </>
  );
};
