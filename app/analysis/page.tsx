'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, MessageSquare, BarChart3 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AnalysisPage() {
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
            content: `You're reviewing how this user worked with AI to create a document about human capabilities in AI fluency. Give them encouraging, simple feedback.

Look for evidence of discernment in three areas:
- Product: Did they evaluate if AI responses were accurate and met their needs?
- Process: Did they notice if AI's reasoning made sense or got off track?
- Performance: Did they guide AI's communication style effectively?

Write a brief, appreciative assessment in plain text (no markdown, asterisks, or formatting). Structure it as:

1. Start with something positive they did well
2. Mention 2-3 specific strengths you noticed
3. Suggest 1-2 gentle improvements for next time
4. End encouragingly

Keep it conversational, supportive, and under 150 words.

Conversation:
${conversationText}`
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
        <a
          href="/refine"
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Refine
        </a>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Discernment Assessment</h1>
        <p className="text-xl text-gray-600">Evaluate how well you demonstrated discernment during your AI interaction</p>
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
                <p className="text-blue-700">No conversation found. Try using the Refine page first.</p>
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
              <h2 className="text-lg font-semibold text-gray-900">Discernment Assessment</h2>
            </div>

            <button
              onClick={analyzeConversation}
              disabled={chatHistory.length === 0 || isAnalyzing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Brain className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Assessing...' : 'Assess Discernment'}
            </button>
          </div>

          {isAnalyzing && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing how you worked with AI...</p>
            </div>
          )}

          {analysis && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Your Discernment Assessment</h3>
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">{analysis}</div>
              </div>
            </div>
          )}

          {!analysis && !isAnalyzing && (
            <p className="text-gray-600">
              Click "Assess Discernment" to evaluate how well you demonstrated discernment skills during your AI interaction.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}