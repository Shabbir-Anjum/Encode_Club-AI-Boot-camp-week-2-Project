import { NextResponse } from 'next/server';
import Groq from "groq-sdk";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create a Groq client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Ask Groq for a streaming chat completion given the prompt
    const response = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      stream: true,
      messages,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in generate API:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while generating the joke.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}