'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle, Target, Settings, MessageSquare, ArrowRight, Plus, Zap, Send, ArrowLeft } from 'lucide-react';

const RefinePage = () => {
  const [basicPrompt, setBasicPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImprovements, setSelectedImprovements] = useState<{
    product: string[];
    process: string[];
    performance: string[];
  }>({
    product: [],
    process: [],
    performance: []
  });
  const [improvementInputs, setImprovementInputs] = useState<{[key: string]: string}>({});
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Chatbot state
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChattingWithClaude, setIsChattingWithClaude] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Load basic prompt from localStorage on mount
  useEffect(() => {
    const storedPrompt = localStorage.getItem('basicPrompt');
    if (storedPrompt) {
      setBasicPrompt(storedPrompt);
    }
    setIsLoading(false);
  }, []);

  const improvementSuggestions = {
    product: [
      {
        id: 'context',
        text: 'Add context about your audience, setting, or situation'
      },
      {
        id: 'purpose',
        text: 'Clarify the specific purpose or goal'
      },
      {
        id: 'constraints',
        text: 'Specify important constraints or limitations'
      }
    ],
    process: [
      {
        id: 'approach',
        text: 'Describe your preferred approach or methodology'
      },
      {
        id: 'sequence',
        text: 'Outline the sequence or steps you want'
      },
      {
        id: 'examples',
        text: 'Request specific examples or formats'
      }
    ],
    performance: [
      {
        id: 'collaboration',
        text: 'Set expectations for how you want to collaborate'
      },
      {
        id: 'communication',
        text: 'Specify your preferred communication style'
      },
      {
        id: 'feedback',
        text: 'Describe how you want to give and receive feedback'
      }
    ]
  };


  const toggleImprovement = (category: keyof typeof selectedImprovements, improvement: any) => {
    if (selectedImprovements[category].includes(improvement.id)) {
      // Remove if already selected
      setSelectedImprovements(prev => ({
        ...prev,
        [category]: prev[category].filter(id => id !== improvement.id)
      }));
      setImprovementInputs(prev => {
        const updated = { ...prev };
        delete updated[improvement.id];
        return updated;
      });
      setActiveInput(null);
    } else {
      // Add to selected and open input
      setSelectedImprovements(prev => ({
        ...prev,
        [category]: [...prev[category], improvement.id]
      }));
      setActiveInput(improvement.id);
    }
  };

  const handleImprovementInput = (improvementId: string, value: string) => {
    setImprovementInputs(prev => ({
      ...prev,
      [improvementId]: value
    }));
  };

  const closeInput = () => {
    setActiveInput(null);
  };

  const generateImprovedPrompt = () => {
    let improved = basicPrompt;

    // Build improved prompt sections
    const sections = [improved];

    const hasProduct = selectedImprovements.product.length > 0;
    const hasProcess = selectedImprovements.process.length > 0;
    const hasPerformance = selectedImprovements.performance.length > 0;

    if (hasProduct) {
      const productInputs = selectedImprovements.product.map(id => ({
        id,
        input: improvementInputs[id],
        label: improvementSuggestions.product.find(imp => imp.id === id)?.text
      })).filter(item => item.input);

      if (productInputs.length > 0) {
        sections.push('\n**Context & Request:**');
        productInputs.forEach(item => {
          sections.push(item.input);
        });
      }
    }

    if (hasProcess) {
      const processInputs = selectedImprovements.process.map(id => ({
        id,
        input: improvementInputs[id],
        label: improvementSuggestions.process.find(imp => imp.id === id)?.text
      })).filter(item => item.input);

      if (processInputs.length > 0) {
        sections.push('\n**Process to follow:**');
        processInputs.forEach(item => {
          sections.push(`- ${item.input}`);
        });
      }
    }

    if (hasPerformance) {
      const performanceInputs = selectedImprovements.performance.map(id => ({
        id,
        input: improvementInputs[id],
        label: improvementSuggestions.performance.find(imp => imp.id === id)?.text
      })).filter(item => item.input);

      if (performanceInputs.length > 0) {
        sections.push('\n**Communication approach:**');
        performanceInputs.forEach(item => {
          sections.push(`- ${item.input}`);
        });
      }
    }

    return sections.join('\n');
  };

  const startChatWithClaude = async () => {
    setIsChattingWithClaude(true);
    setChatError(null);

    const improvedPrompt = generateImprovedPrompt();

    console.log('=== Starting Chat with Claude ===');
    console.log('Enhanced Prompt:', improvedPrompt);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [],
          enhancedPrompt: improvedPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start chat');
      }

      const data = await response.json();

      console.log('=== Chat Response Received ===');
      console.log('Response Length:', data.message.length);
      console.log('Usage:', data.usage);

      setMessages([
        { role: 'assistant', content: data.message }
      ]);
    } catch (error) {
      console.error('Chat Error:', error);
      setChatError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsChattingWithClaude(false);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsChattingWithClaude(true);
    setChatError(null);

    // Add user message to chat
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(updatedMessages);

    console.log('=== Sending Chat Message ===');
    console.log('User Message:', userMessage);
    console.log('Message History Length:', updatedMessages.length);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          enhancedPrompt: null, // Not needed for ongoing conversation
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();

      console.log('=== Chat Response Received ===');
      console.log('Response Length:', data.message.length);
      console.log('Usage:', data.usage);

      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setChatError(error instanceof Error ? error.message : 'Something went wrong');
      // Remove the user message if the API call failed
      setMessages(messages);
    } finally {
      setIsChattingWithClaude(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering for chat messages
    let html = text
      // Bold text **text** -> <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Headers ### -> <h3>
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Lists - item -> <li>item</li>
      .replace(/^[\-\*] (.*$)/gm, '<li>$1</li>')
      // Wrap consecutive <li> in <ul>
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      // Line breaks
      .replace(/\n/g, '<br>');

    return { __html: html };
  };

  const hasAnySelections =
    selectedImprovements.product.length > 0 ||
    selectedImprovements.process.length > 0 ||
    selectedImprovements.performance.length > 0;

  const hasValidInputs = Object.values(improvementInputs).some(input => input.trim().length > 0);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link
          href="/prompts"
          className="flex items-center text-gray-600 hover:text-gray-800 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Prompts
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-heading font-semibold text-gray-900 mb-4">Let's Improve your AI communication</h1>
        <p className="text-xl text-gray-600">Let's work through the three parts of Description to enhance your AI communication - Product, Process and Performance</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Improvement Tips */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">Tips for Better AI Communication</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">1.</span>
                <span><strong>Give context:</strong> Be specific about what you want, why you want it, and relevant background</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">2.</span>
                <span><strong>Show examples:</strong> Demonstrate the output style or format you're looking for</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">3.</span>
                <span><strong>Specify constraints:</strong> Clearly define format, length, and other output requirements</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">4.</span>
                <span><strong>Break complex tasks into steps:</strong> Guide the AI through multi-step reasoning</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">5.</span>
                <span><strong>Ask the AI to think first:</strong> Give space for the AI to work through its process</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-900 mr-2">6.</span>
                <span><strong>Define the AI's role or tone:</strong> Specify how you want the AI to communicate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Show the basic prompt */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-heading font-semibold text-gray-900 mb-3">Your Starting Prompt</h2>
          {isLoading ? (
            <p className="text-gray-500">Loading your prompt...</p>
          ) : basicPrompt ? (
            <p className="text-gray-700">{basicPrompt}</p>
          ) : (
            <p className="text-gray-500">No prompt found. Please go back to the start page.</p>
          )}
        </div>

        {!isLoading && basicPrompt && (
          <>
            {/* Improvement sections */}
            <div className="space-y-8">
              {/* Product Section */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-xl font-heading font-semibold text-green-900">Product: What & Why</h3>
                </div>
                <p className="text-green-800 mb-4">
                  Define the context, purpose, and constraints for your request.
                </p>
                <div className="space-y-3">
                  {improvementSuggestions.product.map((improvement) => (
                    <div key={improvement.id}>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedImprovements.product.includes(improvement.id)}
                          onChange={() => toggleImprovement('product', improvement)}
                          className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-900">{improvement.text}</span>
                      </label>


                      {activeInput === improvement.id && (
                        <div className="ml-7 mt-2">
                          <textarea
                            value={improvementInputs[improvement.id] || ''}
                            onChange={(e) => handleImprovementInput(improvement.id, e.target.value)}
                            placeholder="Add your specific details here..."
                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={closeInput}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedImprovements.product.includes(improvement.id) && improvementInputs[improvement.id] && activeInput !== improvement.id && (
                        <div className="ml-8 p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-sm text-green-800">✓ {improvementInputs[improvement.id]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Process Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <Settings className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-xl font-heading font-semibold text-gray-900">Process: How</h3>
                </div>
                <p className="text-blue-800 mb-4">
                  Specify your preferred approach, methodology, and steps.
                </p>
                <div className="space-y-3">
                  {improvementSuggestions.process.map((improvement) => (
                    <div key={improvement.id}>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedImprovements.process.includes(improvement.id)}
                          onChange={() => toggleImprovement('process', improvement)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-900">{improvement.text}</span>
                      </label>


                      {activeInput === improvement.id && (
                        <div className="ml-7 mt-2">
                          <textarea
                            value={improvementInputs[improvement.id] || ''}
                            onChange={(e) => handleImprovementInput(improvement.id, e.target.value)}
                            placeholder="Add your specific details here..."
                            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={closeInput}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedImprovements.process.includes(improvement.id) && improvementInputs[improvement.id] && activeInput !== improvement.id && (
                        <div className="ml-8 p-2 bg-gray-50 rounded border border-gray-200">
                          <p className="text-sm text-blue-800">✓ {improvementInputs[improvement.id]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Section */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="text-xl font-heading font-semibold text-purple-900">Performance: How We Work Together</h3>
                </div>
                <p className="text-purple-800 mb-4">
                  Set expectations for collaboration, communication, and feedback.
                </p>
                <div className="space-y-3">
                  {improvementSuggestions.performance.map((improvement) => (
                    <div key={improvement.id}>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedImprovements.performance.includes(improvement.id)}
                          onChange={() => toggleImprovement('performance', improvement)}
                          className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-900">{improvement.text}</span>
                      </label>


                      {activeInput === improvement.id && (
                        <div className="ml-7 mt-2">
                          <textarea
                            value={improvementInputs[improvement.id] || ''}
                            onChange={(e) => handleImprovementInput(improvement.id, e.target.value)}
                            placeholder="Add your specific details here..."
                            className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={closeInput}
                              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedImprovements.performance.includes(improvement.id) && improvementInputs[improvement.id] && activeInput !== improvement.id && (
                        <div className="ml-8 p-2 bg-purple-50 rounded border border-purple-200">
                          <p className="text-sm text-purple-800">✓ {improvementInputs[improvement.id]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Section */}
            {hasAnySelections && hasValidInputs && (
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-xl font-heading font-semibold text-gray-900">Test Your Enhanced Prompt</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  See how your enhanced prompt performs in a real conversation with Claude.
                </p>
                {messages.length === 0 && !isChattingWithClaude && (
                  <button
                    onClick={startChatWithClaude}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Conversation with Enhanced Prompt
                  </button>
                )}
                {(messages.length > 0 || isChattingWithClaude) && (
                  <div className="bg-white border border-purple-200 rounded-2xl p-4 mb-4 shadow-sm">
                    <div className="h-96 overflow-y-auto mb-4 space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-xl ${
                            message.role === 'user'
                              ? 'bg-gray-50 border border-gray-200 ml-12'
                              : 'bg-gray-50 border border-gray-200 mr-12'
                          }`}
                        >
                          <div className={`text-xs font-semibold mb-1 ${
                            message.role === 'user' ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {message.role === 'user' ? 'YOU' : 'CLAUDE'}
                          </div>
                          <div
                            className="text-gray-800"
                            dangerouslySetInnerHTML={renderMarkdown(message.content)}
                          />
                        </div>
                      ))}
                      {isChattingWithClaude && (
                        <div className="bg-gray-50 border border-gray-200 mr-12 p-3 rounded-xl">
                          <div className="text-xs font-semibold mb-1 text-gray-600">CLAUDE</div>
                          <div className="flex items-center text-gray-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                            Thinking...
                          </div>
                        </div>
                      )}
                    </div>
                    {messages.length > 0 && (
                      <div className="flex gap-2">
                        <textarea
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Continue the conversation..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={2}
                          disabled={isChattingWithClaude}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!currentMessage.trim() || isChattingWithClaude}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {chatError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <p className="text-red-800 font-medium">Error: {chatError}</p>
                    <button
                      onClick={messages.length === 0 ? startChatWithClaude : sendMessage}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {messages.length > 0 && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
                    <p className="text-green-800 text-sm">
                      Great! You\\'re testing how your enhanced prompt performs. When you\\'re ready, move to the analysis phase to review your conversation.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            {messages.length > 0 && (
              <div className="flex flex-col items-center gap-4 mb-8 mt-8">
                <div className="border-t border-gray-200 w-full max-w-md my-4"></div>
                <Link
                  href="/analysis"
                  className="flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-lg font-semibold"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Analyze Your Conversation
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RefinePage;