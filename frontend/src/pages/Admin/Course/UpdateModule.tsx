import { Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import type { ModuleType } from "../../../Types/SchemaTypes";
import { Loader, PageLoader } from "../../../utils/Utils";
const URL = import.meta.env.VITE_Backend_URL;

const UpdateModule = () => {
  const params = useParams();
  const moduleId = params.id;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ModuleType>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const course = await fetch(`${URL}/get-module/${moduleId}`);
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

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",

        description: data.description || "",
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${URL}/update-module/${moduleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const response = await res.json();
      console.log(response);
      if (!res.ok) {
        toast.error("Failed !");
      } else {
        toast.success(response.message);
      }
    } catch (err) {
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };
  console.log(data);
  return (
    <>
      <ToastContainer />
      {data ? (
        <div className="">
          <h1>Update Module</h1>{" "}
          <Form
            onSubmit={handleSubmit}
            className="mt-10 text-black font-medium lg:!pl-10 space-y-5 p-3 rounded-lg bg-white"
          >
            <div className="flex  flex-col">
              <div className="my-5 border p-2">
                <Form.Group
                  className="max-w-[30rem]"
                  controlId="formGridAddress2"
                >
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
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
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="border-black !border-[0.1rem]"
                    placeholder="Price"
                  />
                </Form.Group>
                {/* <Form.Group
                  className="max-w-[30rem]"
                  controlId="formGridAddress2"
                >
                  <Form.Label>File</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      const files = target.files
                        ? Array.from(target.files)
                        : [];
                      setFormData((prev) => ({ ...prev, file: files }));
                    }}
                    className="border-black !border-[0.1rem]"
                    placeholder="Price"
                  />
                </Form.Group> */}

                {/* {data.file.length > 0 &&
                  data.file.map((f) => (
                    <>
                      <Link
                        to={`${FILE_URL}/${f}`}
                        target="blank"
                        className="flex !text-black items-center gap-2"
                      >
                        <FaRegFilePdf size={40} />
                        {f}
                      </Link>
                      <hr />
                    </>
                  ))} */}

                {/* <Form.Group
                  className="max-w-[30rem]"
                  controlId="formGridAddress2"
                >
                  <Form.Label>Video</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      const videos = target.files
                        ? Array.from(target.files)
                        : [];
                      setFormData((prev) => ({ ...prev, video: videos }));
                    }}
                    className="border-black !border-[0.1rem]"
                    placeholder="Price"
                  />
                </Form.Group> */}
              </div>
              {/* 
              {data.video.length > 0 &&
                data.video.map((v) => (
                  <>
                    <Link
                      to={`${FILE_URL}/${v}`}
                      target="blank"
                      className="flex text-black items-center gap-2"
                    >
                      <MdOutlineSlowMotionVideo size={60} />
                      {v}
                    </Link>
                    <hr />
                  </>
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

export default UpdateModule;
