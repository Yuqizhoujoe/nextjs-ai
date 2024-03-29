import type { NextApiRequest, NextApiResponse } from "next";
import fs, { promises } from "fs";
import { fileTypeFromStream } from "file-type";
import OpenAI from "openai";

type ResponseData = {
  message: string;
  result?: string;
  error?: any;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const { audio } = req.body;
    // convert the base64 audio data back to a Buffer
    // const audio = Buffer.from(base64Audio, "base64");

    console.log("POST_SPEECH_TO_TEXT_PARAMS", {
      audio,
    });

    const response = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
    });

    const text = response.text;
    console.log("OPEN_AI_TRANSCRIPTION_TEXT", { text });

    // const text = await convertAudioToText(audio);

    return res
      .status(200)
      .json({ result: text, message: "Successfully transcribe audio to text" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed!!", error: err });
  }
}

async function convertAudioToText(audioData: Buffer) {
  const inputPath = "/tmp/input.mp3";
  await promises.writeFile(inputPath, audioData);

  // const eligibleAudioFile = await checkAudioFile(inputPath);

  const audioStreamInput = fs.createReadStream(inputPath);
  const type = await fileTypeFromStream(audioStreamInput);

  console.log("OPEN_AI_TRANSCRIPTION_PARAMS", {
    type,
  });

  const response = await openai.audio.transcriptions.create({
    file: audioStreamInput,
    model: "whisper-1",
  });

  const text = response.text;
  console.log("OPEN_AI_TRANSCRIPTION_TEXT", { text });

  // delete the temporary files
  await promises.unlink(inputPath);

  return text;
}

async function checkAudioFile(filePath: string) {
  try {
    // Check if file exists
    // The stat() function returns a stat object, which contains information about the file, such as the size, permissions, and modification time.
    const stats = await promises.stat(filePath);

    console.log("FILE_INFO", { fileInfo: stats });

    // Check if file is not empty (size greater than 0)
    if (stats.size > 0) {
      console.log("FILE_EXIST_AND_NOT_EMPTY");
      return true;
    } else {
      console.error("FILE_EXIST_BUT_EMPTY");
      throw new Error("FILE_EXIST_BUT_EMPTY");
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      // File does not exist
      console.error("FILE_NOT_EXIST", { error });
    } else {
      // Other errors
      console.error("OTHER_FILE_ERROR", { error });
    }

    throw error;
  }
}
