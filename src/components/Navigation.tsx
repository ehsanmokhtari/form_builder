import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, FileText, Settings } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <nav className="bg-white shadow-lg border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16">
          <div className="flex w-full justify-between">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t("formBuilder")}
              </h1>
            </div>
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">{t("openMainMenu")}</span>
                {isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:gap-8">
              <NavigationLinks className="" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${isMenuOpen ? "flex justify-center" : "hidden"} sm:hidden`}
        id="mobile-menu"
      >
        <div className="flex flex-col items-center justify-center gap-1 p-2">
          <NavigationLinks className="block rounded-md text-base font-medium" />
        </div>
      </div>
    </nav>
  );
};

function NavigationLinks({ className }: { className: string }) {
  const { pathname } = useLocation();
  const { t } = useLanguage();
  return (
    <>
      <Link
        to="/"
        className={`inline-flex items-center px-3 py-2 text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200 ${
          pathname === "/" ? "font-bold text-purple-600" : "font-medium"
        } ${className}`}
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        {t("builder")}
      </Link>
      <Link
        to="/responses"
        className={`inline-flex items-center px-3 py-2 text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200 ${
          pathname === "/responses"
            ? "font-bold text-purple-600"
            : "font-medium"
        } ${className}`}
      >
        <FileText className="w-4 h-4 mr-2" />
        {t("responses")}
      </Link>
      <Link
        to="/settings"
        className={`inline-flex items-center px-3 py-2 text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200 ${
          pathname === "/settings" ? "font-bold text-purple-600" : "font-medium"
        } ${className}`}
      >
        <Settings className="w-4 h-4 mr-2" />
        {t("settings")}
      </Link>
      <Link
        to="/respond"
        className={`inline-flex items-center px-3 py-2 text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200 ${
          pathname === "/respond" ? "font-bold text-purple-600" : "font-medium"
        } ${className}`}
      >
        <FileText className="w-4 h-4 mr-2" />
        {t("respond")}
      </Link>
      <LanguageSwitcher />
    </>
  );
}

export default Navigation;
