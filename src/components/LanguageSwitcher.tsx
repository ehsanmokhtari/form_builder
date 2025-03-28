import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Globe } from "lucide-react";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fa" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="language-switcher inline-flex items-center px-3 my-auto h-10 text-sm font-medium bg-blue-500 rounded text-white hover:bg-purple-600 transition-colors duration-200"
      aria-label={language === "en" ? t("switchToFarsi") : t("switchToEnglish")}
    >
      <Globe className="w-4 h-4 mr-2" />
      {language === "en" ? t("switchToFarsi") : t("switchToEnglish")}
    </button>
  );
};
