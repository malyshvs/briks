import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const token = localStorage.getItem("token");
  const [isEditor, setIsEditor] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    nickname: "",
    email: "",
    birthDate: "",
    phone: "",
    citizenship: "",
    registrationAddress: "",
    role: "",
    avatar: "",
  });
  const { t } = useTranslation();
  const fetchNews = async () => {
    const res = await axios.get("/api/news", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNewsList(res.data);
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        const role = res.data.role;
        setIsEditor(role === "admin" || role === "Модератор форума");

        console.log(role);
        console.log(role === "admin" || role === "Модератор форума");
        console.log(isEditor);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
      }
    };

    fetchUser();
    fetchNews();
  }, [navigate]);

  const handleHide = async (id) => {
    if (window.confirm("Вы уверены, что хотите скрыть эту новость?")) {
      await axios.put(
        `/api/news/${id}/hide`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNews();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("news")}</h1>
      {isEditor && (
        <div className="mb-4">
          <Link
            to="/news/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Добавить новость
          </Link>
        </div>
      )}
      <div className="grid gap-6">
        {newsList.map((news) => (
          <div
            key={news.id}
            className="news-item relative p-4 border rounded shadow hover:bg-gray-100 group"
          >
            <Link to={`/news/${news.id}`}>
              <img
                src={news.previewImage}
                alt="preview"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{news.title}</h2>
                <p className="text-sm text-gray-500">{news.preview}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {t("author")}: {news.author?.fullName} |{" "}
                  {new Date(news.createdAt).toLocaleString()}
                </p>
              </div>
            </Link>
            {isEditor && (
              <div className="news-actions absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => navigate(`/news/edit/${news.id}`)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleHide(news.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  🗑
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
