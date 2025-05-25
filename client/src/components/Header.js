import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="bg-[#0F172A] shadow-md p-4 flex justify-between items-center">
      {/* Логотип */}
      <div className="flex items-center space-x-4">
        {!isHome ? (
          <Link to="/">
            <img src={require("./logo.png")} alt="Logo" className="h-12" />
          </Link>
        ) : (
          <img src={require("./logo.png")} alt="Logo" className="h-12" />
        )}
      </div>

      {/* Навигация */}
      <nav className="flex space-x-6 text-[#E3E7ED] font-semibold">
        <Link to="/">Главная</Link>
        <Link to="/forum">Форум</Link>
        <Link to="/news">Новости</Link>
        <Link to="/tracks">Направления</Link>
        <Link to="/history">История</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/profile">Личный кабинет</Link>
      </nav>

      {/* Переключатель языка и кнопка */}
      <div className="flex items-center space-x-4">
        <button className="text-[#E3E7ED]">RU / EN</button>
        <Link
          to="/contact"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Написать нам
        </Link>
      </div>
    </header>
  );
};

export default Header;
