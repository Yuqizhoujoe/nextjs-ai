import {
  Avatar,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { userTypes } from "../../shared/data/constant";
import { grey } from "@mui/material/colors";
import React, { useState } from "react";
import { Conversation } from "../../shared/data/interface";

const ChatBoxItem = styled(Paper)(({ theme }) => {
  return {
    // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.subtitle1,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    // color: theme.palette.text.disabled,
    borderRadius: theme.spacing(1),
  };
});

export default function ChatBox({
  conversation,
  voices,
  component,
  defaultVoice,
  changeVoice,
}: {
  conversation: Conversation;
  voices: string[];
  defaultVoice: string;
  component: string;
  changeVoice: (voice: string) => void;
}) {
  console.log("CHAT_BOX_PROPS", {
    conversation,
    voices,
    component,
    defaultVoice,
  });
  const [language, setLanguage] = useState<string>(defaultVoice);
  const [voiceOptions] = useState<string[]>(voices);

  const isChatBot = conversation.type === userTypes.CHAT_BOT;

  const renderAvatar = (conversation: Conversation) => {
    switch (conversation.type) {
      case userTypes.CHAT_BOT:
        return (
          <Avatar variant="circular" alt="My logo" src="/robot.png">
            {conversation.id}
          </Avatar>
        );
      case userTypes.USER:
      default:
        return (
          <Avatar variant="circular" alt="My logo" src="/my_logo.jpeg">
            {conversation.id}
          </Avatar>
        );
    }
  };

  const renderLoading = (conversation: Conversation) => {
    if (conversation.loading && conversation.type === userTypes.CHAT_BOT) {
      return (
        <div className="ml-2">
          <CircularProgress size={20} />
        </div>
      );
    }
    return null;
  };

  const handleDropdownChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setLanguage(value);
    changeVoice(value);
  };

  const renderLanguageDropdown = () => {
    console.log(`${component.toUpperCase()}_RENDER_DROPDOWN`, {
      defaultVoice,
      voices,
    });
    const labelId = `${component.toUpperCase()}_CHAT_BOX_DROPDOWN_LABEL`;
    return (
      <FormControl variant="standard">
        <InputLabel id={labelId}>Voice</InputLabel>
        <Select
          labelId={labelId}
          id={`${component.toUpperCase()}_CHAT_BOX_DROPDOWN`}
          value={language}
          onChange={handleDropdownChange}
          label="Language"
        >
          {voiceOptions.map((voice) => (
            <MenuItem key={voice} value={voice}>
              {voice.slice(6)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <ChatBoxItem
      key={conversation.id}
      sx={{
        backgroundColor: isChatBot ? "#90898a" : "#d3e1ed",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Typography color={isChatBot ? grey[300] : grey[500]}>
          {conversation.date.toLocaleTimeString()}
        </Typography>
        {isChatBot && renderLanguageDropdown()}
      </Stack>
      <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
        {renderAvatar(conversation)}
        {renderLoading(conversation)}
        <Typography
          dangerouslySetInnerHTML={{ __html: conversation.content }}
        />
      </Stack>
    </ChatBoxItem>
  );
}
