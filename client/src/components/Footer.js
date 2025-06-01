import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-center">
          <div className="flex items-center space-x-3">
            <img src={require("./logo.png")} alt="Logo" className="h-8" />
            <span className="text-sm md:text-base">
              {t("footer.companyName")}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <a href="/contacts" className="hover:underline">
              {t("footer.contacts")}
            </a>
            <a href="/sitemap" className="hover:underline">
              {t("footer.sitemap")}
            </a>
            <a href="/privacy" className="hover:underline">
              {t("footer.privacy")}
            </a>
          </div>

          <div className="flex justify-center space-x-4">
            <a href="https://vk.com" target="_blank" rel="noreferrer">
              <img src={require("./vk.png")} alt="VK" className="h-6 w-6" />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noreferrer">
              <img
                src={require("./telegram.png")}
                alt="Telegram"
                className="h-6 w-6"
              />
            </a>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-4">
          © {new Date().getFullYear()} {t("footer.companyNameShort")}.{" "}
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
