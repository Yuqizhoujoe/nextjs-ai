import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import React, { useEffect, useState } from "react";
import { formatName } from "../../shared/helper";
import useSpeech from "../../shared/hooks/useSpeech";
import { VOICE_TEST_TEXT } from "../../shared/data/constant";

export default function VoiceAssistant({
  countryName,
  voiceKey,
  voice,
  languageCode,
}: {
  countryName: string;
  languageCode: string;
  voiceKey: string;
  voice: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const { useSpeechSynthesisFromMicrosoft } = useSpeech(isPlaying);

  useEffect(() => {
    if (isPlaying) {
      useSpeechSynthesisFromMicrosoft({
        voiceName: voice,
        text: VOICE_TEST_TEXT[languageCode],
      })
        .then()
        .catch()
        .finally(() => setIsPlaying(false));
    }
  }, [isPlaying]);

  return (
    <Card
      data-testid="voice-assistant-card"
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {formatName(voice)}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {countryName}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <IconButton aria-label="play/pause">
            {!isPlaying ? (
              <PlayArrowIcon
                sx={{ height: 38, width: 38 }}
                onClick={() => setIsPlaying(true)}
              />
            ) : (
              <StopCircleIcon
                sx={{ height: 38, width: 38 }}
                onClick={() => setIsPlaying(false)}
              />
            )}
          </IconButton>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 150, height: 154 }}
        image={`/voice-assistants/${voiceKey.toLowerCase()}.png`}
        alt={`Voice Assistants ${countryName.toUpperCase()}`}
      />
    </Card>
  );
}
