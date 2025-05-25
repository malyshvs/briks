import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Topic = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  const fetchPosts = async () => {
    const res = await axios.get(`/api/forum/topics/${id}/posts`);
    setPosts(res.data);
  };
  const fetchTopic = async () => {
    try {
      const res = await axios.get(`/api/forum/topics/${id}`);
      setTopic(res.data);
    } catch (error) {
      console.error("Ошибка при загрузке темы:", error);
      setTopic(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Пожалуйста, войдите в систему");
      return;
    }

    await axios.post(
      `/api/forum/topics/${id}/posts`,
      { authorId: userId, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setContent("");
    fetchPosts();
  };

  const handleEdit = async (postId) => {
    await axios.put(
      `/api/forum/posts/${postId}`,
      { content: editedContent },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setEditingPostId(null);
    fetchPosts();
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Удалить сообщение?")) return;

    await axios.delete(`/api/forum/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
    fetchTopic();
  }, [id]);

  // Если есть сообщения — первое считается главным
  const mainPost = posts.length > 0 ? posts[0] : null;
  const comments = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {topic?.title || "Загрузка..."}
      </h1>

      {/* Главное сообщение темы */}
      {mainPost && (
        <div className="bg-blue-100 border border-blue-300 p-6 rounded-lg mb-10 shadow-lg">
          <div className="flex items-center mb-4 space-x-4">
            <img
              src={
                mainPost.User?.avatar
                  ? `/${mainPost.User.avatar}`
                  : "/default-avatar.png"
              }
              alt={`${mainPost.User?.nickname || "Аноним"} avatar`}
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-400"
            />
            <div>
              <div className="text-xl font-semibold text-blue-700">
                {mainPost.User?.nickname || "Аноним"}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(mainPost.createdAt).toLocaleString("ru-RU")}
              </div>
            </div>
          </div>
          {editingPostId === mainPost.id ? (
            <>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full border p-3 mb-4 rounded"
                rows={6}
              />
              <div className="flex space-x-3">
                <button
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                  onClick={() => handleEdit(mainPost.id)}
                >
                  Сохранить
                </button>
                <button
                  className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
                  onClick={() => setEditingPostId(null)}
                >
                  Отмена
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">
              {mainPost.content}
            </p>
          )}

          {userId === mainPost.authorId && editingPostId !== mainPost.id && (
            <div className="mt-3 text-sm flex space-x-5 text-blue-600">
              <button
                onClick={() => {
                  setEditedContent(mainPost.content);
                  setEditingPostId(mainPost.id);
                }}
                className="hover:underline"
              >
                ✏️ Редактировать
              </button>
            </div>
          )}
        </div>
      )}

      {/* Комментарии */}
      <div className="space-y-4 mb-10">
        {comments.length > 0 ? (
          comments.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2 font-semibold text-blue-600">
                  <img
                    src={
                      p.User?.avatar
                        ? `/${p.User.avatar}`
                        : "/default-avatar.png"
                    }
                    alt={`${p.User?.nickname || "Аноним"} avatar`}
                    className="w-8 h-8 rounded-full object-cover border border-blue-300"
                  />
                  <span>{p.User?.nickname || "Аноним"}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(p.createdAt).toLocaleString("ru-RU")}
                </div>
              </div>

              {editingPostId === p.id ? (
                <>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full border p-2 mb-2 rounded"
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() => handleEdit(p.id)}
                    >
                      Сохранить
                    </button>
                    <button
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      onClick={() => setEditingPostId(null)}
                    >
                      Отмена
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap mb-2">
                  {p.content}
                </p>
              )}

              {userId === p.authorId && editingPostId !== p.id && (
                <div className="text-sm flex space-x-4 text-blue-500">
                  <button
                    onClick={() => {
                      setEditedContent(p.content);
                      setEditingPostId(p.id);
                    }}
                    className="hover:underline"
                  >
                    ✏️ Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="hover:underline"
                  >
                    🗑️ Удалить
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">Комментариев пока нет</div>
        )}
      </div>

      {/* Форма добавления сообщения */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-6 rounded-lg shadow"
      >
        <h2 className="text-lg font-semibold mb-4">Добавить сообщение</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Напишите сообщение..."
          rows={4}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Отправить
        </button>
      </form>
    </div>
  );
};

export default Topic;
