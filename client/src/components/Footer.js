const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={require("./logo.png")} alt="Logo" className="h-8" />
          <span>ООО "Название компании"</span>
        </div>

        <div className="flex flex-wrap space-x-4 mt-4 md:mt-0">
          <a href="/contacts">Контакты</a>
          <a href="/sitemap">Карта сайта</a>
          <a href="/privacy">Политика конфиденциальности</a>
        </div>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <img src="/icons/facebook.svg" alt="Facebook" className="h-6" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <img src="/icons/twitter.svg" alt="Twitter" className="h-6" />
          </a>
        </div>
      </div>

      <div className="text-center text-sm mt-4">
        © {new Date().getFullYear()} Название компании. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
