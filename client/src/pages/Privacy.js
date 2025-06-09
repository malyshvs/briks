import React from "react";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{t("privacy.title")}</h1>
      <pre className="whitespace-pre-wrap text-justify text-sm leading-6 font-sans">
        {t("privacy.text")}
      </pre>
    </div>
  );
};

export default Privacy;
