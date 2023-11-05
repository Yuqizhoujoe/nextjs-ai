import type { NextApiRequest, NextApiResponse } from "next";
import fs, { promises } from "fs";
import { Configuration, OpenAIApi } from "openai";

type ResponseData = {
  message: string;
  result?: string;
  error?: any;
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    return POST(req, res);
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    // extract the audio data
    const base64Audio = req.body.audio;
    // convert the base64 audio data back to a Buffer
    const audio = Buffer.from(base64Audio, "base64");

    const text = await convertAudioToText(audio);

    return res
      .status(200)
      .json({ result: text, message: "Successfully transcribe audio to text" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed!!", error: err });
  }
}

async function convertAudioToText(audioData) {
  const inputPath = "/tmp/input.webm";
  await promises.writeFile(inputPath, audioData);

  const response = await openai.createTranscription(
    // @ts-ignore
    fs.createReadStream(inputPath),
    "whisper-1"
  );

  const text = response.data.text;
  console.log("OPEN_AI_TRANSCRIPTION_TEXT", { text });

  // delete the temporary files
  await promises.unlink(inputPath);

  return text;
}
