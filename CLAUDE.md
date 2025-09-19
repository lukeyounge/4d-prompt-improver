# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application containing an interactive AI prompt improvement tool called "AI Communication for School Leaders" designed for professionals and educators. The tool helps users enhance their AI prompts using the 3P Framework (Product, Process, Performance Description) and provides direct interaction with Claude AI to demonstrate collaborative communication.

**Status**: Ready for deployment on Vercel with API routes and Claude integration.

## Development Setup

This project is a Next.js application with API routes and Claude integration:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Architecture

- **Next.js 15.5.3**: App Router architecture with API routes
- **React 18**: Modern React app using functional components and hooks
- **Multi-Step Wizard**: Manages three distinct steps: `basic`, `improve`, `compare`
- **3P Framework**: Product, Process, Performance Description categories for prompt enhancement
- **Interactive Chat**: Real-time conversation with Claude AI using enhanced prompts
- **Claude API Integration**: Direct integration with Claude Sonnet 4 for interactive demonstrations

## Current Dependencies

- **React 18**: Core framework
- **Next.js 15.5.3**: Full-stack React framework with app router
- **Tailwind CSS 3.4.1**: Utility-first styling framework
- **lucide-react 0.460.0**: Modern icon library with Send, MessageSquare, Target, Settings icons
- **TypeScript 5**: Full type safety implementation
- **@anthropic-ai/sdk 0.63.0**: Official Anthropic SDK for Claude integration

## Core Tool Mechanics

- **Prompt Input**: Users enter basic prompts or select from example prompts
- **Enhancement Flow**: Basic prompt → 3P improvements → interactive Claude chat
- **3P Categories**:
  - Product Description: Six foundational techniques (Give Context, Show Examples, Specify Constraints, Break Into Steps, Ask AI to Think First, Define AI Role/Tone)
  - Process Description: How AI should approach the work
  - Performance Description: How AI should communicate and collaborate
- **Interactive Chat**: Direct conversation with Claude using enhanced prompts to demonstrate collaborative AI communication

## Key Data Structures

- **Tool State**: Controls UI flow between basic, improve, and compare steps
- **Improvement Suggestions**: Contains categorized improvement prompts:
  - `product`: Six foundational prompting techniques with examples and placeholders
  - `process`: Approach and sequence preferences
  - `performance`: Collaboration style and communication preferences
- **User Inputs**: Tracks selected improvements and user-provided context
- **Chat State**: Manages conversation history, current messages, and API interactions

## API Routes

### `/api/chat` - Interactive Chat Endpoint
- **Method**: POST
- **Purpose**: Handles conversational interaction with Claude
- **Input**: `{ messages: Array, enhancedPrompt: string }`
- **Output**: `{ message: string, usage: object }`
- **Model**: Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- **Features**:
  - Conversation context management
  - Enhanced prompt initialization
  - Comprehensive logging
  - Error handling with retry support

### `/api/claude` - Legacy Comparison Endpoint (Deprecated)
- **Method**: POST
- **Purpose**: Previously used for side-by-side prompt comparison
- **Status**: Maintained for backward compatibility but no longer used in UI

## Environment Variables

```bash
# Required: Anthropic API Key for Claude integration
ANTHROPIC_API_KEY=sk-ant-api03-...
```

## Content Modification

To modify tool content:
- Edit the `improvementSuggestions` object in `LivePromptImprovementTool.tsx`
- Modify `examplePrompts` array for different sample prompts
- Update category colors and styling via Tailwind classes
- Customize prompt generation logic in `generateImprovedPrompt`
- Adjust chat interface styling and markdown rendering in `renderMarkdown`

## Current File Structure

```
/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts         # Interactive chat endpoint
│   │   └── claude/
│   │       └── route.ts         # Legacy comparison endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── LivePromptImprovementTool.tsx   # Main application component
├── .env.local                   # Environment variables (API keys)
├── node_modules/
├── package.json
├── next.config.js              # Standard Next.js configuration
├── vercel.json                 # Standard Vercel deployment
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── CLAUDE.md
```

## Deployment Configuration

### next.config.js
- **Standard Configuration**: No static export, enables API routes
- **Image Optimization**: Enabled for better performance
- **TypeScript**: Strict mode enabled

### vercel.json
- **Build System**: Standard Next.js runtime for API route support
- **Version**: Uses Vercel v2 build configuration
- **API Routes**: Enabled for `/api/chat` and `/api/claude` endpoints

### Deployment Process
1. Vercel detects Next.js application and uses standard build process
2. Runs `npm run build` which compiles application and API routes
3. Deploys with full Next.js runtime for API route support
4. Environment variables are configured in Vercel dashboard

## Key Features

### Enhanced Prompt Engineering
- **Six Foundational Techniques**: Give Context, Show Examples, Specify Constraints, Break Into Steps, Ask AI to Think First, Define AI Role/Tone
- **3P Framework Education**: Teaches Product, Process, and Performance Description
- **Live Prompt Preview**: Real-time preview of enhanced prompts as users add improvements
- **Professional Focus**: Designed specifically for school leaders and educational professionals

### Interactive Claude Chat
- **Real-time Conversation**: Direct chat interface with Claude AI
- **Context Preservation**: Maintains conversation history across multiple exchanges
- **Enhanced Prompt Integration**: Uses improved prompts as conversation starters
- **Markdown Rendering**: Properly formatted responses with headers, lists, and styling
- **Error Handling**: Comprehensive error handling with retry capabilities

### User Experience
- **Progressive Enhancement**: Three-step process from basic prompt to interactive chat
- **Educational Design**: Each step teaches prompt engineering concepts
- **Professional Styling**: Clean, modern interface suitable for educational settings
- **Responsive Design**: Works on desktop and mobile devices

## Troubleshooting

### Common Issues
- **API Key Configuration**: Ensure `ANTHROPIC_API_KEY` is set in environment variables
- **TypeScript Errors**: All find() method results use optional chaining for safety
- **Build Failures**: Check that all API routes compile correctly
- **Chat Errors**: Verify API key permissions and rate limits

### Development Tips
1. **Test API Routes**: Use `/api/chat` endpoint directly for debugging
2. **Check Logs**: Console logs provide detailed API interaction information
3. **Environment Setup**: Ensure `.env.local` is properly configured
4. **Build Verification**: Always test `npm run build` before deployment

## Educational Goals

This tool demonstrates:
- **Collaborative AI Communication**: Moving beyond simple prompts to interactive dialogue
- **Professional Expertise Integration**: How domain knowledge improves AI interactions
- **Practical Application**: Real-world examples relevant to school leaders
- **Evidence-Based Learning**: Direct experience with enhanced vs. basic prompts
- **4D Framework Application**: Practical implementation of Description phase techniques