import { createContext } from "react";

export const MainLocations = createContext({
  Locs: [], // Default value (empty initially)
  setLocs: () => {}, // Placeholder function (will be replaced in Provider)
});
export const ZoomLocations = createContext({
  ZoomLocs: [], // Default value (empty initially)
  setZoomLocs: () => {}, // Placeholder function (will be replaced in Provider)
  Zoom:[],
  setZoom:()=>{}
});