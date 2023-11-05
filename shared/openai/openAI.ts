// const { Configuration, OpenAIApi } = require("openai");
// openAI
import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateImageRequestResponseFormatEnum,
  CreateImageRequestSizeEnum,
  OpenAIApi,
} from "openai";

// utility
import _ from "lodash";

// error
import createHttpError from "http-errors";

// stream
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const openAIAPIEnum = {
  CHAT_COMPLETION: "chat_completion",
  GENERATE_IMAGE: "generate_image",
  TRANSLATE_VOICE: "translate_voice",
};

type openAIAPIFeatures = (typeof openAIAPIEnum)[keyof typeof openAIAPIEnum];

interface Options {
  addItem: any;
  handleResult: any;
  voiceInput: boolean;
}

function breakLines(text: string): string {
  return text.replace(/。|:/g, `${text}<br>`);
}

async function getChatComplete(prompt: string, options: Options) {
  const messages: ChatCompletionRequestMessage[] = [
    { role: "user", content: prompt },
  ];

  const completions = await openai.createChatCompletion({
    model: "gpt-4",
    messages,
    stream: !options.voiceInput,
  });

  console.log("GET_CHAT_COMPLETE_OPENAI_RESULT", completions);

  return completions;
}

async function* readChatCompleteStreamData(completions) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const stream = new ReadableStream({
    async start(controller) {
      const createChatCompletionParser = (
        event: ParsedEvent | ReconnectInterval
      ) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const content = _.get(json, "choices[0].delta.content", "");
            // if \n\n do nothing
            // const lineBreaks = content.match(/\n/g) || [];
            // if (counter < 2 && lineBreaks.length) return;
            // const encodeContent = encoder.encode(content);
            controller.enqueue(content);
          } catch (e) {
            controller.error(e);
          }
        }
      };
      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke event for each SSE event stream
      const parser = createParser(createChatCompletionParser);

      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of completions.data as any) {
        // parser.feed(typeof chunk === "string" ? chunk : decoder.decode(chunk));
        parser.feed(chunk);
      }
    },
  });

  const reader = await stream.getReader();
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    // const content = decoder.decode(value);
    yield value ? breakLines(value) : value;
    // if (content === "。") {
    //   yield `${content}<br>`;
    // } else {
    //   yield content;
    // }
  }
}

export async function getChatResponse(prompt: string, options: Options) {
  console.log("GET_CHAT_RESPONSE_PROMPT", prompt);

  // add one more chat box
  options.addItem();

  const completions = await getChatComplete(prompt, options);

  // get the data directly
  if (options.voiceInput) {
    const content = _.get(completions, "data.choices[0].message.content");
    options.handleResult(content);
    return content;
  }

  // read the stream data
  const generator = await readChatCompleteStreamData(completions);
  const delay = 100;
  const interval = setInterval(async () => {
    const { done, value } = await generator.next();

    if (done) {
      clearInterval(interval);
      return;
    }

    if (value) {
      options.handleResult(value);
    }
  }, delay);
  return generator;
}

export async function getImageResponse(prompt: string) {
  console.log("Sending request to OpenAI getImageResponse:", prompt);
  console.log(configuration);
  console.log(openai);

  const request = {
    size: CreateImageRequestSizeEnum._512x512,
    response_format: CreateImageRequestResponseFormatEnum.Url,
    n: 6,
    prompt,
  };

  const imageResponse = await openai.createImage(request);
  console.log(imageResponse);

  const imageData = imageResponse.data.data.map((image) => {
    return image.url;
  });

  console.log(`getImageResponse ${imageData}`);
  return imageData;
}

export async function getTranslation(userVoiceInput: string, options: Options) {
  const prompt = `translate ${userVoiceInput} to English`;
  return getChatResponse(prompt, options);
}

export const handleOpenAIAPI = async (params: {
  type: openAIAPIFeatures;
  data: any;
  options?: Options;
}) => {
  try {
    const { type, data, options } = params;

    switch (type) {
      case openAIAPIEnum.GENERATE_IMAGE:
        return getImageResponse(data);
      case openAIAPIEnum.CHAT_COMPLETION:
        return getChatResponse(data, options);
      case openAIAPIEnum.TRANSLATE_VOICE:
        return getTranslation(data, options);
      default:
        throw new createHttpError.NotFound(`${type} feature is not found...`);
    }
  } catch (e) {
    console.error("Error from OpenAI:", e);
    throw e;
  }
};

// export const handleOpenAIAsyncGenrator = async (params: {
//   type: openAIAPIFeatures;
//   data: any;
// }) => {
//   try {
//     const { type, data } = params;
//
//     switch (type) {
//       case openAIAPIEnum.CHAT_COMPLETION:
//         return getChatResponse(data);
//       case openAIAPIEnum.TRANSLATE_VOICE:
//         return getTranslation(data);
//       default:
//         throw new createHttpError.NotFound(`${type} feature is not found...`);
//     }
//   } catch (e) {
//     console.error("Error from OpenAI:", e);
//     throw e;
//   }
// };
