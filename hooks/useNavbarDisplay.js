import React, { createContext, useContext, useState } from "react";
const NavbarDisplayContext = createContext({});

export const NavbarDisplayProvider = ({ children }) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [currentScreen, setCurrentScreen] = useState();
  return (
    <NavbarDisplayContext.Provider
      value={{ showNavbar, setShowNavbar, currentScreen, setCurrentScreen }}
    >
      {children}
    </NavbarDisplayContext.Provider>
  );
};
export default function useNavbarDisplay() {
  return useContext(NavbarDisplayContext);
}
