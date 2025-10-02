import React from "react";
import { type User } from "@telegram-apps/sdk-react";

import { useNavigate } from "react-router-dom";

import { Avatar } from "./Avatar";
import { NotificationIcon } from "./Notification";

import crystallIcon from "../assets/crystall_currency.svg";

export interface AccountHeaderProps {
  user?: User;
  balance?: number;
  className?: string;
}

const CurrencyChip: React.FC<{ value: string; className?: string }> = ({
  value,
  className = "",
}) => (
  <div
    className={`
      inline-flex items-center gap-1 px-3 py-0.5 rounded-full
      border border-violet-300/70
      shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]
      bg-gradient-to-r from-fuchsia-500/10 via-violet-500/10 to-indigo-500/10
      transition-colors
      hover:from-fuchsia-500/30 hover:via-violet-500/20 hover:to-indigo-500/20
      text-violet-200 font-semibold whitespace-nowrap
      ${className}
    `}
  >
    <img src={crystallIcon} alt="" className="w-4 h-4" />
    <span className="text-sm tabular-nums">{value}</span>
  </div>
);

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  user,
  balance = 0,
  className = "",
}) => {
  const balanceText = new Intl.NumberFormat("ru-RU").format(balance);
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate("/profile");
  };

  return (
    <header className={`flex items-center justify-between ${className}`}>
      {/* ---  Left part  --- */}
      <div className="flex items-center gap-4">
        <button onClick={handleAvatarClick}>
          <Avatar
          src={user?.photoUrl}
          alt={`${user?.firstName || "User"} avatar`}
          size={54}
          />
        </button>

        {/* ---  Name + balance: before md - column; after md - row  --- */}
        <div className="flex flex-col md:flex-row md:items-center gap-1.5 leading-tight">
          <span className="font-medium text-violet-200 text-[15px] md:text-[16px]">
            {user?.firstName || "User"}
          </span>

          {/* --- Balance chip: only on xs --- */}
          <div className="flex md:hidden">
            <CurrencyChip value={balanceText} />
          </div>
        </div>
      </div>

      {/* --- Right part: on md+ show balance chip next to notifications --- */}
      <div className="flex items-center gap-4">
        {/* --- Balance chip: only on md and above --- */}
        <div className="hidden md:flex">
          <CurrencyChip value={balanceText} />
        </div>
        <NotificationIcon size={24}/>
      </div>
    </header>
  );
};
