import { createContext } from "react";

export const MainLocations = createContext({
  Locs: [], // Default value (empty initially)
  setLocs: () => {}, // Placeholder function (will be replaced in Provider)
});
