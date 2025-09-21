'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle, Target, Settings, MessageSquare, ArrowRight, Plus, Zap, Send, ArrowLeft, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

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
  const [visibleHints, setVisibleHints] = useState<{[key: string]: boolean}>({});

  // Chatbot state
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChattingWithClaude, setIsChattingWithClaude] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

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
        text: 'Give context: Be specific about what you want, why you want it, and relevant background',
        hint: 'Example: "This is for school governing body members at a 500-student school considering AI next year."'
      },
      {
        id: 'examples',
        text: 'Show examples: Demonstrate the output style or format you\'re looking for',
        hint: 'Example: "Make it a one-page brief with bullet points and clear headings."'
      },
      {
        id: 'constraints',
        text: 'Specify constraints: Clearly define format, length, and other output requirements',
        hint: 'Example: "One page only, professional language, 5-7 key points, printable."'
      }
    ],
    process: [
      {
        id: 'data_sources',
        text: 'Data Sources: Are there specific data you want the AI to use?',
        hint: 'Example: "Focus on human strengths like empathy, creativity, and relationships."'
      },
      {
        id: 'order_operations',
        text: 'Order of Operations: Are there specific issues it needs to address, and should it be done in a particular order?',
        hint: 'Example: "Start by listing 5-7 specific human capabilities. Then explain why each one matters. Finally, give me 2-3 talking points for each capability."'
      },
      {
        id: 'analysis_techniques',
        text: 'Analysis and Techniques: Is there a particular style of analysis, workflow, or technique you want the AI to use?',
        hint: 'Example: "Compare what humans do well vs what AI does well, then make it practical."'
      }
    ],
    performance: [
      {
        id: 'collaboration',
        text: 'Set expectations for how you want to collaborate',
        hint: 'Example: "Ask questions if unclear and suggest improvements."'
      },
      {
        id: 'communication',
        text: 'Specify your preferred communication style',
        hint: 'Example: "Be direct and practical. Use simple language."'
      },
      {
        id: 'role',
        text: 'Define the AI\'s role or tone: Specify how you want the AI to communicate',
        hint: 'Example: "Write as an education expert who values both AI and teachers."'
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
      setVisibleHints(prev => ({
        ...prev,
        [improvement.id]: false
      }));
      setActiveInput(null);
    } else {
      // Add to selected, show hint, and open input
      setSelectedImprovements(prev => ({
        ...prev,
        [category]: [...prev[category], improvement.id]
      }));
      setVisibleHints(prev => ({
        ...prev,
        [improvement.id]: true
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

  const generateDocumentQRCode = async () => {
    if (messages.length === 0) return;

    try {
      // Get only the last Claude response (the final document)
      const lastAssistantMessage = messages
        .filter(msg => msg.role === 'assistant')
        .pop(); // Get the last one

      if (!lastAssistantMessage) {
        throw new Error('No document found');
      }

      const documentContent = lastAssistantMessage.content;

      // Store the document on the server
      const response = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: documentContent })
      });

      if (!response.ok) {
        throw new Error('Failed to store document');
      }

      const { id } = await response.json();
      
      // Create URL to the document page
      const documentUrl = `${window.location.origin}/document/${id}`;

      // Generate QR code for the document URL
      const qrCodeUrl = await QRCode.toDataURL(documentUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrCodeUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
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
        productInputs.forEach(item => {
          sections.push('\n' + item.input);
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
        processInputs.forEach(item => {
          sections.push('\n' + item.input);
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
        performanceInputs.forEach(item => {
          sections.push('\n' + item.input);
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
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!improvementInputs[improvement.id]?.trim()}
                          onChange={() => toggleImprovement('product', improvement)}
                          className="mr-3 mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-900">{improvement.text}</span>
                      </label>

                      {visibleHints[improvement.id] && (
                        <div className="ml-7 mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
                          <p className="text-sm text-purple-800">💡 <strong>Helpful hint:</strong></p>
                          <p className="text-sm text-purple-700 mt-1 italic">{improvement.hint}</p>
                        </div>
                      )}

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
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!improvementInputs[improvement.id]?.trim()}
                          onChange={() => toggleImprovement('process', improvement)}
                          className="mr-3 mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-900">{improvement.text}</span>
                      </label>

                      {visibleHints[improvement.id] && (
                        <div className="ml-7 mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-800">💡 <strong>Helpful hint:</strong></p>
                          <p className="text-sm text-green-700 mt-1 italic">{improvement.hint}</p>
                        </div>
                      )}

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
                  <h3 className="text-xl font-heading font-semibold text-purple-900">Performance: How We Work Together with AI</h3>
                </div>
                <p className="text-purple-800 mb-4">
                  Set expectations for collaboration, communication, and feedback.
                </p>
                <div className="space-y-3">
                  {improvementSuggestions.performance.map((improvement) => (
                    <div key={improvement.id}>
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!improvementInputs[improvement.id]?.trim()}
                          onChange={() => toggleImprovement('performance', improvement)}
                          className="mr-3 mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-900">{improvement.text}</span>
                      </label>

                      {visibleHints[improvement.id] && (
                        <div className="ml-7 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-800">💡 <strong>Helpful hint:</strong></p>
                          <p className="text-sm text-blue-700 mt-1 italic">{improvement.hint}</p>
                        </div>
                      )}

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

            {/* Enhanced Prompt Preview */}
            {hasValidInputs && (
              <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-heading font-semibold text-gray-900 mb-3">Your Enhanced Prompt</h2>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                  <pre className="text-gray-700 whitespace-pre-wrap font-sans text-sm leading-relaxed">{generateImprovedPrompt()}</pre>
                </div>
              </div>
            )}

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
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Practice Discernment:</strong> As you chat, evaluate Claude's responses. Do they meet your needs? Are they accurate? Is the communication style right? This practice will help you become more discerning in future AI interactions.
                  </p>
                </div>
                
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
                      Great! You're testing how your enhanced prompt performs. When you're ready, move to the analysis phase to review your conversation.
                    </p>
                  </div>
                )}

                {/* Copy My Document Section */}
                {messages.length > 0 && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <QrCode className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-900">Copy My Document</h4>
                    </div>
                    <p className="text-blue-800 text-sm mb-3">
                      Get a QR code to access your document on your phone:
                    </p>
                    
                    <div className="flex flex-col items-center space-y-3">
                      {!qrCodeDataUrl && (
                        <button
                          onClick={generateDocumentQRCode}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Copy My Document
                        </button>
                      )}
                      
                      {qrCodeDataUrl && (
                        <div className="bg-white p-4 rounded-lg border border-blue-200">
                          <img 
                            src={qrCodeDataUrl} 
                            alt="QR Code to email document" 
                            className="w-48 h-48"
                          />
                        </div>
                      )}
                      
                      {qrCodeDataUrl && (
                        <p className="text-blue-700 text-xs text-center max-w-sm">
                          Point your phone's camera at the QR code to open your document. You can then copy it or email it to yourself.
                        </p>
                      )}
                    </div>
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