import { FC, CSSProperties, useCallback, useState } from "react";

export type AvatarMode = "header" | "profile-page";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;       
  className?: string;
  fallbackSrc?: string;
  mode?: AvatarMode;
}

export const Avatar: FC<AvatarProps> = ({
  src,
  alt = "User avatar",
  size = 46,
  className = "",
  fallbackSrc,
  mode = "header",
}) => {
  const [broken, setBroken] = useState(false);

  const boxStyle: CSSProperties = { width: size, height: size };
  const isProfilePageMode = mode === "profile-page";
  const hasHoverRing = mode === "header";

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

  const hoverRingClasses = hasHoverRing
    ? 'hover:ring-6 transition-all duration-300 ring-fuchsia-400/20'
    : '';

  const avatarElement = !src || broken ? (
    <div
      className={`rounded-full bg-pink-400 ${isProfilePageMode ? '' : className}`}
      style={boxStyle}
      role="img"
      aria-label={alt}
    />
  ) : (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`rounded-full object-cover block ${hoverRingClasses} ${isProfilePageMode ? '' : className}`}
      style={boxStyle}
      onError={handleError}
    />
  );

  if (isProfilePageMode) {
    return (
      <div className={`avatar-profile-page ${className}`}>
        {avatarElement}
      </div>
    );
  }

  return avatarElement;
};
