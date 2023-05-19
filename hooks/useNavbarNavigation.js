import React, { createContext, useState, useContext, useRef } from "react";

const NavbarNavigationContext = createContext({});

export const NavbarNavigationProvider = ({ children }) => {
  const upAnimation = () => {
    const options = {
      headerShown: false,
      animation: "slide_from_bottom",
      animationTypeForReplace: "push",
    };
    return options;
  };
  const rightAnimation = () => {
    const options = {
      headerShown: false,
      animation: "slide_from_right",
      animationTypeForReplace: "push",
    };
    return options;
  };
  const leftAnimation = () => {
    const options = {
      headerShown: false,
      animation: "slide_from_left",
      animationTypeForReplace: "push",
    };
    return options;
  };
  const myUserNavigationOptions = useRef(upAnimation());
  const leaderboardNavigationOptions = useRef(upAnimation());
  const homeNavigationOptions = useRef(upAnimation());
  const chatsNavigationOptions = useRef(upAnimation());
  const exploreNavigationOptions = useRef(upAnimation());
  const setScreen = (screenName) => {
    switch (screenName) {
      case "MyProfile":
        leaderboardNavigationOptions.current = rightAnimation();
        homeNavigationOptions.current = rightAnimation();
        chatsNavigationOptions.current = rightAnimation();
        exploreNavigationOptions.current = rightAnimation();
        break;
      case "Leaderboard":
        myUserNavigationOptions.current = leftAnimation();
        homeNavigationOptions.current = rightAnimation();
        chatsNavigationOptions.current = rightAnimation();
        exploreNavigationOptions.current = rightAnimation();
        break;
      case "Home":
        myUserNavigationOptions.current = leftAnimation();
        leaderboardNavigationOptions.current = leftAnimation();
        chatsNavigationOptions.current = rightAnimation();
        exploreNavigationOptions.current = rightAnimation();
        break;
      case "Chats":
        myUserNavigationOptions.current = leftAnimation();
        leaderboardNavigationOptions.current = leftAnimation();
        homeNavigationOptions.current = leftAnimation();
        exploreNavigationOptions.current = rightAnimation();
        break;
      case "Explore":
        myUserNavigationOptions.current = leftAnimation();
        leaderboardNavigationOptions.current = leftAnimation();
        homeNavigationOptions.current = leftAnimation();
        chatsNavigationOptions.current = leftAnimation();
        break;
    }
  };

  return (
    <NavbarNavigationContext.Provider
      value={{
        myUserNavigationOptions,
        leaderboardNavigationOptions,
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
