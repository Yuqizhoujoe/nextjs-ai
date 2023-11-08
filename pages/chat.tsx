import { Container } from "@mui/material";
import dynamic from "next/dynamic";

const ChatBot = dynamic(() => import("../component/chat/ChatBot"), {
  // ssr: false,
});

/**
 * Chat page: integrate openAI chat API
 *
 * @constructor
 */
export default function Chat() {
  return (
    <Container
      data-testid="chat-page"
      sx={
        {
          // margin: 2,
        }
      }
    >
      <ChatBot />
    </Container>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
