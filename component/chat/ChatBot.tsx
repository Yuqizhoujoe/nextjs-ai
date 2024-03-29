"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatBox from "../common/ChatBox";
// utility
import _, { isEmpty } from "lodash";

// openai
import { getChatResponse } from "../../shared/openai/openAI";

// interface
import { Conversation, VOICE_COUNTRY_DATA } from "../../shared/data/type";

// constant
import { userTypes } from "../../shared/data/constant";
// MUI
import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";
import DirectionsIcon from "@mui/icons-material/Directions";

import axios from "../../shared/api/axios";

// hooks
import useSpeech from "../../shared/hooks/useSpeech";
import { useAppContext } from "../../shared/context";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
// import Speech from "../common/Speech";
const Speech = dynamic(() => import("../common/Speech"), {
  ssr: false,
});

const COMPONENT = "chat_bot_component";

const state = {
  SUCCESS: "success",
  SENT: "sent",
  ERROR: "error",
  NOTHING: "nothing",
};

type Status = (typeof state)[keyof typeof state];

export default function ChatBot() {
  const [userInput, setUserInput] = useState("");
  const [switchToVoice, setSwitch] = useState(false);
  const [status, setStatus] = useState<Status>(state.NOTHING);
  const [voiceCountryData, setVoiceCountryData] = useState<{
    key: string;
    data: VOICE_COUNTRY_DATA;
  }>(undefined);
  const [recording, setRecording] = useState<boolean>(false);

  // chat box ref
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { route } = router;

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url !== "/chat") setRecording(true);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [route]);

  const {
    voiceData,
    conversations: savedConversations,
    cacheConversations,
  } = useAppContext();
  const { useSpeechSynthesisFromMicrosoft } = useSpeech(recording);

  const [conversations, setConversations] =
    useState<Conversation[]>(savedConversations);

  useEffect(() => {
    if (!isEmpty(conversations)) {
      handleChatBoxScroll();
    }

    return () => {
      cacheConversations(conversations);
    };
  }, [conversations]);

  const createOpenAIChatCompletionOptions = (voiceImageKey?: string) => ({
    addItem: () =>
      setConversations((prevState) => {
        return [
          ...prevState,
          {
            id: prevState.length + 1,
            date: new Date(),
            type: userTypes.CHAT_BOT,
            content: "",
            loading: true,
            voiceImageKey: voiceImageKey,
          },
        ];
      }),
    handleResult: (value) =>
      setConversations((prevState) => {
        const lastConversation = prevState[prevState.length - 1];
        prevState[prevState.length - 1] = {
          ...lastConversation,
          content: `${lastConversation.content}${value}`,
          loading: false,
        };
        // don't return prevState
        // return [...prevState]
        return [...prevState];
      }),
    voiceInput: switchToVoice,
  });

  // handler
  const handleChatBoxScroll = () => {
    chatBoxRef.current.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleInput = (e: any) => {
    e.preventDefault();
    const input = e.target.value;
    setUserInput(input);
  };

  const handleSubmitInput = async (e: any) => {
    try {
      e.preventDefault();
      if (isEmpty(userInput)) return;
      // user input conversation
      setConversations((prevState) => {
        return [
          ...prevState,
          {
            content: userInput,
            date: new Date(),
            id: prevState.length + 1,
            type: userTypes.USER,
            loading: false,
          },
        ];
      });
      setUserInput("");

      setStatus(state.SENT);
      const options = createOpenAIChatCompletionOptions();
      const openAIChatCompletionResult = await getChatResponse(
        userInput,
        options
      );
      console.log("OPEN_AI_CHAT_COMPLETION", { openAIChatCompletionResult });
      setStatus(state.SUCCESS);
    } catch (e) {
      setStatus(state.ERROR);
      console.error(e);
    }
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmitInput(e);
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setUserInput((input) => input + "\n");
    }
  };

  const handleSwitchChange = (e: any) => {
    setSwitch(e.target.checked);
  };

  const handleUserVoiceInput = async (text: string) => {
    if (isEmpty(text)) return;
    // user input conversation
    setConversations((prevState) => {
      return [
        ...prevState,
        {
          content: text,
          date: new Date(),
          id: prevState.length + 1,
          type: userTypes.USER,
          loading: false,
        },
      ];
    });

    try {
      // detect language text
      const languageResult = await axios.post(
        `/language?action=detect-language`,
        { text }
      );
      const lan = _.get(languageResult, "data.result.iso6391Name", "en");
      const language = lan.slice(0, 2);

      const matchingLanguageVoiceData = Object.entries(voiceData).find(
        ([_, voiceCountryData]) => voiceCountryData.language === language
      );
      const [voiceImageKey, voiceCountryData] = matchingLanguageVoiceData;

      console.log("SET_VOICE_COUNTRY_DATA_CHAT_BOT", {
        voiceData,
        language,
        matchingLanguageVoiceData,
        voiceCountryData,
        voiceImageKey,
      });

      setVoiceCountryData({ key: voiceImageKey, data: voiceCountryData });

      setStatus(state.SENT);
      const options = createOpenAIChatCompletionOptions(voiceImageKey);
      const aiResponse = await getChatResponse(text, options);
      setStatus(state.SUCCESS);
      if (switchToVoice && !_.isEmpty(voiceCountryData)) {
        useSpeechSynthesisFromMicrosoft({
          text: aiResponse,
          voiceName: voiceCountryData.voice,
        })
          .then()
          .catch();
      }
    } catch (e) {
      setStatus(state.ERROR);
      console.error(e);
    }
  };

  // render
  const renderChatBox = () => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          // height: switchToVoice ? "60vh" : "48vh",
          overflow: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        data-testid="chat_bot_chat_box"
        ref={chatBoxRef}
      >
        {conversations.map((conversation, index) => (
          <ChatBox
            key={index}
            conversation={conversation}
            component={COMPONENT}
            voiceImageKey={conversation.voiceImageKey}
          />
        ))}
      </Box>
    );
  };

  const renderUserTypeInputBox = () => {
    return (
      <FormControl
        data-testid="user_input_box_form_control"
        sx={{ width: "100%", marginY: 2, position: "sticky", bottom: 0 }}
      >
        {/*<InputLabel htmlFor="chat-box">JoJo Chatbot</InputLabel>*/}
        <TextField
          id="chat-box"
          data-testid="chat_bot_chat_box"
          multiline={true}
          rows={3}
          label="JoJo Chatbot"
          value={userInput}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <IconButton
                color="primary"
                aria-label="directions"
                sx={{ position: "absolute", right: 2, bottom: 4 }}
                onClick={handleSubmitInput}
              >
                <DirectionsIcon />
              </IconButton>
            ),
          }}
        />
      </FormControl>
    );
  };

  const renderSwitch = () => {
    return (
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <FormControl>
          <FormControlLabel
            label="Switch to voice input"
            value={switchToVoice}
            labelPlacement="end"
            control={<Switch color="primary" />}
            onChange={handleSwitchChange}
          />
        </FormControl>
      </Box>
    );
  };

  const renderUserInputBox = () => {
    return (
      <Box data-testid={`${COMPONENT}_user_input_box`}>
        {switchToVoice && status !== state.SENT && (
          <Speech
            onTextReceived={handleUserVoiceInput}
            component={COMPONENT}
            receiveRecordState={(recording) => {
              console.log("RECEIVE_RECORD_STATE_CHATBOT", {
                recording,
              });
              setRecording(recording);
            }}
          />
        )}
        {!switchToVoice && renderUserTypeInputBox()}
      </Box>
    );
  };

  return (
    <Box
      data-testid={COMPONENT}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: {
          mobile: "80vh", // Default height for screens less than 1500px
          // tablet: "85vh", // Height for screens 1500px and greater
        },
      }}
    >
      {renderChatBox()}
      <div data-testid={`${COMPONENT}_voice_conversation`}>
        {renderSwitch()}
        {renderUserInputBox()}
      </div>
    </Box>
  );
}
