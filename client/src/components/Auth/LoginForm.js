import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("123");
      const res = await axios.post("/api/auth/login", formData);
      setMessage("Вход выполнен");
      localStorage.setItem("token", res.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || "Ошибка входа");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {t("loginTitle")}
      </h2>

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="password"
        name="password"
        placeholder="Пароль"
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {t("login")}
      </button>

      {message && <p className="text-sm text-red-600 text-center">{message}</p>}

      <p className="text-center text-sm text-gray-600">
        {t("NoAcc")}{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          {t("register")}
        </Link>
      </p>
    </form>
  );
}
