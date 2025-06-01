import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
const FAQ = () => {
  const [user, setUser] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useTranslation();
  // Получаем текущего пользователя (если есть токен)
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserAndFaqs = async () => {
      try {
        if (token) {
          const userRes = await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(userRes.data);
        }

        const faqRes = await axios.get("/api/faq");
        setFaqs(faqRes.data);
      } catch (err) {
        // В случае ошибки просто пропускаем (не залогинен)
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFaqs();
  }, []);

  // Админ может начать редактировать вопрос
  const handleEdit = (index) => {
    setEditingIndex(index);
    setQuestion(faqs[index].question);
    setAnswer(faqs[index].answer);
    setMessage("");
  };

  // Отмена редактирования
  const handleCancel = () => {
    setEditingIndex(null);
    setQuestion("");
    setAnswer("");
    setMessage("");
  };

  // Удаление FAQ (только для админа)
  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот вопрос?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/faq/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaqs(faqs.filter((f) => f._id !== id));
      setMessage("Вопрос удалён");
    } catch (err) {
      setMessage("Ошибка при удалении");
    }
  };

  // Сохранение нового или изменённого FAQ
  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      setMessage("Вопрос и ответ не могут быть пустыми");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (editingIndex === null) {
        // Создание нового вопроса
        const res = await axios.post(
          "/api/faq",
          { question, answer },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFaqs([...faqs, res.data]);
        setMessage("Вопрос добавлен");
      } else {
        // Обновление существующего
        const id = faqs[editingIndex]._id;
        const res = await axios.put(
          `/api/faq/${id}`,
          { question, answer },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedFaqs = [...faqs];
        updatedFaqs[editingIndex] = res.data;
        setFaqs(updatedFaqs);
        setMessage("Вопрос обновлён");
      }

      setEditingIndex(null);
      setQuestion("");
      setAnswer("");
    } catch (err) {
      setMessage("Ошибка при сохранении");
    }
  };

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("faq.title")}</h1>

      {message && (
        <p className="mb-4 text-center text-green-600 font-semibold">
          {message}
        </p>
      )}

      {/* Список FAQ */}
      {faqs.length === 0 && <p>{t("faq.noQuestions")}</p>}

      <div>
        {faqs.map((faq, index) => (
          <div key={faq.id} className="border-b py-4">
            <h3 className="font-semibold mb-1">{faq.question}</h3>
            <p className="whitespace-pre-wrap">{faq.answer}</p>

            {user?.role === "admin" && (
              <div className="mt-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="mr-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {t("faq.edit")}
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  {t("faq.delete")}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {user?.role === "admin" && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingIndex === null ? t("faq.add") : t("faq.editing")}
          </h2>

          <div className="mb-4">
            <label htmlFor="question" className="block font-semibold mb-1">
              {t("faq.questionLabel")}
            </label>
            <input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={t("faq.questionPlaceholder")}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="answer" className="block font-semibold mb-1">
              {t("faq.answerLabel")}
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows={5}
              placeholder={t("faq.answerPlaceholder")}
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {t("faq.save")}
            </button>
            {editingIndex !== null && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                {t("faq.cancel")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
