import { useParams } from "react-router-dom";
import type { UserProgressReport } from "../../Types/SchemaTypes";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
const URL = import.meta.env.VITE_Backend_URL;

export const UserDetail = () => {
  const [data, setData] = useState<UserProgressReport | null>(null);

  const params = useParams();
  const id = params.id;
  console.log(id);

  useEffect(() => {
    fetchProgress();
  }, [id]);
  const fetchProgress = async () => {
    try {
      const response = await fetch(`${URL}/user-progress/${id}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result: UserProgressReport = await response.json();
      setData(result);
    } catch (err: any) {
      toast.error("Failed");
    }
  };
  return (
    <>
      <ToastContainer />
      {data ? (
        <div className="mt-2">
          <h2 className="mb-5">
            Progress Report for {data.name}
            <br />
            <span className="text-lg">{data.email}</span>
          </h2>

          {data.courses.length === 0 ? (
            <p>No course progress available.</p>
          ) : (
            data.courses.map((course) => (
              <div key={course.courseId} style={{ marginBottom: "2rem" }}>
                <h3>
                  Course:&nbsp;
                  <span className="text-gray-500 text-xl">
                    {course.courseTitle} -{" "}
                  </span>
                  <span className="text-gray-500 text-xl">
                    {course.overallProgressPercent.toFixed(2)}% complete (
                    {course.completedModules}/{course.totalModules} modules
                    done)
                  </span>
                </h3>

                <ul className="mt-4">
                  {course.modules.map((mod, i) => (
                    <li key={mod.moduleId} style={{ marginBottom: "0.5rem" }}>
                      <strong>
                        {i + 1}. &nbsp;{mod.title}
                      </strong>
                      : {mod.progressPercent.toFixed(2)}% ({mod.watchedItems} /{" "}
                      {mod.totalItems} items)
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};
