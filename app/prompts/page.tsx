'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Target, Settings, MessageSquare, ArrowLeft } from 'lucide-react';

export default function PromptsPage() {
  const [basicPrompt, setBasicPrompt] = useState('');

  const examplePrompts = [
    "One page essential human capabilities in AI fluency document",
    "Write something about what teachers do",
    "Make a document about teacher capabilities",
    "Create a policy about teachers and AI",
    "Write about human skills in education",
    "Give me information about teacher strengths",
    "Create a summary about educators"
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
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-heading font-semibold text-gray-900 mb-4">School Leaders Exploring Description</h1>
        <p className="text-xl text-gray-600">One D of the 4D Framework for AI Fluency</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Framework Overview */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Three Components of Description</h2>
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

        {/* Exercise Overview */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">Today's Description Exercise</h2>
          <p className="text-gray-700 mb-4">
            We're going to practice Description by creating something practical you can use at your school. Ordinarily you would come up with your own project to work on with AI, but for this exercise we want you to create a specific document.
          </p>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Your Task: "Essential Human Capabilities in AI Fluency"</h3>
            <p className="text-gray-700 mb-3">
              Create a one-page document that outlines the essential human capabilities teachers bring to AI partnerships. This will be a practical tool for board presentations, parent communications, and teacher coaching conversations about the irreplaceable human element in education.
            </p>
            <p className="text-sm text-gray-600">
              You'll experience all three types of Description as you refine a basic prompt into something that produces a professional, ready-to-use document for your leadership context.
            </p>
          </div>
        </div>

        
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">Start with Your Basic Prompt</h2>
          <p className="text-gray-600 mb-4">
            Write a simple, basic prompt to create the "Essential Human Capabilities in AI Fluency" document. Keep it intentionally simple for now - we'll enhance it together using the three types of Description.
          </p>

          <textarea
            value={basicPrompt}
            onChange={(e) => setBasicPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Try something basic like: 'One page essential human capabilities in AI fluency document'"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">Press Cmd+Enter to continue</p>
            <button
              onClick={handleContinue}
              disabled={!basicPrompt.trim()}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
            >
              <span>Continue to Refine</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}