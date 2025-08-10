import React, { useEffect, useReducer, useState } from "react";
import type { CourseType } from "../Types/SchemaTypes";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import HTMLReactParser from "html-react-parser/lib/index";
import { FiChevronsDown } from "react-icons/fi";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
const URL = import.meta.env.VITE_Backend_URL;
import { FaRegFilePdf } from "react-icons/fa";
import { PageLoader } from "../utils/Utils";
const FILE_URL = import.meta.env.VITE_FILE_URL;

type VideoAction =
  | { type: "SET_VIDEO"; payload: string }
  | { type: "INIT_VIDEO"; payload: string };

const videoReducer = (state: string, action: VideoAction): string => {
  switch (action.type) {
    case "SET_VIDEO":
      return action.payload;
    case "INIT_VIDEO":
      return action.payload;
    default:
      return state;
  }
};

export const CourseDetailPage = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState<number | null>(null);
  const params = useParams();
  const courseId = params.id;
  const [data, setData] = useState<CourseType>();
  const [activeVideo, dispatchVideo] = useReducer(videoReducer, "");
  console.log(activeVideo);

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
        if (datas?.module?.length > 0 && datas.module[0].video.length > 0) {
          dispatchVideo({
            type: "INIT_VIDEO",
            payload: datas.module[0].video[0],
          });
        }
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
  return (
    <>
      <ToastContainer />
      {data ? (
        <div className="p-2 mx-auto md:w-[95%]">
          <div className="flex gap-2 flex-wrap">
            <div className="mt-3 lg:w-[68%] space-y-5">
              <div className="flex flex-col ">
                <div>
                  {data.module.length > 0 &&
                    data.module.map((m, index) => (
                      <React.Fragment key={index}>
                        <div className=" p-2 hover:!bg-gray-50 text-lg bg-white rounded-lg font-bold ">
                          <span className="flex justify-between  cursor-pointer items-center">
                            <div className="flex items-center justify-between gap-2">
                              <video
                                src={`${FILE_URL}/${activeVideo}`}
                                controls
                              />
                            </div>
                            <div className="flex gap-3 item-center"></div>
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                </div>
                <div>
                  <h1>{data.courseTitle}</h1>
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
                    Duration:{" "}
                    <span className="opacity-60">{data.duration}</span>
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
            <div className="mt-4 lg:w-[30%]">
              <div className=" mt-4  space-y-2 ">
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
                          <div className="flex gap-3 item-center"></div>
                        </span>
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
                              <div className="flex w-full justify-between text-black items-center gap-2">
                                <div
                                  onClick={() =>
                                    dispatchVideo({
                                      type: "SET_VIDEO",
                                      payload: v,
                                    })
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <MdOutlineSlowMotionVideo size={60} />
                                  {v}
                                </div>
                              </div>
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
                            </div>
                          ))}
                      </div>
                    </React.Fragment>
                  ))}
              </div>
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
