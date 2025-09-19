'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, MessageSquare, BarChart3 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DiscernmentPage() {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  // Load chat history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setChatHistory(parsedHistory);
        setHasLoadedHistory(true);
      } catch (error) {
        console.error('Failed to parse chat history:', error);
      }
    }
  }, []);

  const analyzeConversation = async () => {
    if (chatHistory.length === 0) return;

    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const conversationText = chatHistory
        .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Please analyze this conversation between a user and an AI assistant working on prompt improvement. Focus on:

1. **Collaboration Quality**: How well did the AI and user work together?
2. **Prompt Evolution**: How did the prompt improve through the conversation?
3. **AI Behavior**: What patterns do you notice in how the AI responded?
4. **User Engagement**: How effectively did the user guide the AI?
5. **Learning Insights**: What can be learned about effective AI collaboration?

Here's the conversation:

${conversationText}

Please provide a thoughtful analysis covering these areas.`
          }],
          enhancedPrompt: null
        })
      });

      const data = await response.json();
      setAnalysis(data.message || 'Analysis completed but no response received.');
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysis('Failed to analyze conversation. Please try again.');
    } finally {
      setIsAnalyzing(false);
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
          Back to Description Tool
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Discernment Phase</h1>
        <p className="text-xl text-gray-600">Analyze your AI collaboration conversation</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Chat History Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-blue-900">Conversation History</h2>
          </div>

          {hasLoadedHistory ? (
            <div>
              <p className="text-blue-800 mb-4">
                Loaded {chatHistory.length} messages from your previous conversation.
              </p>

              {chatHistory.length > 0 ? (
                <div className="bg-white rounded border p-4 max-h-60 overflow-y-auto">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-3 pb-3 ${index < chatHistory.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div className={`text-xs font-medium mb-1 ${msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                        {msg.role === 'user' ? 'USER' : 'ASSISTANT'}
                      </div>
                      <div className="text-sm text-gray-700">
                        {msg.content.length > 150 ? `${msg.content.substring(0, 150)}...` : msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-700">No conversation found. Try using the Description Tool first.</p>
              )}
            </div>
          ) : (
            <p className="text-blue-800">Loading conversation history...</p>
          )}
        </div>

        {/* Analysis Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Conversation Analysis</h2>
            </div>

            <button
              onClick={analyzeConversation}
              disabled={chatHistory.length === 0 || isAnalyzing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Brain className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Conversation'}
            </button>
          </div>

          {isAnalyzing && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Claude is analyzing your conversation...</p>
            </div>
          )}

          {analysis && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Analysis Results</h3>
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">{analysis}</div>
              </div>
            </div>
          )}

          {!analysis && !isAnalyzing && (
            <p className="text-gray-600">
              Click \\\"Analyze Conversation\\\" to get insights about your AI collaboration.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}