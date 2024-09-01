"use client";
import React, { useState } from "react";
import { useChat } from "ai/react";
import { Button } from "@/app/Components/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/Components/Card";
import { Label } from "@/app/Components/Label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/Components/Select";
import { Slider } from "@/app/Components/Slider";

export default function JokeGenerator() {
  const { messages, append, isLoading, setMessages } = useChat({
    sendExtraMessageFields: true,
  });
  const {
    messages: evaluationMessages,
    append: appendEvaluation,
    isLoading: isEvaluating,
  } = useChat();
  const [topic, setTopic] = useState("work");
  const [tone, setTone] = useState("witty");
  const [type, setType] = useState("pun");
  const [temperature, setTemperature] = useState(0.5);
  const [promptVersion, setPromptVersion] = useState("standard");
  const [evaluation, setEvaluation] = useState("");

  const topicOptions = [
    "work",
    "people",
    "animals",
    "food",
    "television",
    "science fiction",
    "spouses",
    "the military",
    "money",
  ];
  const toneOptions = [
    "child like",
    "absurd",
    "witty",
    "satire",
    "sarcastic",
    "silly",
    "dark",
    "goofy",
  ];
  const typeOptions = [
    "pun",
    "why did the chicken cross the road",
    "walk into a bar",
    "dad",
    "yo mama",
    "knock-knock",
    "story",
    "limerick",
  ];
  const promptOptions = [
    {
      value: "standard",
      label: "Standard",
      template: "Generate a {type} joke about {topic} with a {tone} tone.",
    },
    {
      value: "detailed",
      label: "Detailed",
      template:
        "Create a {type} joke on the subject of {topic}. The joke should have a {tone} tone and be suitable for a general audience.",
    },
    {
      value: "creative",
      label: "Creative",
      template:
        "Imagine you're a comedian specializing in {type} jokes. Craft a {tone} joke about {topic} that would be the highlight of your stand-up routine.",
    },
    {
      value: "short",
      label: "Short",
      template: "Quick {type} joke: {topic}, {tone} style. Go!",
    },
    {
      value: "expert",
      label: "Expert",
      template:
        "As a comedy writer with 20 years of experience, create a {type} joke about {topic} that exemplifies the {tone} style of humor.",
    },
  ];

  const generateJoke = async () => {
    setMessages([]); // Clear previous messages
    setEvaluation(""); // Clear previous evaluation
    const selectedPrompt = promptOptions.find((p) => p.value === promptVersion);
    const prompt = selectedPrompt.template
      .replace("{type}", type)
      .replace("{topic}", topic)
      .replace("{tone}", tone);
    messages.length = 0;
    evaluationMessages.length = 0;
    await append({
      role: "user",
      content: prompt,
      data: { temperature },
    });
  };

  const evaluateJoke = async () => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant"
    ) {
      const joke = messages[messages.length - 1].content;
      const evaluationPrompt = `
        Evaluate the following joke based on these criteria:
        1. Humor: Is it funny or boring?
        2. Appropriateness: Is it appropriate or offensive?
        3. Relatability: Is it relatable or obscure?
        4. Originality: Is it original or familiar?

        Firstly, Present table of ratings for each criterion from 1 to 10 and an average of all ratings in the bottom row. 
        Secondly, Provide a brief explanation of evaluation for each criterion.
        In the end, Briefly summarize your evaluation.

        Use markdown to format the text.

        Joke to evaluate:
        "${joke}"
      `;
      evaluationMessages.length = 0;
      await appendEvaluation({
        role: "user",
        content: evaluationPrompt,
      });
    }
  };

  const randomizeSelections = () => {
    setTopic(topicOptions[Math.floor(Math.random() * topicOptions.length)]);
    setTone(toneOptions[Math.floor(Math.random() * toneOptions.length)]);
    setType(typeOptions[Math.floor(Math.random() * typeOptions.length)]);
    setPromptVersion(
      promptOptions[Math.floor(Math.random() * promptOptions.length)].value,
    );
    setTemperature(Math.round(Math.random() * 20) / 10); // Random value between 0 and 2, rounded to 1 decimal place
  };

  React.useEffect(() => {
    if (
      evaluationMessages.length > 0 &&
      evaluationMessages[evaluationMessages.length - 1].role === "assistant"
    ) {
      setEvaluation(evaluationMessages[evaluationMessages.length - 1].content);
    }
  }, [evaluationMessages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            AI Joke Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label htmlFor="topic" className="text-lg font-semibold">
              Topic
            </Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger id="topic" className="w-full mt-1">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {topicOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tone" className="text-lg font-semibold">
              Tone
            </Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone" className="w-full mt-1">
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {toneOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type" className="text-lg font-semibold">
              Type
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type" className="w-full mt-1">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {typeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="promptVersion" className="text-lg font-semibold">
              Prompt Style
            </Label>
            <Select value={promptVersion} onValueChange={setPromptVersion}>
              <SelectTrigger id="promptVersion" className="w-full mt-1">
                <SelectValue placeholder="Select a prompt style" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {promptOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="temperature" className="text-lg font-semibold">
              Temperature: {temperature}
            </Label>
            <Slider
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-2xl mt-3"
              id="temperature"
              min={0}
              max={2}
              step={0.1}
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={generateJoke}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Joke"}
            </Button>
            <Button
              onClick={randomizeSelections}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Randomize
            </Button>
          </div>

          {messages.length > 0 &&
            messages[messages.length - 1].role === "assistant" && (
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-lg border border-purple-200">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Here&apos;s your joke:
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                  {messages[messages.length - 1].content}
                </p>
                <Button
                  onClick={evaluateJoke}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                  disabled={isEvaluating}
                  hidden={isEvaluating}
                >
                  {isEvaluating ? "Evaluating..." : "Evaluate Joke"}
                </Button>
              </div>
            )}

          {evaluation && (
            <div className="mt-6 p-6 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg shadow-lg border border-green-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Joke Evaluation:
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                {evaluationMessages[evaluationMessages.length - 1].content}
              </p>
            </div>
          )}

          {(isLoading || isEvaluating) && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
