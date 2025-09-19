'use client';

import React, { useState } from 'react';
import { ArrowRight, Target, Settings, MessageSquare } from 'lucide-react';

export default function Home() {
  const [basicPrompt, setBasicPrompt] = useState('');

  const examplePrompts = [
    "Create a lesson plan for teaching photosynthesis.",
    "Help me write a professional email to request time off.",
    "Design a team-building activity for remote workers.",
    "Explain quantum computing in simple terms.",
    "Create a budget plan for a small business."
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
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Fluency Tool</h1>
        <p className="text-xl text-gray-600 mb-2">Bring Your Expertise to AI</p>
        <p className="text-gray-500">Use the 4D Framework to transform basic prompts into powerful AI collaborations</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Framework Overview */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">The 4D Framework</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Product</h3>
                <p className="text-sm text-green-800">What & Why - Define context, purpose, and constraints</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Process</h3>
                <p className="text-sm text-blue-800">How - Specify approach, methodology, and steps</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Performance</h3>
                <p className="text-sm text-purple-800">How We Work - Set collaboration expectations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Start with Your Basic Prompt</h2>
          <p className="text-gray-600 mb-4">
            Enter a simple request you might make to an AI assistant. We'll help you enhance it using the 4D Framework.
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