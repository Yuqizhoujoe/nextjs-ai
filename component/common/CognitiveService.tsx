import React, { useEffect, useState } from "react";

// microsoft
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

// mui
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

// next ui
import { Loading } from "@nextui-org/react";

interface SpeechRecognizerProps {
  onTextReceived: (text: string) => void;
  component: string;
}

const CognitiveService: React.FC<SpeechRecognizerProps> = ({
  onTextReceived,
  component,
}) => {
  const [isListening, setIsListening] = useState(false);

  // Microsoft service instance
  let recognizer: sdk.SpeechRecognizer | null = null;

  useEffect(() => {
    return () => {
      recognizer = null;
    };
  }, []);

  // handler
  const handleSpeechCancel = (result: sdk.SpeechRecognitionResult) => {
    const cancellation = sdk.CancellationDetails.fromResult(result);
    console.log(`CANCELED: Reason=${cancellation.reason}`);

    if (cancellation.reason == sdk.CancellationReason.Error) {
      console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
      console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
      console.log(
        "CANCELED: Did you set the speech resource key and region values?"
      );
    }
  };

  const handleSpeechButtonClick = (e: any) => {
    e.preventDefault();

    if (isListening) {
      stopRecognition();
    } else {
      startSpeechRecognition();
      setIsListening(true);
    }
  };

  const startSpeechRecognition = () => {
    try {
      // speech config
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env.MICROSOFT_SPEECH_KEY,
        process.env.MICROSOFT_SPEECH_REGION
      );
      speechConfig.speechRecognitionLanguage = "zh-CN";

      // audio config
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

      recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      recognizer.recognizeOnceAsync((result: sdk.SpeechRecognitionResult) => {
        switch (result.reason) {
          case sdk.ResultReason.RecognizedSpeech:
            onTextReceived(result.text);
            break;
          case sdk.ResultReason.NoMatch:
            console.log("NOMATCH: Speech could not be recognized.");
            break;
          case sdk.ResultReason.Canceled:
            handleSpeechCancel(result);
            break;
          default:
        }

        setIsListening(false);
        recognizer.close();
        recognizer = null;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognition = () => {
    if (recognizer) {
      recognizer.close();
      recognizer = null;
    }

    setIsListening(false);
  };

  const renderVoiceInput = () => {
    return (
      <Box
        data-testid={`${component}_speech_voice_input_button_container`}
        sx={{ textAlign: "center" }}
      >
        <IconButton
          color="primary"
          size="large"
          aria-label="voice"
          onClick={handleSpeechButtonClick}
          data-testid={`${component}_speech_voice_input_button`}
        >
          {isListening ? (
            <Loading type="points" />
          ) : (
            <KeyboardVoiceIcon fontSize="large" />
          )}
        </IconButton>
      </Box>
    );
  };

  return (
    <Box data-testid={`${component}_speech_recognizer`} sx={{}}>
      {renderVoiceInput()}
    </Box>
  );
};

export default CognitiveService;
