import React, { useState } from "react";

const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur loading placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover duration-500 
          ${loaded ? "opacity-100" : "opacity-0 blur-sm"}
        `}
      />
    </div>
  );
};

export default LazyImage;
