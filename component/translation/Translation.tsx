import React, { useEffect, useRef, useState } from "react";

// component
// mui
import { Box } from "@mui/material";

// next ui
import { Card, styled, Text } from "@nextui-org/react";

// openai
// utility
import { isEmpty } from "lodash";

// constant
import { userTypes } from "../../shared/data/constant";
// interface
import { Conversation } from "../../shared/data/type";

const COMPONENT_NAME = "translation_component";

export default function Translation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const translationBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEmpty(conversations)) {
      handleChatBoxScroll();
    }
  }, [conversations]);

  const handleChatBoxScroll = () => {
    translationBoxRef.current.scrollTo({
      top: translationBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // const translateVoiceMutation = useMutation({
  //   mutationFn: async (userVoiceInput: string) => {
  //     console.log("translateVoiceMutation mutationFn");
  //     return handleOpenAIAPI({
  //       type: openAIAPIEnum.TRANSLATE_VOICE,
  //       data: userVoiceInput,
  //       options: {
  //         addItem: () =>
  //           setConversations((prevState) => {
  //             return [
  //               ...prevState,
  //               {
  //                 id: prevState.length + 1,
  //                 date: new Date(),
  //                 type: userTypes.CHAT_BOT,
  //                 content: "",
  //                 loading: true,
  //               },
  //             ];
  //           }),
  //         handleResult: (value) =>
  //           setConversations((prevState) => {
  //             const lastConversation = prevState[prevState.length - 1];
  //             prevState[prevState.length - 1] = {
  //               ...lastConversation,
  //               content: `${lastConversation.content}${value}`,
  //               loading: false,
  //             };
  //             // don't return prevState
  //             // return [...prevState]
  //             return [...prevState];
  //           }),
  //         voiceInput: true,
  //       },
  //     });
  //   },
  //   onSuccess: async (result, userInput, context) => {
  //     console.log("translateVoiceMutation onSuccess");
  //     console.log(result);
  //   },
  // });

  const handleTextReceive = async (userVoiceInput: string) => {
    setConversations((prevState) => {
      return [
        ...prevState,
        {
          id: prevState.length + 1,
          date: new Date(),
          type: userTypes.USER,
          content: userVoiceInput,
        },
      ];
    });

    //TODO: translate the text
    // await translateVoiceMutation.mutate(userVoiceInput);
  };

  const CardItem = ({
    text,
    type,
  }: {
    text: string;
    type?: (typeof userTypes)[keyof typeof userTypes];
  }) => {
    const StyledCard = styled(Card, {
      backgroundColor: type === userTypes.USER ? "#0072F5" : "#00254D",
      border: "none",
    });

    switch (type) {
      case userTypes.USER:
        return (
          <StyledCard>
            <Card.Body>
              <Text
                h6
                size={15}
                css={{ color: "white" }}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </Card.Body>
          </StyledCard>
        );
      case userTypes.CHAT_BOT:
      default:
        return (
          <StyledCard>
            <Card.Body>
              <Text
                h6
                size={15}
                css={{ color: "white" }}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </Card.Body>
          </StyledCard>
        );
    }
  };

  // const renderTranslationBoxContainer = () => {
  //   return (
  //     <Stack
  //       spacing={2}
  //       ref={translationBoxRef}
  //       sx={{
  //         width: "100%",
  //         height: "70vh",
  //         // flexGrow: 1,
  //         overflow: "scroll",
  //         "&::-webkit-scrollbar": {
  //           display: "none",
  //         },
  //       }}
  //       data-testid={`${COMPONENT_NAME}_translation_box`}
  //     >
  //       {conversations.map((conversation) => {
  //         return <ChatBox conversation={conversation} key={conversation.id} />;
  //       })}
  //     </Stack>
  //   );
  // };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: {
          md: "80vh", // Default height for screens less than 1500px
          lg: "95vh", // Height for screens 1500px and greater
        },
        padding: 2,
      }}
      data-testid={COMPONENT_NAME}
    >
      {/*{renderTranslationBoxContainer()}*/}
      {/*<Speech onTextReceived={handleTextReceive} component={COMPONENT_NAME} />*/}
    </Box>
  );
}
