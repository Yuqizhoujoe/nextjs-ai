"use client";
import React, { useEffect, useState } from "react";

// mui
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

// next ui
import { Loading } from "@nextui-org/react";

import { useReactMediaRecorder } from "react-media-recorder";
import { openai } from "../../shared/openai/openAI";

type SpeechRecognizerProps = {
  onTextReceived: (text: string) => void;
  component: string;
  receiveRecordState: (recording: boolean) => void;
};

// Speech to Text
const Speech: React.FC<SpeechRecognizerProps> = ({
  onTextReceived,
  component,
  receiveRecordState,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  // const [] = useState();

  const {
    status,
    startRecording: startMediaRecording,
    stopRecording: stopMediaRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    onStart: () => {
      setIsRecording(true);
    },
    onStop: async (blobUrl, blob) => {
      try {
        setIsRecording(false);
        const fileExtension =
          blob && blob.type ? blob.type.split("/")[1] : "mpeg";

        const audioFile = new File([blob], `audio.mpeg`, { type: blob.type });

        const res = await openai.audio.transcriptions.create({
          file: audioFile,
          model: "whisper-1",
        });

        onTextReceived(res && res.text);
      } catch (e) {
        console.error(e);
      }
    },
  });

  useEffect(() => {
    console.log("SPEECH_COMPONENT_REACT_MEDIA", {
      status,
      mediaBlobUrl,
    });
  }, [status]);

  useEffect(() => {
    receiveRecordState(isRecording);
  }, [isRecording]);

  const startRecording = () => {
    startMediaRecording();
  };

  const stopRecording = () => {
    stopMediaRecording();
  };

  const handleVoiceBtnClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
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
          sx={{
            padding: "1rem",
            marginTop: "1rem",
            backgroundColor: `${!isRecording ? "#c9c8c8 !important" : ""}`,
          }}
          onClick={handleVoiceBtnClick}
          data-testid={`${component}_speech_voice_input_button`}
        >
          {isRecording ? (
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

export default Speech;

// 1000 milliseconds = 1 second
// const DIALOG_MAX_LENGTH = 60 * 1000; // 120s
// const VOICE_MIN_DECIBELS = -35;
// const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(null);
// const [audioContext, setAudioContext] = useState<AudioContext>(null);
// const setUpAudioContext = (stream) => {
//   const audioContext = new AudioContext();
//   const analyser = audioContext.createAnalyser();
//   const audioSource = audioContext.createMediaStreamSource(stream);
//   analyser.minDecibels = VOICE_MIN_DECIBELS;
//   audioSource.connect(analyser);
//
//   setAudioContext(audioContext);
//
//   const bufferLength = analyser.frequencyBinCount;
//   const volumeData = new Uint8Array(bufferLength);
//
//   const startTime = new Date().getTime();
//   const detectSound = () => {
//     const currentTime = new Date().getTime();
//
//     if (!isRecording) return;
//
//     // time out
//     if (currentTime > startTime + DIALOG_MAX_LENGTH) {
//       console.log("TIME_OUT");
//       stopRecording();
//       return;
//     }
//
//     analyser.getByteFrequencyData(volumeData);
//     const volume = volumeData.reduce((a, b) => a + b, 0) / volumeData.length;
//
//     // if volume is getting low and start talking for more than 5s
//     if (volume < 0.1 && currentTime > startTime + 5000) {
//       console.log("STOP_RECORDING_BECAUSE_VOLUME_TOO_LOW_OR_TALK_TOO_LONG");
//       stopRecording();
//       return;
//     }
//
//     // request next animation frame
//     requestAnimationFrame(detectSound);
//   };
//
//   requestAnimationFrame(detectSound);
// };

// const setUpMediaRecorder = () => {
//   let chunks = [];
//   navigator.mediaDevices
//     .getUserMedia({ audio: true })
//     .then((stream) => {
//       // build media recorder
//       const newMediaRecorder = new MediaRecorder(stream);
//
//       newMediaRecorder.onstart = () => {
//         chunks = [];
//       };
//       newMediaRecorder.ondataavailable = async (e) => {
//         chunks.push(e.data);
//       };
//       // setUpAudioContext(stream);
//
//       newMediaRecorder.onstop = async () => {
//         try {
//           const audioBlob = new Blob(chunks, { type: "audio/mpeg-3" });
//           console.log("NEW_MEDIA_RECORDER_DATA", { chunks, audioBlob });
//           const reader = new FileReader();
//           reader.readAsDataURL(audioBlob);
//           reader.onloadend = async () => {
//             // @ts-ignore
//             const base64Audio = reader.result.split(",")[1]; // remove data URL prefix
//             const res = await axios.post("/speechToText", {
//               audio: base64Audio,
//               mimeType: audioBlob.type, // send MIME type to the server
//             });
//             const data = await res.data;
//             onTextReceived(data.result);
//           };
//         } catch (err) {
//           console.error(err);
//         }
//       };
//
//       setMediaRecorder(newMediaRecorder);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

// useEffect(() => {
//   if (typeof window !== "undefined") {
//     setUpMediaRecorder();
//   }
//
//   return () => {
//     setAudioContext(null);
//     // setMediaRecorder(null);
//   };
// }, [isRecording]);
