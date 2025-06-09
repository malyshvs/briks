import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const directions = [
  "software_it",
  "contemporary_art",
  "jewelry_design",
  "music",
  "cg_animation",
  "fashion",
  "cinema",
  "game_dev",
];

const content = {
  software_it: {
    stats: { applications: 120, visitors: 300, regions: 15 },
    description: "hackathons_it_conferences",
    winners: ["Ivan Petrov", "Anna Sidorova"],
  },
  contemporary_art: {
    stats: { applications: 80, visitors: 250, regions: 10 },
    description: "exhibitions_installations",
    winners: ["Maria Kuznetsova", "Pyotr Vlasov"],
  },
  jewelry_design: {
    stats: { applications: 81, visitors: 80, regions: 12 },
    description: "jewelry_competition",
    winners: ["Svetlana Grigorieva", "Anna Shmakova"],
  },
  music: {
    stats: { applications: 60, visitors: 200, regions: 8 },
    description: "live_music_performances",
    winners: ["DJ Kolya", "Vika Veter"],
  },
  cg_animation: {
    stats: { applications: 45, visitors: 150, regions: 7 },
    description: "animation_contest",
    winners: ["Alexey Morozov", "Lena Ivanova"],
  },
  fashion: {
    stats: { applications: 55, visitors: 180, regions: 9 },
    description: "fashion_shows",
    winners: ["Daria Kravtsova", "Igor Sapunov"],
  },
  cinema: {
    stats: { applications: 70, visitors: 220, regions: 11 },
    description: "short_film_festival",
    winners: ["Vladimir Belov", "Oksana Litvinova"],
  },
  game_dev: {
    stats: { applications: 95, visitors: 310, regions: 14 },
    description: "game_jam_expo",
    winners: ["Team Pixel", "IndieStudioX"],
  },
};

const HistoryPage = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("software_it");

  const data = content[selected];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1d0037] to-[#450654] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-serif font-semibold text-center">
          {t("history.title")}
        </h1>

        <div className="flex flex-wrap justify-center gap-4 border border-white/20 p-4 rounded-lg">
          {directions.map((dir) => (
            <button
              key={dir}
              onClick={() => setSelected(dir)}
              className={`px-4 py-2 rounded text-sm transition border ${
                selected === dir
                  ? "bg-white text-black font-semibold"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {t(`history.directions.${dir}`)}
            </button>
          ))}
        </div>

        <div className="bg-white/10 rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center">
            {t(`history.directions.${selected}`)}
          </h2>

          <div className="flex flex-col md:flex-row justify-around text-center">
            <div>
              <p className="text-3xl font-bold">{data.stats.applications}</p>
              <p className="text-sm">{t("history.labels.applications")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{data.stats.visitors}</p>
              <p className="text-sm">{t("history.labels.visitors")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{data.stats.regions}</p>
              <p className="text-sm">{t("history.labels.regions")}</p>
            </div>
          </div>

          <p className="text-center text-sm">
            {t(`history.descriptions.${selected}`)}
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-center mb-2">
              {t("history.labels.winners")}
            </h3>
            <ul className="list-disc text-sm list-inside text-center space-y-1">
              {data.winners.map((winner) => (
                <li key={winner}>{winner}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
