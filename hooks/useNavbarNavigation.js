import React, { createContext, useState, useContext } from "react";

const NavbarNavigationContext = createContext({});

export const NavbarNavigationProvider = ({ children }) => {
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
  const [myUserNavigationOptions, setMyUserNavigationOptions] = useState(
    upAnimation()
  );
  const [calendarNavigationOptions, setCalendarNavigationOptions] = useState(
    upAnimation()
  );
  const [homeNavigationOptions, setHomeNavigationOptions] = useState(
    upAnimation()
  );
  const [chatsNavigationOptions, setChatsNavigationOptions] = useState(
    upAnimation()
  );
  const [exploreNavigationOptions, setExploreNavigationOptions] = useState(
    upAnimation()
  );
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
