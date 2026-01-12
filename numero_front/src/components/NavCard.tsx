import * as React from "react";
import { Link } from "react-router-dom";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { ArrowRight, type IconProps } from "phosphor-react";

export type NavCardProps = {
  title: ReactNode;
  subtitle: ReactNode;
  description: ReactNode;
  link?: string;
  icon?: ReactElement<IconProps>;
  className?: string;
  "aria-label"?: string;
};

type CSSVars = CSSProperties & Record<"--circle" | "--inset", string>;

export default function NavCard({
  title,
  subtitle,
  description,
  link,
  icon,
  className,
  "aria-label": ariaLabel,
}: NavCardProps) {
  const vars: CSSVars = {
    "--circle": "7rem",
    "--inset": "0.4rem",
  };

  const Container = link ? Link : "div";
  const containerProps: any = link ? { to: link } : {};

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
        "group min-h-[10rem] relative block overflow-hidden rounded-lg bg-[var(--navcard-bg)]",
        "flex flex-col p-4",
        "transition-all duration-300 ease-out",
        "shadow-[0_6px_12px_rgba(0,0,0,0.2)]",
        // hover
        "hover:-translate-y-[5px] hover:scale-[1.01]",
        "hover:shadow-[0_6px_12px_rgba(0,0,0,0.1),0_6px_24px_var(--navcard-glow)]",
        className ?? "",
      ].join(" ")}
    >
      {/* decor: increasing circle */}
      <div
        className={[
          "absolute -top-4 z-0 rounded-full bg-[color:var(--navcard-accent)]",
          "transition-transform duration-300 ease-out will-change-transform pointer-events-none",
          "group-hover:scale-[20]",
        ].join(" ")}
        style={{
          width: "5rem",
          height: "5rem",
          right: "4rem",
          bottom: "calc(-0.35 * var(--circle))",
        }}
        aria-hidden
      />

      {/* text block */}
      <div className="relative z-10 grid gap-2 pr-14">
        <div
          className={[
            "text-[1.0625rem] leading-6 font-bold truncate",
            "text-[color:var(--navcard-title)]",
            "group-hover:text-[color:var(--navcard-title-hover)]",
          ].join(" ")}
        >
          {title}
        </div>

        <div
          className={[
            "text-sm leading-5 truncate",
            "text-[color:var(--navcard-subtitle)]",
            "group-hover:text-[color:var(--navcard-subtitle-hover)]",
          ].join(" ")}
        >
          {subtitle}
        </div>

        <div
          className={[
            "text-sm leading-5 font-medium mb-4",
            "text-[color:var(--navcard-desc)]",
            "group-hover:text-[color:var(--navcard-desc-hover)]",
          ].join(" ")}
        >
          {description}
        </div>
      </div>

      {/* round button-decor + icon */}
      <div
        className={[
          "absolute right-6 bottom-6 z-0 rounded-full",
          "flex items-center justify-center",
          "border-2 border-[color:var(--navcard-accent)] bg-[var(--navcard-bg)]",
          "transition-colors duration-300 ease-out",
          "group-hover:border-[color:var(--navcard-accent-soft)] group-hover:bg-[color:var(--navcard-accent)]",
          "text-[color:var(--navcard-accent-soft)] group-hover:text-[color:var(--navcard-accent)]",
        ].join(" ")}
        style={{
          width: "var(--circle)",
          height: "var(--circle)",
          top: "-2rem",
          right: "-1rem",
        }}
        aria-hidden
      >
        {/* inner circle */}
        <div
          className="absolute rounded-full transition-colors duration-300 ease-out"
          style={{
            top: "var(--inset)",
            left: "var(--inset)",
            width: "calc(var(--circle) - 2 * var(--inset))",
            height: "calc(var(--circle) - 2 * var(--inset))",
            background: "var(--navcard-accent)",
          }}
          aria-hidden
        />

        <div className="relative z-10">{IconNode}</div>

        {/* hover overlay */}
        <div
          className="absolute rounded-full transition-colors duration-300 ease-out group-hover:bg-[color:var(--navcard-accent-soft)]"
          style={{
            top: "var(--inset)",
            left: "var(--inset)",
            width: "calc(var(--circle) - 2 * var(--inset))",
            height: "calc(var(--circle) - 2 * var(--inset))",
          }}
          aria-hidden
        />
      </div>

      {/* arrow */}
      <div className="absolute bottom-3 right-4 z-10">
        <ArrowRight
          size={24}
          weight="regular"
          className={[
            "text-[color:var(--navcard-accent)]",
            "group-hover:text-[color:var(--navcard-accent-soft)]",
            "group-hover:translate-x-1 transition-transform duration-300",
          ].join(" ")}
        />
      </div>
    </Container>
  );
}
