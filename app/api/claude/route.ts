import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { basicPrompt, enhancedPrompt } = await request.json();

    if (!basicPrompt || !enhancedPrompt) {
      return NextResponse.json(
        { error: 'Both basicPrompt and enhancedPrompt are required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Make parallel requests to Claude for both prompts
    const [basicResponse, enhancedResponse] = await Promise.all([
      anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: basicPrompt
          }
        ]
      }),
      anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      })
    ]);

    // Extract text content from responses
    const basicText = basicResponse.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    const enhancedText = enhancedResponse.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    return NextResponse.json({
      basicResponse: {
        text: basicText,
        usage: basicResponse.usage
      },
      enhancedResponse: {
        text: enhancedText,
        usage: enhancedResponse.usage
      }
    });

  } catch (error) {
    console.error('Claude API Error:', error);

    // Handle specific Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get responses from Claude' },
      { status: 500 }
    );
  }
}