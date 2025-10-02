import * as React from "react";
import { Link } from "react-router-dom";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { ArrowRight, type IconProps } from "phosphor-react";

export type NavCardPalette = {
  accent: string;   
  light: string;   
  shadow?: string; 
};

export type NavCardProps = {
  title: ReactNode;
  subtitle: ReactNode;
  description: ReactNode;
  link?: string;
  icon?: ReactElement<IconProps>;
  className?: string;
  palette?: NavCardPalette;
  "aria-label"?: string;
};

type CSSVars = CSSProperties & Record<
  "--accent" | "--light" | "--shadow" | "--circle" | "--inset",
  string
>;

export default function NavCard({
  title,
  subtitle,
  description,
  link,
  icon,
  className,
  palette,
  "aria-label": ariaLabel,
}: NavCardProps) {
  const defaults: Required<NavCardPalette> = {
    accent: "#AD67DF",
    light:  "#F1DFFD",
    shadow: "rgba(206, 178, 252, 0.48)",
  };

  const accent = palette?.accent ?? defaults.accent;
  const light  = palette?.light  ?? defaults.light;

  const shadow = palette?.shadow ?? `color-mix(in srgb, ${accent} 48%, transparent)`;

  const vars: CSSVars = {
    "--accent": accent,
    "--light":  light,
    "--shadow": shadow,
    "--circle": "7rem",
    "--inset":  "0.4rem",
  };

  const Container = link ? Link : "div";
  const containerProps: { to?: string } = link ? { to: link } : {};  

  const IconNode: React.ReactElement<IconProps> | null = icon
  ? React.cloneElement<IconProps>(icon, {
      size: 60,
      weight: icon.props.weight ?? "regular",
      color: "currentColor",
      className: [icon.props.className ?? "", "transition-colors"].join(" "),
    })
  : null;

  return (
    <Container
      {...containerProps}
      aria-label={ariaLabel}
      style={vars}
      className={[
        // base
        "group min-h-[10rem] relative block overflow-hidden rounded-lg bg-white",
        "flex flex-col p-4",
        "transition-all duration-300 ease-out",
        "shadow-[0_6px_12px_rgba(0,0,0,0.2)]",
        // hover + focus
        "hover:-translate-y-[5px] hover:scale-[1.01]",
        "hover:shadow-[0_6px_12px_rgba(0,0,0,0.1),0_6px_24px_var(--shadow)]",
        className ?? "",
      ].join(" ")}
    >
      {/* decor: increasing circle */}
      <div
        className={[
          "absolute -top-4 z-0 rounded-full bg-[color:var(--accent)]",
          "transition-transform duration-300 ease-out will-change-transform pointer-events-none",
          "group-hover:scale-[20]",
        ].join(" ")}
        style={{
          width:  "5rem",
          height: "5rem",
          right:  "4rem",
          bottom: "calc(-0.35 * var(--circle))",
        }}
        aria-hidden
      />

      {/* text block */}
      <div className="relative z-10 grid gap-2 pr-14 text-[#4c5656] group-hover:text-[color:var(--light)]">
        <div className="text-[1.0625rem] leading-6 font-bold truncate">
          {title}
        </div>

        <div className="text-sm leading-5 opacity-80 truncate">
          {subtitle}
        </div>

        <div className="text-sm leading-5 font-medium mb-4">
          {description}
        </div>
      </div>

      {/* round button-decor + icon */}
      <div
        className={[
          "absolute right-6 bottom-6 z-0 rounded-full",
          "flex items-center justify-center",
          "border-2 border-[color:var(--accent)] bg-white",
          "transition-colors duration-300 ease-out",
          "group-hover:border-[color:var(--light)] group-hover:bg-[color:var(--accent)]",
          "text-[color:var(--light)] group-hover:text-[color:var(--accent)]",
        ].join(" ")}
        style={{ width: "var(--circle)", height: "var(--circle)", top: "-2rem", right: "-1rem" }}
        aria-hidden
      >
        {/* inner circle (accent -> light) */}
        <div
          className="absolute rounded-full transition-colors duration-300 ease-out"
          style={{
            top: "",
            left: "var(--inset)",
            width: "calc(var(--circle) - 2 * var(--inset))",
            height:"calc(var(--circle) - 2 * var(--inset))",
            background: "var(--accent)",
          }}
        />
        <div className="relative z-10">{IconNode}</div>
        <div
          className="absolute rounded-full transition-colors duration-300 ease-out group-hover:bg-[color:var(--light)]"
          style={{
            top: "",
            left: "var(--inset)",
            width: "calc(var(--circle) - 2 * var(--inset))",
            height:"calc(var(--circle) - 2 * var(--inset))",
          }}
          aria-hidden
        />
      </div>

      {/* arrow */}
      <div className="absolute bottom-3 right-4 z-10">
        <ArrowRight
          size={24}
          weight="regular"
          className="text-[color:var(--accent)] group-hover:text-[color:var(--light)] group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </Container>
  );
}
