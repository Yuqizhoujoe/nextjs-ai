import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import _ from "lodash";

interface Options {
  handleResult: any;
}

let synthesizer: sdk.SpeechSynthesizer | null = null;

// The language of the voice that speaks.
// speechConfig.speechSynthesisVoiceName = ""zh-CN-XiaoxiaoNeural"";
// speechConfig.speechSynthesisVoiceName = "wuu-CN-XiaotongNeural";
// speechConfig.speechSynthesisVoiceName = ""zh-CN-sichuan-YunxiNeural"";
// speechConfig.speechSynthesisVoiceName = ""zh-CN-liaoning-XiaobeiNeural"";
// speechConfig.speechSynthesisVoiceName = ""zh-HK-HiuGaaiNeural"";
// speechConfig.speechSynthesisVoiceName = ""zh-CN-shaanxi-XiaoniNeural"";
// speechConfig.speechSynthesisVoiceName = ""zh-CN-XiaoyanNeural"";

// const speechConfig = sdk.SpeechConfig.fromSubscription(
//     process.env.MICROSOFT_SPEECH_KEY,
//     process.env.MICROSOFT_SPEECH_REGION
// );
// speechConfig.speechRecognitionLanguage = ""zh-CN"";
// audio config
// const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

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
export const startSpeechRecognize = (options: Options) => {
  const pushStream = sdk.AudioInputStream.createPushStream();
  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.MICROSOFT_SPEECH_KEY,
    process.env.MICROSOFT_SPEECH_REGION
  );

  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  recognizer.recognizing = (sender, event) => {
    // you might want to handle interim results or display live transcription here
    console.log(`RECOGNIZING: Text=${event.result.text}`);
  };
  recognizer.recognized = (sender, event) => {
    switch (event.result.reason) {
      case sdk.ResultReason.RecognizedSpeech:
        options.handleResult(event.result.text);
        break;
      case sdk.ResultReason.NoMatch:
        console.log("NOMATCH: Speech could not be recognized.");
        break;
      case sdk.ResultReason.Canceled:
        handleSpeechCancel(event.result);
        break;
      default:
    }
  };
  recognizer.startContinuousRecognitionAsync(() => {
    console.log("Recognition started");
  });

  return recognizer;
};

const languageMap = {
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
    "en-US-AIGenerate2Neural",
    "en-US-AndrewNeural",
    "en-US-BlueNeural",
    "en-US-BrianNeural",
    "en-US-EmmaNeural",
    "en-US-JennyMultilingualV2Neural",
    "en-US-RyanMultilingualNeural",
  ],
};
const defaultLanguage = "en-US-JennyNeural";

const mapLanguage = (language: string) => {
  if (_.isEmpty(language)) return defaultLanguage;
  const lan = language.slice(0, 2).toLowerCase();
  const lanArray = languageMap[lan];
  const index = Math.floor(Math.random() * lanArray.length);
  return lanArray[index];
};
// Text to Speech
export const startSpeechSynthesis = (
  text: string,
  language: string,
  options: Options
) => {
  try {
    // speech config
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.MICROSOFT_SPEECH_KEY,
      process.env.MICROSOFT_SPEECH_REGION
    );
    speechConfig.speechSynthesisVoiceName = mapLanguage(language);

    // audio config
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

    console.log("START_SPEECH_SYNTHESIS", {
      text,
      language,
      speechConfig,
      audioConfig,
    });
    synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(text, (result) => {
      switch (result.reason) {
        case ResultReason.SynthesizingAudioCompleted:
          console.log("SYNTHESIS_COMPLETED_RESULT", result);
          options.handleResult(result.audioData);
          break;
        default:
          console.error(`SYNTHESIS_CANCELLED`, result);
      }

      synthesizer.close();
      synthesizer = null;
    });
  } catch (e) {
    console.error("START_SPEECH_SYNTHESIS_ERROR", e);
    synthesizer.close();
    synthesizer = null;
  }
};
