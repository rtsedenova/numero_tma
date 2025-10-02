import { FC, CSSProperties, useCallback, useState } from "react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;       
  className?: string;
  fallbackSrc?: string;
}

export const Avatar: FC<AvatarProps> = ({
  src,
  alt = "User avatar",
  size = 46,
  className = "",
  fallbackSrc,
}) => {
  const [broken, setBroken] = useState(false);

  const boxStyle: CSSProperties = { width: size, height: size };

  const handleError = useCallback<React.ReactEventHandler<HTMLImageElement>>(
    (e) => {
      if (fallbackSrc) {
        const img = e.currentTarget;
        if (img.src !== fallbackSrc) {
          img.src = fallbackSrc; 
          return;
        }
      }
      setBroken(true);
    },
    [fallbackSrc]
  );

  if (!src || broken) {
    return (
      <div
        className={`rounded-full bg-pink-400 ${className}`}
        style={boxStyle}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`rounded-full object-cover block hover:ring-6 transition-all duration-300 ring-fuchsia-400/20 ${className}`}
      style={boxStyle}
      onError={handleError}
    />
  );
};
