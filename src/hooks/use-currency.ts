import { useLanguage } from "@/contexts/LanguageContext";

export const useCurrency = () => {
  const { language, t } = useLanguage();

  const formatPrice = (price: number): string => {
    const symbol = t("currency.symbol");

    // Format with 3 decimal places for Tunisian Dinar
    const formattedPrice = price.toFixed(3);

    switch (language) {
      case "ar":
        return `${formattedPrice} ${symbol}`;
      case "fr":
        return `${formattedPrice} ${symbol}`;
      default:
        return `${symbol} ${formattedPrice}`;
    }
  };

  const getCurrencySymbol = (): string => {
    return t("currency.symbol");
  };

  return {
    formatPrice,
    getCurrencySymbol,
  };
};
