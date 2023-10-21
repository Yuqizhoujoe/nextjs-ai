import { Box } from "@mui/material";
import { useState } from "react";

// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
// @ts-ignore
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  // @ts-ignore
  window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const colors = [
  "aqua",
  "azure",
  "beige",
  "bisque",
  "black",
  "blue",
  "brown",
  "chocolate",
  "coral" /* … */,
];
const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(
  " | "
)};`;

const TranslationComponent = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const handleSpeechRecognition = async () => {
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 2;
    recognition.lang = "zh-CN";

    recognition.onresult = (event) => {
      console.log(event);
      const { transcript } = event.results[0][0];
      setText(transcript);
      // translateText(transcript);
    };

    recognition.start();
  };

  // const translateText = async (text: string) => {
  //   const openai = createTranslation({
  //     apiKey: process.env.OPENAI_API_KEY,
  //   });
  //
  //   try {
  //     const response = await openai.translate({
  //       text,
  //       target: "es",
  //     });
  //     setTranslatedText(response.data.translations[0].text);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <Box>
      <div>
        <button onClick={handleSpeechRecognition}>Start speaking</button>
      </div>
      <div>
        <p>Original text:</p>
        <p>{text}</p>
      </div>
      <div>
        <p>Translated text:</p>
        <p>{translatedText}</p>
      </div>
    </Box>
  );
};

export default TranslationComponent;
