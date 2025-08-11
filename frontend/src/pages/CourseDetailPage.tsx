import React, { useEffect, useReducer, useState } from "react";
import type { CommentTypes, CourseType } from "../Types/SchemaTypes";
import { toast, ToastContainer } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import HTMLReactParser from "html-react-parser/lib/index";
import { FiChevronsDown } from "react-icons/fi";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
const URL = import.meta.env.VITE_Backend_URL;
import { FaRegFilePdf } from "react-icons/fa";
import { Loader, PageLoader } from "../utils/Utils";
import { Button, Form, InputGroup } from "react-bootstrap";
const FILE_URL = import.meta.env.VITE_FILE_URL;

type VideoPayload = {
  video: string;
  moduleId: number;
};
type VideoAction =
  | { type: "SET_VIDEO"; payload: VideoPayload }
  | { type: "INIT_VIDEO"; payload: VideoPayload };

const videoReducer = (
  state: VideoPayload,
  action: VideoAction
): VideoPayload => {
  switch (action.type) {
    case "SET_VIDEO":
    case "INIT_VIDEO":
      return action.payload;
    default:
      return state;
  }
};

export const CourseDetailPage = () => {
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<number | null>(null);
  const params = useParams();
  const courseId = params.id;
  const [data, setData] = useState<CourseType>();
  const [comments, setComments] = useState<CommentTypes[]>([]);
  const [activeVideo, dispatchVideo] = useReducer(videoReducer, {
    video: "",
    moduleId: 0,
  });

  const id = activeVideo.moduleId;

  const sessionData = sessionStorage.getItem("user");
  const user = sessionData ? JSON.parse(sessionData) : null;
  const userId = user.userId;

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
            payload: {
              video: datas.module[0].video[0],
              moduleId: datas.module[0].moduleId,
            },
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
  const [msg, setMsg] = useState("");

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${URL}/user-comment/${userId}/module-comment/${activeVideo.moduleId}`
      );
      const datas = await res.json();
      if (!res.ok) {
        toast.error("Error in Fetching Comments!");
      } else {
        setComments(datas);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch(`${URL}/add-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg, userId, moduleId: id }),
      });
      if (!res.ok) {
        toast.error("Failed to add");
      } else {
        toast.success("COmment Added");
        setMsg("");
        fetchComments();
      }
    } catch (error: any) {
      toast.error("Failed to add !");
    } finally {
      setLoading(false);
    }
  };

  const DeleteComment = async (id: number) => {
    const Okey = confirm(" Delete this Comment ? ");
    if (!Okey) return;
    try {
      setLoading(true);

      const res = await fetch(`${URL}/delete-comment/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Failed to add");
      } else {
        toast.success("Comment Added");
        setComments((prev) => prev.filter((c) => c.commentId != id));
      }
    } catch (error: any) {
      toast.error("Failed to add !");
    } finally {
      setLoading(false);
    }
  };

  const updateProgressApi = async (
    userId: number,
    moduleId: number,
    videoName: string | null,
    fileName: string | null
  ) => {
    try {
      console.log("HIt");
      await fetch(`${URL}/update-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, moduleId, videoName, fileName }),
      });
    } catch (err) {
      console.error("Progress update failed", err);
    }
  };

  const [progress, setProgress] = useState();
  useEffect(() => {
    fetch(`${URL}/course-progress/${userId}/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Progress: ${data.percentage}%`);
        setProgress(data.percentage);
      });
  }, [userId, courseId]);

  return (
    <>
      <ToastContainer />
      {data ? (
        <div className="p-2 mx-auto md:w-[95%]">
          <div className="flex gap-2 flex-wrap">
            <div className="mt-3 lg:w-[68%] space-y-5">
              <div className="flex flex-col ">
                <div>
                  <React.Fragment>
                    <div className=" p-2 hover:!bg-gray-50 text-lg bg-white rounded-lg font-bold ">
                      <span className="flex justify-between  cursor-pointer items-center">
                        <div className="flex items-center justify-between gap-2">
                          <video
                            src={`${FILE_URL}/${activeVideo.video}`}
                            controls
                            className="max-h-screen"
                          />
                        </div>
                      </span>
                    </div>
                  </React.Fragment>
                </div>
                <div>
                  <Form className="flex gap-2" onSubmit={handleSubmit}>
                    <InputGroup className="">
                      <Form.Control
                        placeholder="Comment or provide feedback.."
                        value={msg}
                        name="msg"
                        onChange={(e) => setMsg(e.target.value)}
                        className="p-1  border-black placeholder:text-xs"
                      />
                    </InputGroup>
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-fit  mx-auto"
                    >
                      <span>{loading ? <Loader /> : "Submit"}</span>
                    </Button>
                  </Form>
                  <div className="flex items-center flex-wrap justify-between mt-4">
                    <h1 className="">{data.courseTitle}</h1>
                    <p className="bg-yellow-500 p-1 h-fit rounded w-fit text-white">
                      {progress}% completed
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between flex-wrap gap-4 mt-4">
                <img
                  src={`${FILE_URL}/${data.thumbnail}`}
                  alt="thumbnail"
                  width={100}
                  height={100}
                />

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
              <p className="text-justify">
                {HTMLReactParser(data.description)}
              </p>
            </div>
            <div className="sm:mt-4  overflow-auto lg:w-[30%]">
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
                                  onClick={() => {
                                    dispatchVideo({
                                      type: "SET_VIDEO",
                                      payload: {
                                        video: v,
                                        moduleId: m.moduleId || 0,
                                      },
                                    });
                                    updateProgressApi(
                                      userId,
                                      m.moduleId || 0,
                                      v,
                                      null
                                    );
                                  }}
                                  className="flex items-center cursor-pointer gap-2"
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
                                onClick={() =>
                                  updateProgressApi(
                                    userId,
                                    m.moduleId || 0,
                                    null,
                                    f
                                  )
                                }
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
          <h6 className="mt-3">Your Comments</h6>
          {comments.length > 0 &&
            comments.map((c, i) => (
              <div className="w-full bg-neutral-100  sm:min-w-[25rem] max-w-[30rem] p-2">
                <li className="flex  p-2 gap-3  items-center justify-between">
                  <div>{i + 1}.</div>
                  <div>{c.message}</div>
                  <div className="text-xs">{c.createdAt.split("T")[0]}</div>
                  <button
                    onClick={() => DeleteComment(c.commentId || 0)}
                    className="!text-xs underline hover:text-blue-500"
                  >
                    Delete
                  </button>
                </li>
                <hr />
              </div>
            ))}
        </div>
      ) : (
        <>
          <PageLoader />
        </>
      )}
    </>
  );
};
