import { createContext } from "react";

const authContext = createContext({
  user: null,
  setUser: () => {},
});
export default authContext;
