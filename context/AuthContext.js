import { React, useState, createContext } from "react";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
});
export default AuthContext;
