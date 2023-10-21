import React, { useEffect, useRef, useState } from "react";
import ChatBox from "../common/ChatBox";

// react query
import { useMutation } from "@tanstack/react-query";

// utility
import { isEmpty } from "lodash";

// openai
import { handleOpenAIAPI, openAIAPIEnum } from "../../shared/openai/openAI";

// interface
import { Conversation } from "../../shared/data/interface";

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
import CognitiveService from "../common/CognitiveService";
import { startSpeechSynthesis } from "../../shared/microsoft/cognitiveService";

const COMPONENT = "chat_bot_component";

const label = { inputProps: { "aria-label": "switch to voice input" } };

const state = {
  SUCCESS: "success",
  SENT: "sent",
  ERROR: "error",
  NOTHING: "nothing",
};

type Status = (typeof state)[keyof typeof state];

export default function ChatBot() {
  const [userInput, setUserInput] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [switchToVoice, setSwitch] = useState(false);
  const [status, setStatus] = useState<Status>(state.NOTHING);

  // chat box ref
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEmpty(conversations)) {
      handleChatBoxScroll();
    }
  }, [conversations]);

  // react query
  const chatBotMutation = useMutation({
    mutationFn: async (userInput: string) => {
      console.log("chatBotMutation mutationFn");
      setStatus(state.SENT);

      return handleOpenAIAPI({
        type: openAIAPIEnum.CHAT_COMPLETION,
        data: userInput,
        options: {
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
        },
      });
    },
    onSuccess: (result, userInput, context) => {
      console.log("chatBotMutation onSuccess");
      console.log(result);

      setStatus(state.SUCCESS);

      if (switchToVoice)
        startSpeechSynthesis(result, {
          handleResult: (audioData) => {
            // create an instance of BaseAudioPlayer to play the audio
            const audioElement = new Audio();
            audioElement.src = URL.createObjectURL(audioData);
            audioElement.play();
          },
        });
    },
    onError: (error) => {
      console.log("chatBotMutation onError");
      console.error(error);
      setStatus(state.ERROR);
    },
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
    await chatBotMutation.mutate(userInput);
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

  const handleUserVoiceInput = (text: string) => {
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
    chatBotMutation.mutate(text);
  };

  // render
  const renderChatBox = () => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          height: switchToVoice ? "60vh" : "48vh",
          overflow: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        data-testid="chat_bot_chat_box"
        ref={chatBoxRef}
      >
        {conversations.map((conversation, index) => (
          <ChatBox key={index} conversation={conversation} />
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
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
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
        {switchToVoice && (
          <CognitiveService
            onTextReceived={handleUserVoiceInput}
            component={COMPONENT}
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
          xs: "80vh", // Default height for screens less than 1500px
          md: "85vh", // Height for screens 1500px and greater
        },
      }}
    >
      {renderChatBox()}
      <div>
        {renderSwitch()}
        {renderUserInputBox()}
      </div>
    </Box>
  );
}
