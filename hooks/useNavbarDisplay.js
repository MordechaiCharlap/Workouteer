import React, { createContext, useContext, useEffect, useState } from "react";
const NavbarDisplayContext = createContext({});

export const NavbarDisplayProvider = ({ children }) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [currentScreen, setCurrentScreen] = useState();
  const dontShowNavbar = [
    "Chat",
    "Login",
    "Register",
    "ConfirmWorkout",
    "LandscapeOrientation",
    "UpdateApp",
    "WindowTooSmall",
    "LinkUserWithGoogle",
    "TermsOfService",
    "PrivacyPolicy",
    "ConnectToInternet",
    "UnderMaintenance",
  ];
  useEffect(() => {
    if (dontShowNavbar.includes(currentScreen)) {
      setShowNavbar(false);
    } else setShowNavbar(true);
  }, [currentScreen]);
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
