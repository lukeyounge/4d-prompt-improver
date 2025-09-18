'use client';

import React, { useState } from 'react';
import { Copy, CheckCircle, Target, Settings, MessageSquare, ArrowRight, Plus, Lightbulb, Zap } from 'lucide-react';

const LivePromptImprovementTool = () => {
  const [currentStep, setCurrentStep] = useState('basic');
  const [basicPrompt, setBasicPrompt] = useState('');
  const [selectedImprovements, setSelectedImprovements] = useState<{
    product: string[];
    process: string[];
    performance: string[];
  }>({
    product: [],
    process: [],
    performance: []
  });
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [copied, setCopied] = useState(false);

  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [improvementInputs, setImprovementInputs] = useState<{[key: string]: string}>({});
  const [loadingHelp, setLoadingHelp] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<{[key: string]: string}>({});

  const improvementSuggestions = {
    product: [
      { id: 'audience', text: 'Define your audience with specific, actionable details: Who are they? What are their current knowledge levels, learning preferences, and common challenges?', placeholder: 'Be specific: My Grade 10 biology students - 70% English learners, prefer visual/hands-on learning, struggle with abstract scientific concepts, motivated by real-world connections. Class size: 28 students, mixed ability levels.' },
      { id: 'context', text: 'Provide situational context that directly impacts your approach: What environmental factors, timing constraints, or recent events should inform the AI\'s recommendations?', placeholder: 'Context that matters: 45-minute class period, following a 3-day weekend so re-engagement needed, limited lab equipment (6 microscopes for 28 students), building science fair projects due next month, recent unit on cellular structure.' },
      { id: 'purpose', text: 'State your specific, measurable outcome: What exact change in knowledge, behavior, or skill do you want to achieve, and how will you recognize success?', placeholder: 'Specific learning outcome: Students will be able to explain the process of photosynthesis using at least 3 key vocabulary terms AND make connections to at least 2 real-world examples from their own lives. Success = 80% can do this in exit ticket.' },
      { id: 'constraints', text: 'List all non-negotiable requirements and limitations: What standards, policies, resources, or boundaries must the AI work within?', placeholder: 'Hard constraints: Must align with NGSS standard 5-LS1-1, appropriate for diverse family values in our community, materials budget under $50, accessible for students with disabilities, completed in one 45-min class period, follows our school\'s inquiry-based learning model.' }
    ],
    process: [
      { id: 'approach', text: 'How do you want AI to work for you, not the other way around?', placeholder: 'e.g., Start with engagement, then build understanding - that&apos;s how I teach best' },
      { id: 'sequence', text: 'What&apos;s your preferred way of thinking through this type of work?', placeholder: 'e.g., I always consider differentiation first, then choose activities that work for all levels' }
    ],
    performance: [
      { id: 'collaboration', text: 'What kind of thinking partner do you need AI to be right now?', placeholder: 'e.g., Act like a supportive colleague who asks good questions but lets me make the decisions' },
      { id: 'communication', text: 'How should AI communicate with you during this collaboration?', placeholder: 'e.g., Give me practical options to choose from, don&apos;t lecture me, keep explanations brief' }
    ]
  };

  const examplePrompts = [
    'Create a lesson plan for teaching photosynthesis.',
    'Write an email to parents about homework policy.',
    'Design a math worksheet for fractions.',
    'Plan a professional development session on classroom management.',
    'Draft a school newsletter article about our new STEM program.'
  ];

  const handleBasicPromptSubmit = () => {
    if (basicPrompt.trim()) {
      setCurrentStep('improve');
    }
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
      sections.push('\n**Context & Requirements:**');
      selectedImprovements.product.forEach(id => {
        const userInput = improvementInputs[id];
        if (userInput && userInput.trim()) {
          sections.push(`- ${userInput}`);
        }
      });
    }

    if (hasProcess) {
      sections.push('\n**Process to follow:**');
      selectedImprovements.process.forEach(id => {
        const userInput = improvementInputs[id];
        if (userInput && userInput.trim()) {
          sections.push(`- ${userInput}`);
        }
      });
    }

    if (hasPerformance) {
      sections.push('\n**Communication approach:**');
      selectedImprovements.performance.forEach(id => {
        const userInput = improvementInputs[id];
        if (userInput && userInput.trim()) {
          sections.push(`- ${userInput}`);
        }
      });
    }

    const finalPrompt = sections.join('\n');
    setImprovedPrompt(finalPrompt);
    setCurrentStep('compare');

    // Scroll to top after a brief delay to let the state update
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const resetTool = () => {
    setCurrentStep('basic');
    setBasicPrompt('');
    setSelectedImprovements({ product: [], process: [], performance: [] });
    setImprovedPrompt('');
    setShowComparison(false);
  };

  const totalSelected = Object.values(selectedImprovements).flat().length;
  const totalWithInput = Object.values(selectedImprovements).flat().filter(id =>
    improvementInputs[id] && improvementInputs[id].trim()
  ).length;

  if (currentStep === 'basic') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bring Your Expertise to AI</h1>
          <p className="text-gray-600">Use the 4D Framework to assert your professional knowledge and make AI work for you</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">Start with Your Basic Prompt</h2>
          <p className="text-blue-800 mb-4">Enter a simple prompt below. We&apos;ll show you how to improve it by bringing your expertise and professional judgment to guide AI effectively.</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want the AI to help with?
            </label>
            <textarea
              value={basicPrompt}
              onChange={(e) => setBasicPrompt(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="e.g., Create a lesson plan for teaching photosynthesis"
            />
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Or try one of these examples:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setBasicPrompt(prompt)}
                  className="px-3 py-1 text-xs bg-white border border-blue-200 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleBasicPromptSubmit}
            disabled={!basicPrompt.trim()}
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Improve with 4D Framework
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'improve') {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">4D Framework Improvements</h1>
          <p className="text-gray-600">Select improvements to strengthen your prompt by bringing your professional expertise into the collaboration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Original Prompt */}
          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Basic Prompt</h3>
              <div className="bg-white rounded p-4 border">
                <p className="text-gray-800">{basicPrompt}</p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Zap className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800">Improvements Selected: {totalSelected}</h4>
              </div>
              <p className="text-green-700 text-sm">
                Each improvement you select will make your prompt more effective. Try selecting at least one from each category!
              </p>
            </div>
          </div>

          {/* Right: 4D Improvements */}
          <div className="space-y-6">
            {/* Product Description */}
            <div className="border-2 border-blue-500 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white p-2 rounded-lg mr-3">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
                  <p className="text-sm text-blue-600">Share what you know - your context, purpose, and professional insight</p>
                </div>
              </div>
              <div className="space-y-3">
                {improvementSuggestions.product.map((improvement) => (
                  <div key={improvement.id} className="space-y-2">
                    <button
                      onClick={() => toggleImprovement('product', improvement)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        selectedImprovements.product.includes(improvement.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`w-5 h-5 border-2 rounded mr-3 mt-0.5 flex items-center justify-center ${
                          selectedImprovements.product.includes(improvement.id)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedImprovements.product.includes(improvement.id) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{improvement.text}</p>
                        </div>
                      </div>
                    </button>

                    {(selectedImprovements.product.includes(improvement.id) && activeInput === improvement.id) && (
                      <div className="ml-8 space-y-2">
                        <textarea
                          value={improvementInputs[improvement.id] || ''}
                          onChange={(e) => handleImprovementInput(improvement.id, e.target.value)}
                          placeholder={improvement.placeholder}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          rows={2}
                        />
                        <button
                          onClick={closeInput}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Done
                        </button>
                      </div>
                    )}

                    {selectedImprovements.product.includes(improvement.id) && improvementInputs[improvement.id] && activeInput !== improvement.id && (
                      <div className="ml-8 p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm text-blue-800">✓ {improvementInputs[improvement.id]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Process Description */}
            <div className="border-2 border-green-500 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 text-white p-2 rounded-lg mr-3">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Process Description</h3>
                  <p className="text-sm text-green-600">Stay in control - guide how AI should think and work for you</p>
                </div>
              </div>
              <div className="space-y-3">
                {improvementSuggestions.process.map((improvement) => (
                  <div key={improvement.id} className="space-y-2">
                    <button
                      onClick={() => toggleImprovement('process', improvement)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        selectedImprovements.process.includes(improvement.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`w-5 h-5 border-2 rounded mr-3 mt-0.5 flex items-center justify-center ${
                          selectedImprovements.process.includes(improvement.id)
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedImprovements.process.includes(improvement.id) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{improvement.text}</p>
                        </div>
                      </div>
                    </button>

                    {(selectedImprovements.process.includes(improvement.id) && activeInput === improvement.id) && (
                      <div className="ml-8 space-y-2">
                        <textarea
                          value={improvementInputs[improvement.id] || ''}
                          onChange={(e) => handleImprovementInput(improvement.id, e.target.value)}
                          placeholder={improvement.placeholder}
                          className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          rows={2}
                        />
                        <button
                          onClick={closeInput}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          Done
                        </button>
                      </div>
                    )}

                    {selectedImprovements.process.includes(improvement.id) && improvementInputs[improvement.id] && activeInput !== improvement.id && (
                      <div className="ml-8 p-2 bg-green-50 rounded border border-green-200">
                        <p className="text-sm text-green-800">✓ {improvementInputs[improvement.id]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Description */}
            <div className="border-2 border-purple-500 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-500 text-white p-2 rounded-lg mr-3">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Performance Description</h3>
                  <p className="text-sm text-purple-600">Set the terms - define how AI should collaborate with your expertise</p>
                </div>
              </div>
              <div className="space-y-3">
                {improvementSuggestions.performance.map((improvement) => (
                  <div key={improvement.id} className="space-y-2">
                    <button
                      onClick={() => toggleImprovement('performance', improvement)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        selectedImprovements.performance.includes(improvement.id)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`w-5 h-5 border-2 rounded mr-3 mt-0.5 flex items-center justify-center ${
                          selectedImprovements.performance.includes(improvement.id)
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedImprovements.performance.includes(improvement.id) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{improvement.text}</p>
                        </div>
                      </div>
                    </button>

                    {(selectedImprovements.performance.includes(improvement.id) && activeInput === improvement.id) && (
                      <div className="ml-8 space-y-2">
                        <textarea
                          value={improvementInputs[improvement.id] || ''}
                          onChange={(e) => handleImprovementInput(improvement.id, e.target.value)}
                          placeholder={improvement.placeholder}
                          className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          rows={2}
                        />
                        <button
                          onClick={closeInput}
                          className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                        >
                          Done
                        </button>
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
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={generateImprovedPrompt}
            disabled={totalWithInput === 0}
            className="flex items-center px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            Generate Improved Prompt ({totalWithInput} improvements added)
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'compare') {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Expertise Made AI Smarter</h1>
          <p className="text-gray-600">See how bringing your professional knowledge transformed the AI collaboration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Before */}
          <div className="order-2 lg:order-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="bg-gray-400 text-white p-2 rounded-lg mr-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              Basic Prompt
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-64 overflow-y-auto">
              <p className="text-gray-800">{basicPrompt}</p>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Word count:</strong> {basicPrompt.split(' ').length} words</p>
              <p><strong>Context provided:</strong> Minimal</p>
              <p><strong>Professional expertise:</strong> Not leveraged</p>
            </div>
          </div>

          {/* After */}
          <div className="order-1 lg:order-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="bg-green-500 text-white p-2 rounded-lg mr-3">
                <Zap className="w-5 h-5" />
              </div>
              Your Expertise-Enhanced Prompt
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 h-64 overflow-y-auto">
              <pre className="text-gray-800 whitespace-pre-wrap text-sm">{improvedPrompt}</pre>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Word count:</strong> {improvedPrompt.split(' ').length} words</p>
              <p><strong>Context provided:</strong> Rich professional insight</p>
              <p><strong>Human expertise applied:</strong> Professional knowledge driving AI collaboration</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">4D Framework Improvements Applied</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedImprovements.product.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  Product ({selectedImprovements.product.length})
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {selectedImprovements.product.map(id => {
                    const item = improvementSuggestions.product.find(i => i.id === id);
                    return <li key={id}>• {item?.text}</li>;
                  })}
                </ul>
              </div>
            )}
            {selectedImprovements.process.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Settings className="w-4 h-4 mr-1" />
                  Process ({selectedImprovements.process.length})
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {selectedImprovements.process.map(id => {
                    const item = improvementSuggestions.process.find(i => i.id === id);
                    return <li key={id}>• {item?.text}</li>;
                  })}
                </ul>
              </div>
            )}
            {selectedImprovements.performance.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Performance ({selectedImprovements.performance.length})
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {selectedImprovements.performance.map(id => {
                    const item = improvementSuggestions.performance.find(i => i.id === id);
                    return <li key={id}>• {item?.text}</li>;
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => copyPrompt(improvedPrompt)}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Improved Prompt'}
          </button>
          <button
            onClick={resetTool}
            className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Try Another Prompt
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-semibold text-yellow-800 mb-3">Next Steps - You&apos;re in Control:</h4>
          <ol className="list-decimal list-inside text-yellow-700 space-y-2 text-sm">
            <li>Copy your expertise-enhanced prompt and use it with Claude, ChatGPT, or your preferred AI tool</li>
            <li>Notice how AI responds differently when you bring your professional knowledge to the collaboration</li>
            <li>Practice discernment: evaluate the AI&apos;s output using your expertise and experience</li>
            <li>Continue refining how you direct AI to work for you, not the other way around</li>
          </ol>
        </div>
      </div>
    );
  }
};

export default LivePromptImprovementTool;