import { mistral } from '@ai-sdk/mistral';
import { generateText } from 'ai';
import { APIError } from 'openai/error.mjs';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

//NOTE: Mistral_API_KEY will be used from environment variables by default by Vercel AI SDK

//Set the runtime to edge for best performance
export const runtime = 'edge'

const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

export async function POST(request: Request) {
  try {
    const result = await generateText({
      model: mistral('mistral-large-latest'),
      maxTokens: 400,
      prompt: prompt,
      temperature: 1
    })
    
     return Response.json({
      message: result.text,
      success: true
    })
  }
  catch (error) {
    if (error instanceof APIError) {
      // API error handling
      const { name, status, headers, message } = error
      return Response.json(
        {
          name,
          status,
          headers,
          message
        },
        {
          status: 500
        }
      )
    }
    else {
      console.error("An unexpected error occurred: ", error)
      throw error
    }
  }
}