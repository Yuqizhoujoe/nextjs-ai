import {
  Avatar,
  CircularProgress,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { userTypes } from "../../shared/data/constant";
import { grey } from "@mui/material/colors";
import React from "react";
import { Conversation } from "../../shared/data/type";
import { useSession } from "next-auth/react";

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
  component,
  voiceImageKey,
}: {
  conversation: Conversation;
  component: string;
  voiceImageKey?: string;
}) {
  const { data: session } = useSession();
  const { user } = session;

  const isChatBot = conversation.type === userTypes.CHAT_BOT;

  const renderAvatar = (conversation: Conversation) => {
    switch (conversation.type) {
      case userTypes.CHAT_BOT:
        return (
          <Avatar
            variant="circular"
            alt="My logo"
            src={
              voiceImageKey
                ? `/voice-assistants/${voiceImageKey.toLowerCase()}.png`
                : "robot.png"
            }
          >
            {conversation.id}
          </Avatar>
        );
      case userTypes.USER:
      default:
        return (
          <Avatar
            variant="circular"
            alt="My logo"
            src={user && user.image ? user.image : "jojo.png"}
          >
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
        // spacing={2}
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Typography color={isChatBot ? grey[300] : grey[500]}>
          {conversation.date.toLocaleTimeString()}
        </Typography>
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
