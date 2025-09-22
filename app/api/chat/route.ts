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
    console.log('Latest Message:', messages.length > 0 ? messages[messages.length - 1] : 'None (starting new conversation)');
    console.log('API Key configured:', !!process.env.ANTHROPIC_API_KEY);

    if (!messages || !Array.isArray(messages)) {
      console.log('Error: Missing or invalid messages array');
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // For new conversations, we need either messages or an enhanced prompt
    if (messages.length === 0 && !enhancedPrompt) {
      console.log('Error: Either messages or enhanced prompt required');
      return NextResponse.json(
        { error: 'Either message history or enhanced prompt is required' },
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

    if (messages.length === 0 && enhancedPrompt) {
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
      max_tokens: 8000,
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