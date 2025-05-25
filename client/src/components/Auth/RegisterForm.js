import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    nickname: "",
    password: "",
    birthDate: "",
    phone: "",
    citizenship: "",
    registrationAddress: "",
    avatar: "",
  });

  const [message, setMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (avatarFile) {
        data.append("avatarFile", avatarFile);
      }

      const res = await axios.post("/api/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Регистрация
      </h2>

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="text"
        name="fullName"
        placeholder="ФИО"
        onChange={handleChange}
        required
      />

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
        type="text"
        name="nickname"
        placeholder="Псевдоним"
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

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="date"
        name="birthDate"
        placeholder="Дата рождения"
        onChange={handleChange}
        required
      />

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="tel"
        name="phone"
        placeholder="Номер телефона"
        onChange={handleChange}
        required
      />

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="text"
        name="citizenship"
        placeholder="Гражданство"
        onChange={handleChange}
        required
      />

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="text"
        name="registrationAddress"
        placeholder="Адрес регистрации"
        onChange={handleChange}
        required
      />
      <div className="space-y-2">
        <label className="block font-semibold">Аватарка</label>

        <div className="flex gap-2">
          {["avatar1.png", "avatar2.png", "avatar3.png"].map((name) => (
            <img
              key={name}
              src={`/avatars/${name}`}
              alt={name}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  avatar: "avatars/" + name,
                }))
              }
              className={`w-16 h-16 rounded-full border-2 cursor-pointer ${
                formData.avatar === name ? "border-blue-500" : "border-gray-300"
              }`}
            />
          ))}
        </div>

        <div>
          <label className="block mt-2">Или загрузите свою:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Зарегистрироваться
      </button>

      {message && <p className="text-sm text-red-600 text-center">{message}</p>}

      <p className="text-center text-sm text-gray-600">
        Уже есть аккаунт?{" "}
        <Link to="/auth" className="text-blue-600 hover:underline">
          Войти
        </Link>
      </p>
    </form>
  );
}
