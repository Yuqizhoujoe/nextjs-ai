import React, { createContext, useContext, useEffect, useState } from "react";
import { Conversation, COUNTRY_DATA, VoiceData } from "./data/type";
import _ from "lodash";
import { SESSION_STORAGE } from "./data/constant";

type AppContextProps = {
  voiceData: VoiceData;
  addVoice: any;
  conversations: Conversation[];
  cacheConversations: any;
};

const AppContext = createContext<AppContextProps | null>(null);

export const AppProvider = ({ children }) => {
  const [voiceData, setVoiceData] = useState<VoiceData>();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const cachedVoiceData = sessionStorage.getItem(SESSION_STORAGE.VOICE_DATA);
    const cachedConversations = sessionStorage.getItem(
      SESSION_STORAGE.CONVERSATIONS
    );
    if (cachedVoiceData) {
      setVoiceData(JSON.parse(cachedVoiceData));
    }
    if (cachedConversations) {
      setConversations(JSON.parse(cachedConversations));
    }
  }, []);

  useEffect(() => {
    if (voiceData) {
      sessionStorage.setItem(
        SESSION_STORAGE.VOICE_DATA,
        JSON.stringify(voiceData)
      );
    }
  }, [voiceData]);

  useEffect(() => {
    if (conversations) {
      sessionStorage.setItem(
        SESSION_STORAGE.CONVERSATIONS,
        JSON.stringify(conversations)
      );
    }
  }, [conversations]);

  const addVoice = (
    countryData: COUNTRY_DATA,
    voice: string,
    gender: string
  ) => {
    setVoiceData((prev) => {
      const updateVoiceData = _.cloneDeep(prev) || {};
      const { locale, language, countryName, countryCode } = countryData;
      updateVoiceData[`${countryCode}-${gender}`] = {
        language,
        countryName,
        countryCode,
        locale,
        voice,
      };
      return updateVoiceData;
    });
  };

  const cacheConversations = (conversations: Conversation[]) => {
    setConversations(conversations);
  };

  return (
    <AppContext.Provider
      value={{ voiceData, addVoice, cacheConversations, conversations }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
