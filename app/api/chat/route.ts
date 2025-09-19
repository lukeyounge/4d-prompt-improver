import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, enhancedPrompt } = await request.json();

    console.log('=== Chat API Request ===');
    console.log('Enhanced Prompt:', enhancedPrompt);
    console.log('Message Count:', messages.length);
    console.log('Latest Message:', messages[messages.length - 1]);
    console.log('API Key configured:', !!process.env.ANTHROPIC_API_KEY);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log('Error: Missing or invalid messages');
      return NextResponse.json(
        { error: 'Messages array is required' },
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

    console.log('Making API call to Claude...');
    const startTime = Date.now();

    // For the first message, we'll use the enhanced prompt as the initial message
    // For subsequent messages, we'll continue the conversation
    let conversationMessages;

    if (messages.length === 1 && enhancedPrompt) {
      // First message - use the enhanced prompt
      conversationMessages = [
        {
          role: 'user' as const,
          content: enhancedPrompt
        }
      ];
    } else {
      // Ongoing conversation - use the message history
      conversationMessages = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: conversationMessages
    });

    const endTime = Date.now();
    console.log(`API call completed in ${endTime - startTime}ms`);

    // Extract text content from response
    const responseText = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    console.log('=== Chat API Response ===');
    console.log('Response Length:', responseText.length, 'characters');
    console.log('Usage:', response.usage);
    console.log('Response Preview:', responseText.substring(0, 200) + '...');

    return NextResponse.json({
      message: responseText,
      usage: response.usage
    });

  } catch (error) {
    console.error('Chat API Error:', error);

    // Handle specific Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get response from Claude' },
      { status: 500 }
    );
  }
}