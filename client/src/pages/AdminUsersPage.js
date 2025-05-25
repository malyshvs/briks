import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, [token]);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nickname?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Список пользователей</h2>

      <div className="flex gap-4 mb-6">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="all">Все роли</option>
          <option value="user">Пользователи</option>
          <option value="admin">Администраторы</option>
          <option value="request_moderator">Модераторы заявок</option>
        </select>

        <input
          type="text"
          placeholder="Поиск по имени, email или нику"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-md w-full"
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center bg-white border p-4 rounded-lg shadow-sm"
          >
            <div>
              <p className="font-bold text-lg">{user.fullName}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-600">Ник: {user.nickname}</p>
              <p className="text-sm text-gray-700">Роль: {user.role}</p>
            </div>
            <Link
              to={`/admin/users/${user.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Перейти
            </Link>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            Нет подходящих пользователей
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
