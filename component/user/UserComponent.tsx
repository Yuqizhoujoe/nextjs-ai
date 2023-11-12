// @ts-nocheck
import React from "react";
// type || interface
import { User } from "../../shared/data/type";

// MUI
import { Box, Divider, Grid } from "@mui/material";

// shared
import { useAppContext } from "../../shared/context";

// component
import CountryLanguageDropdown from "./CountryLanguageDropdown";
import VoiceAssistant from "./VoiceAssistant";

export default function UserComponent({ user }: { user: User }) {
  const { voiceData } = useAppContext();

  const renderSelectedVoiceAssistant = () => {
    if (!voiceData) return null;
    return (
      <Box
        data-testid="voice-assistants-box"
        sx={{
          marginBottom: "3rem",
        }}
      >
        <Grid
          container
          data-testid="voice-assistants-grid-container"
          sx={{
            gap: 2,
          }}
        >
          {Object.entries(voiceData).map(([key, voiceCountryData]) => {
            const { voice, countryName, language } = voiceCountryData;
            return (
              <Grid
                mobile={12}
                tablet={6}
                laptop={4}
                item
                sx={{
                  justifyContent: "space-between",
                  width: 250,
                  height: 150, // Height is always 150px
                }}
              >
                <VoiceAssistant
                  voiceKey={key}
                  countryName={countryName}
                  languageCode={language}
                  voice={voice}
                />
              </Grid>
            );
          })}
        </Grid>
        <Divider sx={{ marginTop: 5 }} />
      </Box>
    );
  };

  return (
    <Box
      data-testid="user-component"
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {renderSelectedVoiceAssistant()}
      <CountryLanguageDropdown />
    </Box>
  );
}
