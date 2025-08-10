import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const URL = import.meta.env.VITE_Backend_URL;
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import JoditEditor from "jodit-react";
import type { CourseType } from "../../../Types/SchemaTypes";
import { Loader, PageLoader } from "../../../utils/Utils";

const FILE_URL = import.meta.env.VITE_FILE_URL;

export const UpdateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const courseId = params.id;
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
      Placeholder: "Start typings...",
    }),
    []
  );
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

  const [formData, setFormData] = useState({
    courseTitle: "",

    duration: "",
    thumbnail: null,

    description: "",
    status: false,
    path: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        courseTitle: data.courseTitle || "",
        duration: data.duration || "",
        thumbnail: null,
        description: data.description || "",
        status: data.status === "true" ? true : false,
        path: data.path || "",
      });
    }
  }, [data]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, files, checked } = target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files?.[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        const maybeFile = value as unknown;
        if (maybeFile instanceof File) {
          courseFormData.append(key, maybeFile);
        } else {
          courseFormData.append(key, String(value));
        }
      });

      const res = await fetch(`${URL}/update-course/${courseId}`, {
        method: "PUT",
        body: courseFormData,
      });

      if (!res.ok) {
        toast.error("Failed");
      } else {
        toast.success("Course updated successfully!");
      }
    } catch (err) {
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
      navigate(-1);
    }
  };

  return (
    <>
      <ToastContainer />
      {data ? (
        <div className="">
          <h1>Add Course</h1>{" "}
          <Form
            onSubmit={handleSubmit}
            className="mt-10 text-black font-medium lg:!pl-10 space-y-5 p-3 rounded-lg bg-white"
          >
            <h5 className="flex !text-[1.8rem] items-center gap-2 mb-4">
              <div className="h-[0.6rem] w-[2rem] rounded-xl bg-green-700"></div>
              Basic Information
            </h5>
            <Form.Group
              as={Col}
              controlId="formGridEmail"
              className="max-w-[30rem]"
            >
              <Form.Label>Course Title</Form.Label>
              <Form.Control
                type="text"
                name="courseTitle"
                value={formData.courseTitle}
                onChange={handleFormChange}
                className="border-black !border-[0.1rem]"
                placeholder="Enter Course title"
              />
            </Form.Group>

            <Form.Group
              as={Col}
              className="max-w-[30rem]"
              controlId="formGridPassword"
            >
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleFormChange}
                className="border-black !border-[0.1rem]"
                placeholder="Description"
              />
            </Form.Group>

            {data?.thumbnail && (
              <img
                src={`${FILE_URL}/${data.thumbnail}`}
                alt="thumbnail"
                className="w-32 h-32 object-cover mb-2"
              />
            )}

            <Form.Group className="max-w-[30rem]" controlId="formGridAddress2">
              <Form.Label>Thumbnail</Form.Label>
              <Form.Control
                type="file"
                name="thumbnail"
                onChange={handleFormChange}
                className="border-black !border-[0.1rem]"
                placeholder="Apartment, studio, or floor"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Description</Form.Label>
              <JoditEditor
                ref={editor}
                className="border-black !border-[0.1rem]"
                config={config}
                value={formData.description}
                name="description"
                tabIndex={1}
                onChange={(newContent) =>
                  setFormData((prev) => ({ ...prev, description: newContent }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" id="formGridCheckbox">
              <Form.Check
                type="checkbox"
                label="Active"
                name="status"
                checked={formData.status}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group className="max-w-[30rem]" controlId="formGridAddress2">
              <Form.Label>Path</Form.Label>
              <Form.Control
                type="text"
                name="path"
                value={formData.path}
                onChange={handleFormChange}
                className="border-black !border-[0.1rem]"
                placeholder="Social public link"
              />
            </Form.Group>

            {/* <h5 className="flex !text-[1.8rem] items-center gap-2 mb-4">
              <div className="h-[0.6rem] w-[2rem] rounded-xl bg-green-700"></div>
              Add Contents
            </h5> */}
            <div className="flex  flex-col">
              {/* <Button
                variant="success"
                onClick={addModule}
                className="mb-3 w-fit"
              >
                + New Chapter
              </Button> */}
              {/* {modules.map((mod, idx) => (
                <div key={idx} className="my-5 border p-2">
                  <Form.Group
                    className="max-w-[30rem]"
                    controlId="formGridAddress2"
                  >
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={mod.title}
                      onChange={(e) =>
                        updateModuleField(idx, "title", e.target.value)
                      }
                      className="border-black !border-[0.1rem]"
                      placeholder="Price"
                    />
                  </Form.Group>
                  <Form.Group
                    className="max-w-[30rem]"
                    controlId="formGridAddress2"
                  >
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={mod.description}
                      onChange={(e) =>
                        updateModuleField(idx, "description", e.target.value)
                      }
                      className="border-black !border-[0.1rem]"
                      placeholder="Price"
                    />
                  </Form.Group>
                </div>
              ))} */}
              <Button variant="primary" type="submit" className="w-2/5 mx-auto">
                <span>{loading ? <Loader /> : "Update Values"}</span>
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <PageLoader />
      )}
    </>
  );
};
