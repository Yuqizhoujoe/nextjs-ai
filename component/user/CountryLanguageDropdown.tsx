import React, { useState } from "react"; // MUI
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import useSpeech from "../../shared/hooks/useSpeech";
import { COUNTRY_DATA } from "../../shared/data/type";
import { Loading } from "@nextui-org/react";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import IconButton from "@mui/material/IconButton";
import { useAppContext } from "../../shared/context";
import { VOICE_TEST_TEXT } from "../../shared/data/constant";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CountryLanguageDropdown({}: {}) {
  const {
    SupportedCountriesData,
    LanVoicesMapping,
    useSpeechSynthesisFromMicrosoft,
  } = useSpeech();

  const { addVoice } = useAppContext();

  const [countryData, setCountryData] = useState<COUNTRY_DATA>(undefined);
  const [voice, setVoice] = useState<string>(undefined);
  const [gender, setGender] = useState<string>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCountrySelectionChange = (event: SelectChangeEvent<string>) => {
    const code = event.target.value;
    setVoice(undefined);
    setGender(undefined);
    const selected = SupportedCountriesData.find(
      (country) => country.countryCode === code
    );
    setCountryData(selected);
  };

  const handleVoiceSelect = (event: SelectChangeEvent<typeof voice>) => {
    const value = event.target.value;
    setVoice(value);
  };

  const handleAudioPlay = async () => {
    try {
      setIsPlaying(true);
      const { language } = countryData;
      await useSpeechSynthesisFromMicrosoft({
        voiceName: voice,
        text: VOICE_TEST_TEXT[language],
      });
      setIsPlaying(false);
    } catch (e) {
      setIsPlaying(false);
    }
  };

  const renderAudioPlay = () => {
    return (
      <IconButton
        color="primary"
        aria-label="voice"
        onClick={handleAudioPlay}
        data-testid={`user_component_audio_play_button`}
      >
        {isPlaying ? (
          <Loading type="points" />
        ) : (
          <KeyboardVoiceIcon fontSize="large" />
        )}
      </IconButton>
    );
  };

  const renderCountrySelection = () => {
    return (
      <FormControl
        id="countries-dropdown-form-control"
        data-testid="countries-dropdown-form-control"
        sx={{
          m: 1,
          width: 200,
        }}
      >
        <InputLabel id="countries-dropdown-label">Country</InputLabel>
        <Select
          labelId="countries-dropdown"
          id="countries-dropdown"
          label="Country"
          value={countryData && countryData.countryCode}
          onChange={handleCountrySelectionChange}
          renderValue={(countryCode) => {
            return (
              SupportedCountriesData.find(
                (country) => country.countryCode === countryCode
              ).countryName || ""
            );
          }}
          MenuProps={MenuProps}
        >
          {SupportedCountriesData.map((country) => {
            return (
              // @ts-ignore
              <MenuItem key={country.countryCode} value={country.countryCode}>
                <ListItemText primary={country.countryName} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  const renderGenderSelection = () => {
    if (countryData) {
      return (
        <FormControl
          id="gender-dropdown-form-control"
          data-testid="gender-dropdown-form-control"
          sx={{
            m: 1,
            width: 200,
          }}
        >
          <InputLabel id="gender-dropdown-label">Gender</InputLabel>
          <Select
            labelId="gender-dropdown"
            id="gender-dropdown"
            label="Gender"
            value={gender || ""}
            onChange={(event) => setGender(event.target.value)}
          >
            <MenuItem key="male" value="male">
              Male
            </MenuItem>
            <MenuItem key="female" value="female">
              Female
            </MenuItem>
          </Select>
        </FormControl>
      );
    }
  };

  const renderVoiceSelection = () => {
    if (countryData && countryData.language && gender) {
      return (
        <FormControl
          id="voices-dropdown-form-control"
          data-testid="voices-dropdown-form-control"
          sx={{
            m: 1,
            width: 200,
          }}
        >
          <InputLabel id="voices-dropdown-label">Voices</InputLabel>
          <Select
            labelId="voices-dropdown"
            id="voices-dropdown"
            placeholder="Choose a voice"
            label="Voice"
            value={voice || ""}
            onChange={handleVoiceSelect}
            MenuProps={MenuProps}
            sx={
              {
                // height: "65px",
              }
            }
          >
            {LanVoicesMapping[countryData.language][gender].map((voice) => {
              return (
                // @ts-ignore
                <MenuItem key={voice} value={voice}>
                  <ListItemText primary={voice.slice(6)} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
    }

    return null;
  };

  const handleSubmitBtnClick = () => {
    if (countryData && voice && gender) {
      addVoice(countryData, voice, gender);
    }
  };

  const renderSubmitBtn = () => {
    if (voice) {
      return (
        <Button variant="contained" onClick={handleSubmitBtnClick}>
          Add
        </Button>
      );
    }

    return null;
  };

  return (
    <Box
      data-testid="country-language-dropdown-container"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Alert severity="info">Choose country and voice below</Alert>
      <Paper
        elevation={1}
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          flexDirection: {
            mobile: "column",
            laptop: "row",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              mobile: "column",
              laptop: "row",
            },
            alignItems: "center",
            gap: 2,
          }}
        >
          {renderCountrySelection()}
          {renderGenderSelection()}
          {renderVoiceSelection()}
          {voice && renderAudioPlay()}
        </Box>
        {renderSubmitBtn()}
      </Paper>
    </Box>
  );
}
