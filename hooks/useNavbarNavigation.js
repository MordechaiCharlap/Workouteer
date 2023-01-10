import React, { createContext, useState, useContext, useRef } from "react";

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
  const myUserNavigationOptions = useRef(upAnimation());
  const calendarNavigationOptions = useRef(upAnimation());
  const homeNavigationOptions = useRef(upAnimation());
  const chatsNavigationOptions = useRef(upAnimation());
  const exploreNavigationOptions = useRef(upAnimation());
  const setScreen = (screenName) => {
    switch (screenName) {
      case "MyUser":
        calendarNavigationOptions.current = rightAnimation();
        homeNavigationOptions.current = rightAnimation();
        chatsNavigationOptions.current = rightAnimation();
        exploreNavigationOptions.current = rightAnimation();
        break;
      case "Calendar":
        myUserNavigationOptions.current = leftAnimation();
        homeNavigationOptions.current = rightAnimation();
        chatsNavigationOptions.current = rightAnimation();
        exploreNavigationOptions.current = rightAnimation();
        break;
      case "Home":
        myUserNavigationOptions.current = leftAnimation();
        calendarNavigationOptions.current = leftAnimation();
        chatsNavigationOptions.current = rightAnimation();
        exploreNavigationOptions.current = rightAnimation();
        break;
      case "Chats":
        myUserNavigationOptions.current = leftAnimation();
        calendarNavigationOptions.current = leftAnimation();
        homeNavigationOptions.current = leftAnimation();
        exploreNavigationOptions.current = rightAnimation();
        break;
      case "Explore":
        myUserNavigationOptions.current = leftAnimation();
        calendarNavigationOptions.current = leftAnimation();
        homeNavigationOptions.current = leftAnimation();
        chatsNavigationOptions.current = leftAnimation();
        break;
    }
  };
  // const setAnimation = (direction, screenName) => {
  //   var options;

  //   switch (direction) {
  //     case "up":
  //       options = upAnimation();
  //       break;
  //     case "left":
  //       options = leftAnimation();
  //       break;
  //     case "right":
  //       options = rightAnimation();
  //       break;
  //   }
  //   switch (screenName) {
  //     case "MyUser":
  //       setMyUserNavigationOptions(options);
  //       break;
  //     case "Calendar":
  //       setCalendarNavigationOptions(options);
  //       break;
  //     case "Home":
  //       setHomeNavigationOptions(options);
  //       break;
  //     case "Chats":
  //       setChatsNavigationOptions(options);
  //       break;
  //     case "Explore":
  //       setExploreNavigationOptions(options);
  //       break;
  //   }
  // };

  return (
    <NavbarNavigationContext.Provider
      value={{
        myUserNavigationOptions,
        calendarNavigationOptions,
        homeNavigationOptions,
        chatsNavigationOptions,
        exploreNavigationOptions,
        setScreen,
      }}
    >
      {children}
    </NavbarNavigationContext.Provider>
  );
};

export default function useNavbarNavigation() {
  return useContext(NavbarNavigationContext);
}
