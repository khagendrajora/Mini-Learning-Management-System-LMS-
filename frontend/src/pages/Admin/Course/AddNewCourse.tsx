import JoditEditor from "jodit-react";
import { useMemo, useReducer, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { moduleReducer } from "../../../Reducer/useReducer";
import { Loader } from "../../../utils/Utils";

const AddNewCourse = () => {
  const [loading, setLoading] = useState(false);
  const [modules, dispatch] = useReducer(moduleReducer, []);
  const URL = import.meta.env.VITE_Backend_URL;
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
      Placeholder: "Start typings...",
    }),
    []
  );

  const [formData, setFormData] = useState({
    courseTitle: "",
    thumbnail: null,
    description: "",
    duration: "",
    status: false,
    path: "",
  });

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

  const addModule = () => {
    dispatch({
      type: "ADD_MODULE",
      payload: { title: "", description: "", files: [], videos: [] },
    });
  };

  const updateModuleField = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    dispatch({ type: "UPDATE_MODULE_FIELD", index, field, value });
  };

  const updateModuleFiles = (
    index: number,
    field: "files" | "videos",
    files: FileList
  ) => {
    dispatch({
      type: "UPDATE_MODULE_FIELD",
      index,
      field,
      value: Array.from(files),
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      const maybeFile = value as unknown;

      if (maybeFile instanceof File) {
        form.append(key, maybeFile);
      } else {
        form.append(key, String(value));
      }
    });
    modules.forEach((mod, index) => {
      mod.files.forEach((f) => form.append(`moduleFile_${index}`, f));
      mod.videos.forEach((v) => form.append(`moduleVideo_${index}`, v));
    });

    form.append(
      "module",
      JSON.stringify(
        modules.map((m) => ({
          title: m.title,
          description: m.description,
        }))
      )
    );
    for (const pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await fetch(`${URL}/add-course`, {
        method: "POST",
        body: form,
      });
      const result = await res.json();
      if (result.success === true) {
        toast.success("Course Added");
        setFormData({
          courseTitle: "",
          thumbnail: null,
          description: "",
          duration: "",
          status: false,
          path: "",
        });
      } else {
        toast.error("Failed", result.meessage);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
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
              required
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleFormChange}
              className="border-black !border-[0.1rem]"
              placeholder="Enter Course title"
            />
          </Form.Group>

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

          <Form.Group
            as={Col}
            className="max-w-[30rem]"
            controlId="formGridPassword"
          >
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              name="duration"
              onChange={handleFormChange}
              className="border-black !border-[0.1rem]"
              placeholder="Description"
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
              onChange={handleFormChange}
              className="border-black !border-[0.1rem]"
              placeholder="Social public link"
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

          <h5 className="flex !text-[1.8rem] items-center gap-2 mb-4">
            <div className="h-[0.6rem] w-[2rem] rounded-xl bg-green-700"></div>
            Add Topics with Videos Urls
          </h5>
          <div className="flex  flex-col">
            <Button
              variant="success"
              onClick={addModule}
              className="mb-3 w-fit"
            >
              + Add
            </Button>
            {modules.map((mod, idx) => (
              <div key={idx} className="my-5 border p-2">
                <Form.Group
                  className="max-w-[30rem]"
                  controlId="formGridAddress2"
                >
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={mod.title}
                    onChange={(e) =>
                      updateModuleField(idx, "title", e.target.value)
                    }
                    className="border-black !border-[0.1rem]"
                    placeholder="Title"
                  />
                </Form.Group>
                <Form.Group
                  className="max-w-[30rem]"
                  controlId="formGridAddress2"
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={mod.description}
                    onChange={(e) =>
                      updateModuleField(idx, "description", e.target.value)
                    }
                    className="border-black !border-[0.1rem]"
                    placeholder="Description"
                  />
                </Form.Group>
                <Form.Group
                  className="max-w-[30rem]"
                  controlId="formGridAddress2"
                >
                  <Form.Label>File</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      updateModuleFiles(idx, "files", target.files!);
                    }}
                    className="border-black !border-[0.1rem]"
                    placeholder="Price"
                  />
                </Form.Group>

                <Form.Group
                  className="max-w-[30rem]"
                  controlId="formGridAddress2"
                >
                  <Form.Label>Video</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      updateModuleFiles(idx, "videos", target.files!);
                    }}
                    className="border-black !border-[0.1rem]"
                    placeholder="Price"
                  />
                </Form.Group>
              </div>
            ))}
            <Button variant="primary" type="submit" className="w-2/5 mx-auto">
              <span>{loading ? <Loader /> : "Submit"}</span>
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddNewCourse;
