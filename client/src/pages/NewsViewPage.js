import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NewsViewPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [isEditor, setIsEditor] = useState(false);
  const token = localStorage.getItem("token");
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
    axios
      .get(`/api/news/${id}`)
      .then((res) => setNews(res.data))
      .catch(console.error);
  }, [id]);
  const handleHide = async (id) => {
    if (window.confirm("Вы уверены, что хотите скрыть эту новость?")) {
      await axios.put(
        `/api/news/${id}/hide`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  };

  if (!news) return <div className="p-6">Здесь пока пусто...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
      <div
        className="ProseMirror"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />
      {isEditor && (
        <div className="flex justify-end">
          <div className="flex justify-between  space-x-2">
            <button
              onClick={() => navigate(`/news/edit/${news.id}`)}
              className="bg-yellow-400 text-white px-4 py-2 rounded"
            >
              ✎
            </button>
            <button
              onClick={() => handleHide(news.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              🗑
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsViewPage;
