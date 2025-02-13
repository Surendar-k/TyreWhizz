import React, { createContext, useState, useContext } from "react";
import { fetchTranslation } from "./translate"; // Import translation function

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default to English
  const [translatedText, setTranslatedText] = useState({}); // Store translated text

  // Function to translate all texts globally
  const updateTranslations = async (texts) => {
    if (!texts || texts.length === 0) return;
    
    const translated = await fetchTranslation(texts, language);
    setTranslatedText(
      texts.reduce((acc, text, index) => {
        acc[text] = translated[index];
        return acc;
      }, {})
    );
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translatedText, updateTranslations }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
