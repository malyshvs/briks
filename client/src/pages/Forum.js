import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function Forum() {
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchTopics = async () => {
    const res = await axios.get("/api/forum/topics");
    setTopics(res.data);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Пожалуйста, войдите в систему");
      return;
    }

    const userId = JSON.parse(atob(token.split(".")[1])).userId;
    try {
      const res = await axios.post(
        "/api/forum/topics",
        {
          title,
          description,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      navigate(`/forum/${res.data.id}`);
    } catch (err) {
      alert("Ошибка при создании темы");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("forum")}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t("createTopic")}
        </button>
      </div>

      {/* Список тем */}
      <div className="bg-white rounded shadow divide-y">
        {topics.length > 0 ? (
          topics.map((t) => (
            <Link
              to={`/forum/${t.id}`}
              key={t.id}
              className="block px-6 py-4 hover:bg-gray-50 flex items-center space-x-4"
            >
              {/* Аватар */}
              <img
                src={
                  t.User?.avatar ? `/${t.User.avatar}` : "/default-avatar.png"
                }
                alt={`${t.User?.nickname || "Аноним"} avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold text-blue-600">
                  {t.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Автор: {t.User?.nickname || "Аноним"}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">{t("noTopics")}</div>
        )}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Создать обсуждение</h2>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <input
                type="text"
                placeholder="Название темы"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <textarea
                placeholder="Ваш вопрос или описание темы"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 h-32 resize-none"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
