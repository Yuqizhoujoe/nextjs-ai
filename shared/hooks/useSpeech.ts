import { useEffect, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { COUNTRY_DATA } from "../data/type";

const DEFAULT_CN_VOICE = "zh-CN-XiaoxiaoNeural";
const DEFAULT_US_VOICE = "en-US-JennyMultilingualNeural";
const DEFAULT_KR_VOICE = "ko-KR-SunHiNeural";
const DEFAULT_JP_VOICE = "ja-JP-NanamiNeural";

const LanVoicesMapping = {
  ko: {
    female: [
      "ko-KR-SunHiNeural",
      "ko-KR-JiMinNeural",
      "ko-KR-SeoHyeonNeural",
      "ko-KR-SoonBokNeural",
    ],
    male: [
      "ko-KR-InJoonNeural",
      "ko-KR-BongJinNeural",
      "ko-KR-GookMinNeural",
      "ko-KR-YuJinNeural",
    ],
  },
  ja: {
    female: [
      "ja-JP-NanamiNeural",
      "ja-JP-AoiNeural",
      "ja-JP-MayuNeural",
      "ja-JP-ShioriNeural",
    ],
    male: ["ja-JP-KeitaNeural", "ja-JP-DaichiNeural", "ja-JP-NaokiNeural"],
  },
  zh: {
    female: [
      "zh-CN-XiaoxiaoNeural",
      "zh-CN-XiaoyiNeural",
      "zh-CN-XiaochenNeural",
      "zh-CN-XiaohanNeural",
      "zh-CN-XiaomengNeural",
      "zh-CN-XiaomoNeural",
      "zh-CN-XiaoqiuNeural",
      "zh-CN-XiaoruiNeural",
      "zh-CN-XiaoshuangNeural",
    ],
    male: ["zh-CN-YunxiNeural", "zh-CN-YunjianNeural", "zh-CN-YunyangNeural"],
  },
  en: {
    female: [
      "en-US-JennyMultilingualNeural",
      "en-US-JennyNeural",
      "en-US-AriaNeural",
      "en-US-AmberNeural",
      "en-US-ElizabethNeural",
      "en-US-JaneNeural",
      "en-US-MichelleNeural",
      "en-US-MonicaNeural",
      "en-US-NancyNeural",
      "en-US-JennyMultilingualV2Neural",
      "en-US-AIGenerate1Neural",
      "en-US-SaraNeural",
      "en-US-EmmaNeural",
    ],
    male: [
      "en-US-GuyNeural",
      "en-US-DavisNeural",
      "en-US-AshleyNeural",
      "en-US-BrandonNeural",
      "en-US-ChristopherNeural",
      "en-US-CoraNeural",
      "en-US-EricNeural",
      "en-US-JacobNeural",
      "en-US-JasonNeural",
      "en-US-RogerNeural",
      "en-US-SteffanNeural",
      "en-US-TonyNeural",
      "en-US-AndrewNeural",
      "en-US-BlueNeural",
      "en-US-BrianNeural",
      "en-US-RyanMultilingualNeural",
    ],
  },
};
const SupportedCountriesData: COUNTRY_DATA[] = [
  {
    countryCode: "us",
    countryName: "USA",
    locale: "en-US",
    language: "en",
  },
  {
    countryCode: "cn",
    countryName: "China",
    locale: "zh-CN",
    language: "zh",
  },
  {
    countryCode: "kr",
    countryName: "Korea",
    locale: "ko-KR",
    language: "ko",
  },
  {
    countryCode: "jp",
    countryName: "Japan",
    locale: "ja-JP",
    language: "ja",
  },
];

const useSpeech = (recording?: boolean) => {
  const [player, setPlayer] = useState<sdk.SpeakerAudioDestination>(null);
  const [synthesizer, setSynthesizer] = useState<sdk.SpeechSynthesizer>(null);

  const stopPlayAudioWhenRecording = () => {
    if (player) {
      player.pause();
    }
  };

  useEffect(() => {
    return () => {
      if (player) {
        player.close();
        setPlayer(null);
      }

      if (synthesizer) {
        setSynthesizer(null);
      }
    };
  }, []);

  useEffect(() => {
    if (recording) {
      stopPlayAudioWhenRecording();
    }
  }, [recording]);

  const useSpeechSynthesisFromMicrosoft = ({
    voiceName,
    text,
  }: {
    voiceName?: string;
    text: string;
  }) => {
    return new Promise((resolve, reject) => {
      try {
        const voice = voiceName ? voiceName : DEFAULT_CN_VOICE;

        console.log("SYNTHESIZER_MEMO", {
          text,
          voice,
        });

        const speaker = new sdk.SpeakerAudioDestination();
        const audioConfig = sdk.AudioConfig.fromSpeakerOutput(speaker);
        setPlayer(speaker);

        const speechConfig = sdk.SpeechConfig.fromSubscription(
          process.env.MICROSOFT_SPEECH_KEY,
          process.env.MICROSOFT_SPEECH_REGION
        );
        speechConfig.speechSynthesisVoiceName = voice;

        const speechSynthesizer = new sdk.SpeechSynthesizer(
          speechConfig,
          audioConfig
        );
        setSynthesizer(speechSynthesizer);

        speechSynthesizer.speakTextAsync(text, (result) => {
          switch (result.reason) {
            case ResultReason.SynthesizingAudioCompleted:
              console.log("SYNTHESIS_COMPLETED_RESULT", result);
              resolve(result.audioData);
              break;
            default:
              console.error(`SYNTHESIS_CANCELLED`, result);
              reject(result);
          }

          speechSynthesizer.close();
        });
      } catch (e) {
        console.error("USE_SPEECH_SYNTHESIS_FROM_MICROSOFT_ERROR", e);
        reject(e);
      }
    });
  };

  return {
    LanVoicesMapping,
    SupportedCountriesData,
    useSpeechSynthesisFromMicrosoft,
  };
};
export default useSpeech;
