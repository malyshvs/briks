import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Tracks = () => {
  const { t } = useTranslation();
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [entries, setEntries] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const directions = [
    t("tracks.music"),
    t("tracks.animation"),
    t("tracks.cinema"),
  ];

  useEffect(() => {
    axios
      .get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch((err) => console.error(t("tracks.profileLoadError"), err));
  }, []);

  useEffect(() => {
    if (selectedTrack) {
      axios
        .get(`/api/auth/contest/approved/${selectedTrack}`)
        .then((res) => setEntries(res.data))
        .catch((err) => console.error(t("tracks.entriesLoadError"), err));
    }
  }, [selectedTrack]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    setDropdownOpen(false);
  };

  const canApply =
    user && user.role === t("roles.user") && !user.hasAppliedToContest;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("tracks.title")}</h1>

      <div className="relative mb-8">
        <button
          onClick={toggleDropdown}
          className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
        >
          {selectedTrack
            ? `${t("tracks.selected")}: ${selectedTrack}`
            : t("tracks.select")}
        </button>

        {dropdownOpen && (
          <div className="absolute z-10 mt-2 bg-white border rounded shadow w-64">
            {directions.map((dir) => (
              <button
                key={dir}
                onClick={() => handleTrackSelect(dir)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {dir}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedTrack && (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            {t("tracks.entriesTitle")}:{" "}
            <span className="capitalize">{selectedTrack}</span>
          </h2>

          {entries.length === 0 ? (
            <p className="text-gray-500">{t("tracks.noEntries")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white border rounded-lg shadow p-5"
                >
                  <h3 className="text-xl font-bold mb-2">
                    {entry.projectName}
                  </h3>
                  <p className="mb-2 text-gray-700">
                    {entry.projectDescription}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {t("tracks.author")}: <strong>{entry.User.nickname}</strong>{" "}
                    ({entry.city})
                  </p>
                  {entry.presentationLink && (
                    <a
                      href={entry.presentationLink}
                      className="text-blue-500 underline text-sm"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("tracks.presentation")}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {canApply && (
            <div className="mt-10 text-center">
              <button
                onClick={() => navigate("/profile")}
                className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition"
              >
                {t("tracks.participate")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tracks;
