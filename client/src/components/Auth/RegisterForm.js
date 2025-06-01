import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    agreement: false,
  });
  const { t } = useTranslation();

  const [message, setMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreement) {
      setMessage(t("error.agreement"));
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (avatarFile) {
        data.append("avatarFile", avatarFile);
      }

      const res = await axios.post("/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || t("error.registration"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {t("registerTitle")}
      </h2>

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="text"
        name="fullName"
        placeholder={t("fullName")}
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
        placeholder={t("nickname")}
        onChange={handleChange}
        required
      />

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="password"
        name="password"
        placeholder={t("password")}
        onChange={handleChange}
        required
      />

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="date"
        name="birthDate"
        placeholder={t("birthDate")}
        onChange={handleChange}
        required
      />

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="tel"
        name="phone"
        placeholder={t("phone")}
        onChange={handleChange}
        required
      />

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="text"
        name="citizenship"
        placeholder={t("citizenship")}
        onChange={handleChange}
        required
      />

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="text"
        name="registrationAddress"
        placeholder={t("registrationAddress")}
        onChange={handleChange}
        required
      />

      <div className="space-y-2">
        <label className="block font-semibold">{t("avatarLabel")}</label>
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
          <label className="block mt-2">{t("uploadYourOwn")}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="agreement"
          checked={formData.agreement}
          onChange={handleChange}
          className="mr-2"
          id="agreement"
        />
        <label htmlFor="agreement" className="text-sm">
          {t("agreementText")}{" "}
          <a
            href="/privacy"
            className="underline text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("privacyPolicy")}
          </a>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {t("register")}
      </button>

      {message && <p className="text-sm text-red-600 text-center">{message}</p>}

      <p className="text-center text-sm text-gray-600">
        {t("alreadyHaveAccount")}{" "}
        <Link to="/auth" className="text-blue-600 hover:underline">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
