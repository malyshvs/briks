import React, { useEffect, useState } from "react";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [adding, setAdding] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsAdmin(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Не авторизован");
      })
      .then((userData) => setUser(userData))
      .catch(() => setUser(null));
  }, [token]);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.role === "admin");
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/faq", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleAddFAQ = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      alert("Вопрос и ответ обязательны");
      return;
    }

    setAdding(true);

    fetch("/api/faq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при добавлении");
        return res.json();
      })
      .then((newFAQ) => {
        setFaqs((prev) => [...prev, newFAQ]);
        setNewQuestion("");
        setNewAnswer("");
      })
      .catch(() => alert("Ошибка при добавлении FAQ"))
      .finally(() => setAdding(false));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : faqs.length ? (
        <div className="space-y-4">
          {faqs.map(({ id, question, answer }) => (
            <div key={id} className="border rounded p-4 shadow-sm">
              <h3 className="font-semibold text-lg">{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Вопросы отсутствуют.</p>
      )}

      {isAdmin && (
        <section className="mt-10 p-4 border rounded shadow bg-gray-50 max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Добавить новый вопрос</h2>
          <input
            className="w-full mb-3 p-2 border rounded"
            type="text"
            placeholder="Вопрос"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            disabled={adding}
          />
          <textarea
            className="w-full mb-3 p-2 border rounded"
            placeholder="Ответ"
            rows="4"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            disabled={adding}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleAddFAQ}
            disabled={adding}
          >
            Добавить вопрос
          </button>
        </section>
      )}
    </div>
  );
}
