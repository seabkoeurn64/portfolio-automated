import React, { useState, useEffect, useCallback } from "react";

const ImageModal = ({ isOpen, onClose, imageUrl, title }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Fade-in/out control
  useEffect(() => {
    if (isOpen) setIsVisible(true);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300); // match animation duration
  }, [onClose]);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 
        transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose} // click backdrop to close
    >
      <div
        className="flex flex-col items-center max-h-[95vh] overflow-auto rounded-lg"
        onClick={(e) => e.stopPropagation()} // stop click propagation
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full max-w-full max-h-[80vh] object-contain rounded-md transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {title && (
          <p className="text-white text-center mt-3 text-base sm:text-lg px-2">
            {title}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
