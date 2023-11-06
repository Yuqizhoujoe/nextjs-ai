import React, { createContext, useContext, useState } from "react";

type AppContextProps = {
  voiceNames: {
    zh?: string;
    en?: string;
    ja?: string;
    ko?: string;
  };
};

const AppContext = createContext<AppContextProps | null>(null);

export const AppProvider = ({ children }) => {
  const [voiceNames, setVoiceNames] = useState();
  return (
    <AppContext.Provider value={{ voiceNames }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
