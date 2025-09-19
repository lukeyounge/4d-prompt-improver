import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { basicPrompt, enhancedPrompt } = await request.json();

    console.log('=== Claude API Request ===');
    console.log('Basic Prompt:', basicPrompt);
    console.log('Enhanced Prompt:', enhancedPrompt);
    console.log('API Key configured:', !!process.env.ANTHROPIC_API_KEY);

    if (!basicPrompt || !enhancedPrompt) {
      console.log('Error: Missing prompts');
      return NextResponse.json(
        { error: 'Both basicPrompt and enhancedPrompt are required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('Error: API key not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('Making API calls to Claude...');
    const startTime = Date.now();

    // Make parallel requests to Claude for both prompts
    const [basicResponse, enhancedResponse] = await Promise.all([
      anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: basicPrompt
          }
        ]
      }),
      anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      })
    ]);

    const endTime = Date.now();
    console.log(`API calls completed in ${endTime - startTime}ms`);

    // Extract text content from responses
    const basicText = basicResponse.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    const enhancedText = enhancedResponse.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    console.log('=== Claude API Responses ===');
    console.log('Basic Response Length:', basicText.length, 'characters');
    console.log('Enhanced Response Length:', enhancedText.length, 'characters');
    console.log('Basic Usage:', basicResponse.usage);
    console.log('Enhanced Usage:', enhancedResponse.usage);
    console.log('Basic Response Preview:', basicText.substring(0, 200) + '...');
    console.log('Enhanced Response Preview:', enhancedText.substring(0, 200) + '...');

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