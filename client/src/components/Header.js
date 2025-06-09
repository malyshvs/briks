import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-[#0F172A] shadow-md p-4 flex items-center justify-between relative z-50">
      <div className="flex items-center space-x-4">
        {!isHome ? (
          <Link to="/">
            <img src={require("./logo.png")} alt="Logo" className="h-12" />
          </Link>
        ) : (
          <img src={require("./logo.png")} alt="Logo" className="h-12" />
        )}
      </div>

      <nav className="hidden md:flex space-x-6 text-[#E3E7ED] font-semibold">
        <Link to="/">{t("home")}</Link>
        <Link to="/forum">{t("forum")}</Link>
        <Link to="/news">{t("news")}</Link>
        <Link to="/tracks">{t("tracksTitle")}</Link>
        <Link to="/history">{t("historyT")}</Link>
        <Link to="/faq">{t("faqTitle")}</Link>
        <Link to="/profile">{t("profile")}</Link>
      </nav>

      <div className="hidden md:flex items-center space-x-4">
        <button
          className={`text-[#E3E7ED] ${
            i18n.language === "ru" ? "font-bold text-yellow-400" : ""
          }`}
          onClick={() => i18n.changeLanguage("ru")}
        >
          RU
        </button>
        <button
          className={`text-[#E3E7ED] ${
            i18n.language === "en" ? "font-bold text-yellow-400" : ""
          }`}
          onClick={() => i18n.changeLanguage("en")}
        >
          EN
        </button>
        <Link
          to="/contact"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {t("contactUs")}
        </Link>
      </div>

      <div className="md:hidden text-white">
        <button onClick={toggleMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#0F172A] text-white flex flex-col space-y-4 p-4 shadow-lg md:hidden">
          <Link to="/" onClick={toggleMenu}>
            {t("home")}
          </Link>
          <Link to="/forum" onClick={toggleMenu}>
            {t("forum")}
          </Link>
          <Link to="/news" onClick={toggleMenu}>
            {t("news")}
          </Link>
          <Link to="/tracks" onClick={toggleMenu}>
            {t("tracks")}
          </Link>
          <Link to="/history" onClick={toggleMenu}>
            {t("historyT")}
          </Link>
          <Link to="/faq" onClick={toggleMenu}>
            {t("faq")}
          </Link>
          <Link to="/profile" onClick={toggleMenu}>
            {t("profile")}
          </Link>
          <div className="flex space-x-4 pt-2">
            <button
              className={`${
                i18n.language === "ru"
                  ? "font-bold text-yellow-400"
                  : "text-white"
              }`}
              onClick={() => i18n.changeLanguage("ru")}
            >
              RU
            </button>
            <button
              className={`${
                i18n.language === "en"
                  ? "font-bold text-yellow-400"
                  : "text-white"
              }`}
              onClick={() => i18n.changeLanguage("en")}
            >
              EN
            </button>
          </div>

          <Link
            to="/contact"
            onClick={toggleMenu}
            className="bg-blue-600 text-white px-4 py-2 rounded text-center"
          >
            {t("contactUs")}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
