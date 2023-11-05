import { useEffect, useState } from "react";
import _ from "lodash";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";

const defaultLanguage = "en-US-JennyNeural";
const languageMap = {
  ko: [
    "ko-KR-SunHiNeural",
    "ko-KR-InJoonNeural",
    "ko-KR-BongJinNeural",
    "ko-KR-GookMinNeural",
    "ko-KR-JiMinNeural",
    "ko-KR-SeoHyeonNeural",
    "ko-KR-SoonBokNeural",
    "ko-KR-YuJinNeural",
  ],
  ja: [
    "ja-JP-NanamiNeural",
    "ja-JP-KeitaNeural",
    "ja-JP-AoiNeural",
    "ja-JP-DaichiNeural",
    "ja-JP-MayuNeural",
    "ja-JP-NaokiNeural",
    "ja-JP-ShioriNeural",
  ],
  zh: [
    "zh-CN-XiaoxiaoNeural",
    "zh-CN-YunxiNeural",
    "zh-CN-YunjianNeural",
    "zh-CN-XiaoyiNeural",
    "zh-CN-YunyangNeural",
    "zh-CN-XiaochenNeural",
    "zh-CN-XiaohanNeural",
    "zh-CN-XiaomengNeural",
    "zh-CN-XiaomoNeural",
    "zh-CN-XiaoqiuNeural",
    "zh-CN-XiaoruiNeural",
    "zh-CN-XiaoshuangNeural",
  ],
  en: [
    "en-US-JennyMultilingualNeural",
    "en-US-JennyNeural",
    "en-US-GuyNeural",
    "en-US-AriaNeural",
    "en-US-DavisNeural",
    "en-US-AmberNeural",
    "en-US-AnaNeural",
    "en-US-AshleyNeural",
    "en-US-BrandonNeural",
    "en-US-ChristopherNeural",
    "en-US-CoraNeural",
    "en-US-ElizabethNeural",
    "en-US-EricNeural",
    "en-US-JacobNeural",
    "en-US-JaneNeural",
    "en-US-JasonNeural",
    "en-US-MichelleNeural",
    "en-US-MonicaNeural",
    "en-US-NancyNeural",
    "en-US-RogerNeural",
    "en-US-SaraNeural",
    "en-US-SteffanNeural",
    "en-US-TonyNeural",
    "en-US-AIGenerate1Neural",
    "en-US-AndrewNeural",
    "en-US-BlueNeural",
    "en-US-BrianNeural",
    "en-US-EmmaNeural",
    "en-US-JennyMultilingualV2Neural",
    "en-US-RyanMultilingualNeural",
  ],
};

const useSpeech = (recording?: boolean, voiceOption?: string) => {
  const [voice, setVoice] = useState<string>(defaultLanguage);
  const [text, setText] = useState<string>("");
  const [player, setPlayer] = useState<sdk.SpeakerAudioDestination>(null);
  const [synthesizer, setSynthesizer] = useState<sdk.SpeechSynthesizer>(null);

  const mapLanguage = (language?: string) => {
    if (_.isEmpty(language)) return defaultLanguage;
    const lan = language.toLowerCase();
    const lanArray = languageMap[lan];
    const index = Math.floor(Math.random() * lanArray.length);
    return lanArray[index];
  };

  useEffect(() => {
    return () => {
      setVoice("");

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
    stopPlayAudioWhenRecording();
  }, [recording]);

  useEffect(() => {
    if (voiceOption !== voice) {
      stopPlayAudioWhenRecording();
      useSpeechSynthesisFromMicrosoft({ text }).then(() => {
        console.log("SYNTHESIZING_AFTEQR_CHANGE_VOICE");
      });
    }
  }, [voiceOption]);

  const stopPlayAudioWhenRecording = () => {
    console.log("STOP_PLAYING_AUDIO", {
      player,
    });

    if (player) {
      player.pause();
    }
  };

  const useSpeechSynthesisFromMicrosoft = ({
    language,
    text,
  }: {
    language?: string;
    text: string;
  }) => {
    return new Promise((resolve, reject) => {
      try {
        const voice = voiceOption || mapLanguage(language);

        console.log("SYNTHESIZER_MEMO", {
          text,
          voice,
        });

        setText(text);
        setVoice(voice);

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
    languageMap,
    defaultVoice: voice,
    useSpeechSynthesisFromMicrosoft,
  };
};
export default useSpeech;
