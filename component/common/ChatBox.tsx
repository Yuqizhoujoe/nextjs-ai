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
import { Conversation } from "../../shared/data/interface";

const ChatBoxItem = styled(Paper)(({ theme }) => {
  return {
    // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.subtitle1,
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    // color: theme.palette.text.disabled,
    borderRadius: theme.spacing(1),
  };
});

export default function ChatBox({
  conversation,
}: {
  conversation: Conversation;
}) {
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

  return (
    <ChatBoxItem
      key={conversation.id}
      sx={{
        backgroundColor:
          conversation.type === userTypes.CHAT_BOT ? "#ada3ad" : "#8ca1b4",
      }}
    >
      <Typography color={grey[200]}>
        {conversation.date.toLocaleTimeString()}
      </Typography>
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
