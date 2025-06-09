import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bgImage from "../components/bg.png";

const Home = () => {
  const { t } = useTranslation();

  const directions = [
    t("homeP.directions.music"),
    t("homeP.directions.cinema"),
    t("homeP.directions.animation"),
  ];

  return (
    <main className="bg-[#0f172a] text-white">
      <section
        className="relative bg-cover bg-center h-[300px] md:h-[400px]"
        style={{ backgroundImage: "url('/banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div
            className="text-center px-4 bg-no-repeat bg-center bg-cover"
            style={{
              backgroundImage: `url(${bgImage})`,
              height: "100%",
              width: "100%",
            }}
          ></div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto text-center p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          {t("homeP.description.title")}
        </h2>
        <p className="text-base md:text-lg">{t("homeP.description.text")}</p>
      </section>

      <section className="bg-white text-black py-10">
        <div className="text-center mb-6 text-2xl font-semibold">
          {t("homeP.cards.closed")}
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-6 px-6">
          {directions.map((title) => (
            <div
              key={title}
              className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-md w-full md:w-1/4 text-center"
            >
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm mt-2">{t("homeP.cards.participation")}</p>
              <p className="italic text-sm">
                {t("homeP.cards.nomination", {
                  direction: title.toLowerCase(),
                })}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/rules" className="text-blue-600 underline">
            {t("homeP.cards.rules")}
          </Link>
        </div>
      </section>

      <section className="bg-gray-100 text-black py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-2xl font-semibold mb-10">2025</div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
            <div className="bg-white rounded-lg shadow p-4 w-full md:w-1/3">
              <h4 className="font-bold">{t("homeP.timeline.applications")}</h4>
              <p className="text-sm text-gray-700">
                14 {t("months.april")} — 12 {t("months.may")} 2025 г.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 w-full md:w-1/3">
              <h4 className="font-bold">{t("homeP.timeline.screening")}</h4>
              <p className="text-sm text-gray-700">
                13 — 14 {t("months.may")} 2025 г.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
