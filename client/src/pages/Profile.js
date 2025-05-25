import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const defaultAvatars = [
  "avatars/avatar1.png",
  "avatars/avatar2.png",
  "avatars/avatar3.png",
];

const tracks = ["Музыка", "Кино", "Анимация"];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
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
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [showContestForm, setShowContestForm] = useState(false);
  const [contestData, setContestData] = useState({
    track: tracks[0],
    projectName: "",
    projectDescription: "",
    presentationLink: "",
    city: "",
    agreement: false,
  });
  const [contestMessage, setContestMessage] = useState("");
  const [canApplyToContest, setCanApplyToContest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          fullName: res.data.fullName || "",
          nickname: res.data.nickname || "",
          email: res.data.email || "",
          birthDate: res.data.birthDate ? res.data.birthDate.slice(0, 10) : "",
          phone: res.data.phone || "",
          citizenship: res.data.citizenship || "",
          registrationAddress: res.data.registrationAddress || "",
          role: res.data.role || "",
          avatar: res.data.avatar || "",
          hasAppliedToContest: res.data.hasAppliedToContest,
        });
        setCanApplyToContest(
          res.data.role === "Пользователь" && !res.data.hasAppliedToContest
        );
        console.log(!res.data.hasAppliedToContest);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/auth");
      }
    };

    fetchUser();
  }, [navigate, message]);

  const isChanged = useMemo(() => {
    if (!user) return false;
    return (
      formData.fullName !== (user.fullName || "") ||
      formData.nickname !== (user.nickname || "") ||
      formData.birthDate !==
        (user.birthDate ? user.birthDate.slice(0, 10) : "") ||
      formData.phone !== (user.phone || "") ||
      formData.citizenship !== (user.citizenship || "") ||
      formData.registrationAddress !== (user.registrationAddress || "") ||
      formData.avatar !== (user.avatar || "") ||
      !!avatarFile
    );
  }, [formData, user, avatarFile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditClick = () => {
    setMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setAvatarFile(null);
    setMessage("");
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleAvatarSelect = (avatar) => {
    setFormData((prev) => ({ ...prev, avatar }));
    setAvatarFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      form.append("fullName", formData.fullName);
      form.append("nickname", formData.nickname);
      form.append("birthDate", formData.birthDate);
      form.append("phone", formData.phone);
      form.append("citizenship", formData.citizenship);
      form.append("registrationAddress", formData.registrationAddress);
      form.append("avatar", formData.avatar);
      if (avatarFile) form.append("avatarFile", avatarFile);

      const res = await axios.put("/api/auth/me", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      setIsEditing(false);
      setAvatarFile(null);
      setMessage("Профиль успешно обновлен");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Ошибка при обновлении профиля"
      );
    }
  };

  // Обработка изменений в форме конкурса
  const handleContestChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContestData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Отправка заявки на конкурс
  const handleContestSubmit = async (e) => {
    e.preventDefault();
    setContestMessage("");
    if (!contestData.agreement) {
      setContestMessage("Пожалуйста, подтвердите согласие с политикой.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/auth/contest/apply",
        {
          track: contestData.track,
          projectName: contestData.projectName,
          projectDescription: contestData.projectDescription,
          presentationLink: contestData.presentationLink,
          city: contestData.city,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContestMessage("Заявка успешно отправлена!");
      setContestData({
        track: tracks[0],
        projectName: "",
        projectDescription: "",
        presentationLink: "",
        city: "",
        agreement: false,
      });
      setShowContestForm(false);
      setCanApplyToContest(false);
    } catch (error) {
      setContestMessage(
        error.response?.data?.message || "Ошибка при отправке заявки"
      );
    }
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Личный кабинет</h1>

      <div className="flex justify-center mb-4">
        <img
          src={
            avatarFile
              ? URL.createObjectURL(avatarFile)
              : formData.avatar
              ? `/${formData.avatar}`
              : "/default-avatar.png"
          }
          alt="Аватар"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      {!isEditing ? (
        <>
          <div className="space-y-3 text-gray-800">
            <p>
              <strong>ФИО:</strong> {user.fullName}
            </p>
            <p>
              <strong>Псевдоним:</strong> {user.nickname}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Дата рождения:</strong>{" "}
              {user.birthDate ? user.birthDate.slice(0, 10) : "-"}
            </p>
            <p>
              <strong>Телефон:</strong> {user.phone || "-"}
            </p>
            <p>
              <strong>Гражданство:</strong> {user.citizenship || "-"}
            </p>
            <p>
              <strong>Адрес регистрации:</strong>{" "}
              {user.registrationAddress || "-"}
            </p>
            <p>
              <strong>Роль:</strong> {user.role}
            </p>
            {(user.role === "Модератор заявок" || user.role === "admin") && (
              <Link
                to="/review"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
              >
                Рассмотреть заявки
              </Link>
            )}
            {user.role === "admin" && (
              <Link
                to="/admin/users"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
              >
                Список пользователей
              </Link>
            )}
          </div>

          <button
            onClick={handleEditClick}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Редактировать
          </button>
          <div className="space-y-3 text-gray-800">
            {user.hasAppliedToContest && user.role === "Пользователь" && (
              <p>
                <strong>Статус заявки на конкурс:</strong>{" "}
                {user.contestStatus === "pending" && "На рассмотрении"}
                {user.contestStatus === "approved" && "Одобрена"}
                {user.contestStatus === "rejected" && "Отклонена"}
                {!user.contestStatus && "Заявка подана"}
              </p>
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">ФИО</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Псевдоним</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Email (нельзя изменить)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Дата рождения</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="+7 (999) 999-99-99"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Гражданство</label>
            <input
              type="text"
              name="citizenship"
              value={formData.citizenship}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Адрес регистрации
            </label>
            <input
              type="text"
              name="registrationAddress"
              value={formData.registrationAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Выберите аватар</label>
            <div className="flex space-x-2 mb-2">
              {defaultAvatars.map((avatar) => (
                <img
                  key={avatar}
                  src={avatar}
                  alt="Аватар"
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`w-16 h-16 cursor-pointer rounded-full border-2 ${
                    formData.avatar === avatar
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Роль</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 text-white"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!isChanged}
              className={`px-4 py-2 rounded text-white ${
                isChanged
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              Сохранить
            </button>
          </div>
        </form>
      )}

      {message && (
        <p className="mt-4 text-center text-green-600 font-semibold">
          {message}
        </p>
      )}

      <hr className="my-8" />

      {canApplyToContest && (
        <button
          onClick={() => setShowContestForm((v) => !v)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          {showContestForm
            ? "Закрыть форму заявки"
            : "Подать заявление на участие в конкурсе"}
        </button>
      )}

      {showContestForm && (
        <form
          onSubmit={handleContestSubmit}
          className="mt-6 space-y-4 border border-gray-300 p-4 rounded"
        >
          <div>
            <label className="block font-semibold mb-1">Трек</label>
            <select
              name="track"
              value={contestData.track}
              onChange={handleContestChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              {tracks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Название проекта</label>
            <input
              type="text"
              name="projectName"
              value={contestData.projectName}
              onChange={handleContestChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Описание проекта</label>
            <textarea
              name="projectDescription"
              value={contestData.projectDescription}
              onChange={handleContestChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Ссылка на презентацию
            </label>
            <input
              type="url"
              name="presentationLink"
              value={contestData.presentationLink}
              onChange={handleContestChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Город</label>
            <input
              type="text"
              name="city"
              value={contestData.city}
              onChange={handleContestChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreement"
              checked={contestData.agreement}
              onChange={handleContestChange}
              className="mr-2"
              id="agreement"
            />
            <label htmlFor="agreement" className="text-sm">
              Я согласен с{" "}
              <a
                href="/privacy"
                className="underline text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                политикой конфиденциальности
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Отправить заявку
          </button>
          {contestMessage && (
            <p className="mt-2 text-center text-red-600">{contestMessage}</p>
          )}
        </form>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
      >
        Выйти
      </button>
    </div>
  );
};

export default Profile;
