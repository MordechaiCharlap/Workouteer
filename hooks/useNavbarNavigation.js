import React, { createContext, useState } from "react";

const NavbarNavigationContext = createContext({});

export const NavbarNavigationProvider = ({ children }) => {
  const [myUserNavigationOptions, setMyUserNavigationOptions] = useState();
  const [calendarNavigationOptions, setCalendarNavigationOptions] = useState();
  const [homeNavigationOptions, setHomeNavigationOptions] = useState();
  const [chatsNavigationOptions, setChatsNavigationOptions] = useState();
  const [exploreNavigationOptions, setExploreNavigationOptions] = useState();
  const setAnimation = (direction, screenName) => {
    var options;

    switch (direction) {
      case "up":
        options = upAnimation();
        break;
      case "left":
        options = leftAnimation();
        break;
      case "right":
        options = rightAnimation();
        break;
    }
    switch (screenName) {
      case "MyUser":
        setMyUserNavigationOptions(options);
        break;
      case "Calendar":
        setCalendarNavigationOptions(options);
        break;
      case "Home":
        setHomeNavigationOptions(options);
        break;
      case "Chats":
        setChatsNavigationOptions(options);
        break;
      case "Explore":
        setExploreNavigationOptions(options);
        break;
    }
  };

  const upAnimation = () => {
    const options = {
      animation: "slide_from_bottom",
      animationTypeForReplace: "push",
    };
    return options;
  };
  const rightAnimation = () => {
    const options = {
      animation: "slide_from_right",
      animationTypeForReplace: "push",
    };
    return options;
  };
  const leftAnimation = () => {
    const options = {
      animation: "slide_from_left",
      animationTypeForReplace: "push",
    };
    return options;
  };
  return (
    <NavbarNavigationContext.Provider
      value={{
        myUserNavigationOptions,
        calendarNavigationOptions,
        homeNavigationOptions,
        chatsNavigationOptions,
        exploreNavigationOptions,
        setAnimation,
      }}
    >
      {children}
    </NavbarNavigationContext.Provider>
  );
};

export default function useNavbarNavigation() {
  return useContext(NavbarNavigationContext);
}
