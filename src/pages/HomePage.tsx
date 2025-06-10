import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FlagIcon } from "@/components/FlagIcon";
import ShopContactDetails from "@/components/ShopContactDetails";

const HomePage = () => {
  const { language, setLanguage, languages, t, isRTL } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const navigate = useNavigate();

  const handleContinue = () => {
    setLanguage(selectedLanguage);
    navigate("/marketplace");
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 flex items-center justify-center p-4 ${isRTL ? "font-arabic" : ""}`}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            {/* New Hexagonal Logo */}
            <div className="relative">
              <img
                src="/logo-ms.svg"
                alt="Mars Shop Logo"
                className="w-20 h-20 drop-shadow-lg"
              />
            </div>
            <h1 className="text-5xl script-logo">{t("home.title")}</h1>
          </div>
          <p className="text-lg text-amber-700 font-medium">
            {t("home.subtitle")}
          </p>
        </div>

        {/* Language Selector */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <Globe className="h-5 w-5" />
                <h2 className="text-lg font-semibold">
                  {t("home.selectLanguage")}
                </h2>
              </div>

              <div className="space-y-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-4 hover:shadow-md ${
                      selectedLanguage === lang.code
                        ? "border-amber-500 bg-amber-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <FlagIcon language={lang.code} size="lg" />
                    <span className="text-lg font-medium text-gray-900">
                      {lang.name}
                    </span>
                    {selectedLanguage === lang.code && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          className="w-full py-6 text-lg bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
        >
          {t("home.continue")}
        </Button>

        {/* Shop Contact Details */}
        <ShopContactDetails variant="homepage" />

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          {t("footer.copyright")}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
