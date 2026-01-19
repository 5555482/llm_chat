import { OpenAI } from "openai";

const apiKey = import.meta.env.VITE_HF_TOKEN;
const model = "allenai/Olmo-3.1-32B-Instruct:publicai";

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  dangerouslyAllowBrowser: true,
  apiKey,
});


export async function makeQuery(query: string) {
  const stream = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: query,
      },
    ],
    stream: true,
  });
  return stream
}

