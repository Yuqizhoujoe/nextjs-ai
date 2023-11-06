import axios from "./axios";

export async function speechToText(audioData) {
  return axios.post("/speech", audioData).then((res) => res.data);
}
