import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { OpenAI } from "openai";
config();

const app = express();
app.use(express.json());
app.use(cors());

console.log(process.env.API_KEY);

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

app.post("/chat", async (req, res) => {
  const question = req.body.text;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: question }],
  });
  console.log(response.choices[0].message.content);
  res.json(response.choices[0].message.content);
  //res.json(todo);
});

app.listen(3001, () => console.log("Server started on server 3001"));
