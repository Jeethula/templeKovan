import React, { useEffect, useRef } from "react";

const TranslateComponent = () => {
  const googleTranslateRef = useRef(null);

  useEffect(() => {
    let intervalId = null;
    const checkGoogleTranslate = () => {
      if (window.google && window.google.translate && window.google.translate.TranslateElement.InlineLayout) {
        clearInterval(intervalId);
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "ta",
            layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL
          },
          googleTranslateRef.current
        );
      }
    };
    intervalId = setInterval(checkGoogleTranslate, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div ref={googleTranslateRef}></div>
    </div>
  );
};

export default TranslateComponent;