import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Ensure this is set in your environment

export const fetchTranslation = async (texts, targetLang) => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error("❌ ERROR: Missing Google Translate API Key.");
    return texts;
  }

  if (!texts || (Array.isArray(texts) && texts.length === 0)) {
    console.error("❌ ERROR: Empty text provided for translation.");
    return texts;
  }

  if (!targetLang) {
    console.error("❌ ERROR: Missing target language.");
    return texts;
  }

  try {
    // Ensure input is an array
    const textArray = Array.isArray(texts) ? texts : [texts];

    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {
        q: textArray,
        target: targetLang,
        format: "text", // Ensures plain text translation
      },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: GOOGLE_MAPS_API_KEY },
      }
    );

    const translations = response?.data?.data?.translations;

    if (!translations) {
      console.error("❌ ERROR: Invalid response from Google API:", response.data);
      return texts;
    }

    return translations.map((t) => t.translatedText);
  } catch (error) {
    console.error("❌ Translation API Error:", error?.response?.data || error.message);

    if (error?.response?.status === 400) {
      console.error("⚠️ Possible Causes: Invalid API request, missing parameters, or incorrect language code.");
    }

    return texts; // Return original text if translation fails
  }
};

export default fetchTranslation;
