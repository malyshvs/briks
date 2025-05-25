import { useEffect, useState } from "react";
import axios from "axios";

const ReviewApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("pending");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/auth/contest/applications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data))
      .catch(console.error);
  }, [token]);

  const handleAction = async (id, action) => {
    try {
      await axios.post(
        `/api/auth/contest/applications/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, status: action === "approve" ? "approved" : "rejected" }
            : app
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = applications.filter((app) =>
    filter === "all" ? true : app.status === filter
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Заявки на участие</h2>

      <div className="flex gap-3 mb-6">
        {["pending", "approved", "rejected", "all"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md font-medium ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            {status === "pending"
              ? "Нерассмотренные"
              : status === "approved"
              ? "Одобренные"
              : status === "rejected"
              ? "Отклонённые"
              : "Все"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{app.projectName}</h3>
                <p className="text-sm text-gray-600">{app.city}</p>
                <p className="mt-2 text-gray-700">
                  <strong>Трек:</strong> {app.track}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Описание:</strong> {app.projectDescription}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Пользователь:</strong> {app.User?.fullName} (
                  {app.User?.email})
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    app.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : app.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {app.status === "pending"
                    ? "Ожидает"
                    : app.status === "approved"
                    ? "Одобрена"
                    : "Отклонена"}
                </span>

                {app.status === "pending" && (
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => handleAction(app.id, "approve")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    >
                      Принять
                    </button>
                    <button
                      onClick={() => handleAction(app.id, "reject")}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Заявок нет</p>
        )}
      </div>
    </div>
  );
};

export default ReviewApplicationsPage;
