import { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";

const {
  TextAnalysisClient,
  AzureKeyCredential,
} = require("@azure/ai-language-text");

type ResponseData = {
  message: string;
  result?: string;
  error?: any;
};

const apiKey = process.env.MICROSOFT_LANGUAGE_KEY;
const endpoint = process.env.MICRISOFT_LANGUAGE_ENDPOINT;
const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { query } = req;
  const { action } = query;

  if (req.method === "POST") {
    if (action === "detect-language") {
      return detectTextLanguage(req, res);
    }
  }
}

async function detectTextLanguage(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const text = req.body.text || "";

    const documents = [text];
    const result = await client.analyze("LanguageDetection", documents);
    console.log("DETECT_TEXT_LANGUAGE_RESPONSE", JSON.stringify(result));

    const language = _.get(result, "[0].primaryLanguage", {});
    console.log("LANGUAGE_DETECTION", JSON.stringify(language));

    res
      .status(200)
      .json({ message: "DETECT LANGUAGE SUCCESSFUL", result: language });
  } catch (e) {
    console.log(e);
    console.error("DETECT_TEXT_LANGUAGE_RESPONSE_ERROR", JSON.stringify(e));
    res.status(500).json({ message: "DETECT LANGUAGE FAILED", error: e });
  }
}
