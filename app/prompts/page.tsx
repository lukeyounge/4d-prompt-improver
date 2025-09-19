'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Target, Settings, MessageSquare, ArrowLeft } from 'lucide-react';

export default function PromptsPage() {
  const [basicPrompt, setBasicPrompt] = useState('');

  const examplePrompts = [
    "How do I get teachers who are nervous or apathetic about AI to get on board?",
    "I need to create a vision for AI use in my school",
    "Give me a one page briefing for parents in AI in education",
    "How do I manage the excitement around AI in a cautious way?",
    "How do I explain plagiarism and responsible AI use to students?",
    "What questions should I ask when evaluating an AI tool for my school?",
    "What examples from other schools could inspire our own AI strategy?"
  ];

  const handleContinue = () => {
    if (basicPrompt.trim()) {
      localStorage.setItem('basicPrompt', basicPrompt.trim());
      window.location.href = '/refine';
    }
  };

  const handleExampleClick = (example: string) => {
    setBasicPrompt(example);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleContinue();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Delegation Game
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">School Leaders Exploring Description</h1>
        <p className="text-xl text-gray-600">One D of the 4D Framework for AI Fluency</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Framework Overview */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Three Components of Description</h2>
          <h3 className="text-lg font-medium text-gray-800 mb-6">Description is about communicating with AI in ways that create a productive collaborative environment.</h3>
          <div className="grid md:grid-cols-1 gap-6">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Product Description</h4>
                <p className="text-sm text-gray-600 italic mb-1">"What we want and why we want it"</p>
                <p className="text-sm text-green-800">Clearly defining what you want in terms of outputs, format, audience, and style</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Process Description</h4>
                <p className="text-sm text-gray-600 italic mb-1">"How we want it done"</p>
                <p className="text-sm text-blue-800">Guide how the AI approaches your request</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Performance Description</h4>
                <p className="text-sm text-gray-600 italic mb-1">"How we want to work with AI"</p>
                <p className="text-sm text-purple-800">Define how AI should behave eg concise or detailed, challenging or supportive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Question */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">How can I navigate AI implementation at my school?</h2>
          <p className="text-blue-800">
            As you explore how to better communicate with AI, let's use this question as a focus.
          </p>
        </div>

        {/* Prompt Input */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Start with Your Basic Prompt</h2>
          <p className="text-gray-600 mb-4">
            Think about an issue you are having around AI implementation at your school (or an issue you envisage). Write a simple instruction or question to AI and then we'll do some enhancing.
          </p>

          <textarea
            value={basicPrompt}
            onChange={(e) => setBasicPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your basic prompt here... (e.g., 'Help me write a lesson plan')"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">Press Cmd+Enter to continue</p>
            <button
              onClick={handleContinue}
              disabled={!basicPrompt.trim()}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              <span>Continue to Refine</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Need inspiration? Try these examples:</h3>
          <div className="space-y-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="w-full text-left px-4 py-2 bg-white border border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="text-blue-800">"{example}"</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}