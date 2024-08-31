"use client";
import { useChat } from "ai/react";
import React, { useState } from 'react';
import { Button } from "@/app/Components/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/app/Components/Card"
import { Label } from "@/app/Components/Label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/Components/Select"
import { Slider } from "@/app/Components/Slider"

export default function JokeGenerator() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [topic, setTopic] = useState('work');
  const [tone, setTone] = useState('witty');
  const [type, setType] = useState('pun');
  const [temperature, setTemperature] = useState(0.5);
  const [generatedJoke, setGeneratedJoke] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const generateJoke = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedJoke('');
const input= `Generate a ${type} joke about ${topic} with a ${tone} tone. Use a temperature of ${temperature}`
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a joke generator. Generate a joke based on the following parameters." },
            { role: "user", content: `Generate a ${type} joke about ${topic} with a ${tone} tone. Use a temperature of ${temperature}.` }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate joke');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let jokeContent = '';

      while (true) {
        const { done, value } = await reader?.read() ?? { done: true, value: undefined };
        if (done) break;
        jokeContent += decoder.decode(value);
        setGeneratedJoke(jokeContent);
      }
    } catch (err) {
      console.error('Error generating joke:', err);
      setError('An error occurred while generating the joke. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">AI Joke Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger id="topic">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent className=" bg-white">
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="people">People</SelectItem>
                <SelectItem value="animals">Animals</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="television">Television</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>
              <SelectContent className=" bg-white">
                <SelectItem value="witty">Witty</SelectItem>
                <SelectItem value="sarcastic">Sarcastic</SelectItem>
                <SelectItem value="silly">Silly</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="goofy">Goofy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent className=" bg-white">
                <SelectItem value="pun">Pun</SelectItem>
                <SelectItem value="knock-knock">Knock-knock</SelectItem>
                <SelectItem value="story">Story</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="temperature" >Temperature: {temperature} </Label>
            <Slider
            className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-2xl mt-3"
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
            />
          </div>

          <Button onClick={generateJoke} className="w-full" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Joke'}
          </Button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {generatedJoke && (
            <div className="mt-4 p-4 bg-white rounded-md shadow">
              <h3 className="text-lg font-semibold mb-2">Generated Joke:</h3>
              <p>{generatedJoke}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}