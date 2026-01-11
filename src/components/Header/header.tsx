import React from "react";
import "./Header.scss";
import type { HeaderProps } from "./header.types";


export const Header: React.FC<HeaderProps> = ({ title, subtitle, userName, userRoleText }) => {
  return (
    <header className="mr-header">
      <div className="mr-header__left">
        <h1 className="mr-header__title">{title}</h1>
        <p className="mr-header__subtitle">{subtitle}</p>
      </div>

      <div className="mr-header__user">
        <div className="mr-header__userName">{userName}</div>
        <div className="mr-header__userRole">{userRoleText}</div>
      </div>
    </header>
  );
};
