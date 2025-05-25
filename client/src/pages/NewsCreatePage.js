import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import RichTextEditor from "../components/RichTextEditor";

const NewsFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    preview: "",
    previewImage: "",
    content: "",
  });

  const [createdAt, setCreatedAt] = useState(null);
  const [userId, setUserId] = useState(null);

  // Получаем текущего пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(res.data.id);
      } catch (err) {
        console.error("Ошибка получения пользователя", err);
      }
    };
    fetchUser();
  }, [token]);

  // Если редактируем новость
  useEffect(() => {
    if (id) {
      axios
        .get(`/api/news/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const { title, preview, previewImage, content, createdAt } = res.data;
          setForm({ title, preview, previewImage, content });
          setCreatedAt(createdAt);
        })
        .catch((err) => console.error("Ошибка загрузки новости", err));
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/api/news/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          "/api/news",
          { ...form, authorId: userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      navigate("/news");
    } catch (err) {
      console.error("Ошибка сохранения новости", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Редактировать новость" : "Добавить новость"}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Заголовок"
          name="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="border px-3 py-2 rounded w-full"
          placeholder="Краткое описание (превью)"
          name="preview"
          value={form.preview}
          onChange={(e) => setForm({ ...form, preview: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Ссылка на изображение превью"
          value={form.previewImage}
          onChange={(e) => setForm({ ...form, previewImage: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <label className="block text-sm font-medium">Контент</label>
        <RichTextEditor
          value={form.content}
          onChange={(html) => setForm({ ...form, content: html })}
        />
        {createdAt && (
          <div className="text-sm text-gray-500">
            Дата создания: {new Date(createdAt).toLocaleString()}
          </div>
        )}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
          {id ? "Сохранить" : "Добавить"}
        </button>
      </form>
    </div>
  );
};

export default NewsFormPage;
