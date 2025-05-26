import React, { useState } from "react";

const directions = [
  "Разработка ПО и IT",
  "Современное искусство",
  "Дизайн украшений",
  "Музыка",
  "Компьютерная графика и анимация",
  "Дизайн и производство одежды",
  "Кино",
  "Разработка игр",
];

const content = {
  "Разработка ПО и IT": {
    stats: { applications: 120, visitors: 300, regions: 15 },
    description:
      "Хакатоны, IT-конференции и мастер-классы от ведущих разработчиков.",
    winners: ["Иван Петров", "Анна Сидорова"],
  },
  "Современное искусство": {
    stats: { applications: 80, visitors: 250, regions: 10 },
    description: "Выставки, инсталляции и живопись от молодых художников.",
    winners: ["Мария Кузнецова", "Петр Власов"],
  },
  "Дизайн украшений": {
    stats: { applications: 81, visitors: 80, regions: 12 },
    description:
      "Конкурс ювелирных изделий и мастер-классы от экспертов отрасли.",
    winners: ["Светлана Григорьева", "Анна Шмакова"],
  },
  Музыка: {
    stats: { applications: 60, visitors: 200, regions: 8 },
    description:
      "Выступления групп, сольных исполнителей и конкурс авторской песни.",
    winners: ["DJ Kolya", "Вика Ветер"],
  },
  "Компьютерная графика и анимация": {
    stats: { applications: 45, visitors: 150, regions: 7 },
    description:
      "Конкурс анимации, 3D-моделирования и презентации студенческих проектов.",
    winners: ["Алексей Морозов", "Лена Иванова"],
  },
  "Дизайн и производство одежды": {
    stats: { applications: 55, visitors: 180, regions: 9 },
    description: "Модные показы и конкурс молодых дизайнеров одежды.",
    winners: ["Дарья Кравцова", "Игорь Сапунов"],
  },
  Кино: {
    stats: { applications: 70, visitors: 220, regions: 11 },
    description: "Фестиваль короткометражных фильмов и встречи с режиссёрами.",
    winners: ["Владимир Белов", "Оксана Литвинова"],
  },
  "Разработка игр": {
    stats: { applications: 95, visitors: 310, regions: 14 },
    description: "Game jam, выставки инди-игр и презентации игровых проектов.",
    winners: ["Team Pixel", "IndieStudioX"],
  },
};

const HistoryPage = () => {
  const [selected, setSelected] = useState("Разработка ПО и IT");

  const data = content[selected];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1d0037] to-[#450654] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-serif font-semibold text-center">
          История
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
              {dir}
            </button>
          ))}
        </div>

        <div className="bg-white/10 rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center">{selected}</h2>

          <div className="flex flex-col md:flex-row justify-around text-center">
            <div>
              <p className="text-3xl font-bold">{data.stats.applications}</p>
              <p className="text-sm">заявок</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{data.stats.visitors}</p>
              <p className="text-sm">посетителей</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{data.stats.regions}</p>
              <p className="text-sm">регионов</p>
            </div>
          </div>

          <p className="text-center text-sm">{data.description}</p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-center mb-2">
              Победители:
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
