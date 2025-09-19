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
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiResponses, setApiResponses] = useState<{
    basicResponse: string;
    enhancedResponse: string;
  } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [improvementInputs, setImprovementInputs] = useState<{[key: string]: string}>({});
  const [loadingHelp, setLoadingHelp] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<{[key: string]: string}>({});

  const improvementSuggestions = {
    product: [
      {
        id: 'context',
        technique: 'Give Context',
        text: 'What do you need and why? Share background that helps the AI understand your situation.',
        placeholder: 'Example: Create a lesson plan for teaching photosynthesis to Grade 10 biology students. This is important because they struggled with cellular respiration last week and need to see the connection. Background: 70% English learners, prefer hands-on activities, 45-minute periods, limited lab equipment.'
      },
      {
        id: 'examples',
        technique: 'Show Examples',
        text: 'Show what you want. Describe the format, style, or type of output you\'re looking for.',
        placeholder: 'Example: I want the lesson plan formatted like this: 1) Hook (5 min engaging question), 2) Direct instruction (15 min with visuals), 3) Guided practice (20 min hands-on activity), 4) Closure (5 min exit ticket). Use simple, clear language appropriate for ELL students.'
      },
      {
        id: 'constraints',
        technique: 'Specify Constraints',
        text: 'What are your requirements? List any limits, formats, or must-haves the AI should follow.',
        placeholder: 'Example: The lesson plan must: be exactly 45 minutes, include 3 differentiation strategies, align with NGSS standard 5-LS1-1, use materials costing under $20, include formative assessment, be accessible for students with disabilities.'
      },
      {
        id: 'steps',
        technique: 'Break Into Steps',
        text: 'How should the AI approach this? Walk it through the steps or process you want it to follow.',
        placeholder: 'Example: First, consider what students already know about plants from previous units. Then, identify the most important concepts to focus on. Next, choose activities that connect to their lives. Finally, design an assessment that shows real understanding, not just memorization.'
      },
      {
        id: 'thinking',
        technique: 'Ask AI to Think First',
        text: 'What should the AI consider first? Ask it to think through key questions before responding.',
        placeholder: 'Example: Before creating the lesson plan, think about: What misconceptions do students typically have about photosynthesis? How can I make this abstract process feel concrete and relevant? What prior knowledge can I build on? How will I know if students truly understand vs. just memorized?'
      },
      {
        id: 'role',
        technique: 'Define AI Role/Tone',
        text: 'How should the AI communicate? Tell it what role to play and what tone to use.',
        placeholder: 'Example: Act as an experienced biology teacher who specializes in ELL instruction. Be collaborative and practical - offer options rather than lecture. Keep explanations brief and focus on what will actually work in my classroom. Ask clarifying questions if you need more details.'
      }
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
      const productInputs = selectedImprovements.product.map(id => ({
        id,
        input: improvementInputs[id],
        technique: improvementSuggestions.product.find(item => item.id === id)?.technique
      })).filter(item => item.input && item.input.trim());

      if (productInputs.some(item => item.id === 'context')) {
        const contextInput = productInputs.find(item => item.id === 'context');
        sections.push('\n**Context & Request:**');
        sections.push(`${contextInput.input}`);
      }

      if (productInputs.some(item => item.id === 'examples')) {
        const examplesInput = productInputs.find(item => item.id === 'examples');
        sections.push('\n**Examples to Follow:**');
        sections.push(`${examplesInput.input}`);
      }

      if (productInputs.some(item => item.id === 'constraints')) {
        const constraintsInput = productInputs.find(item => item.id === 'constraints');
        sections.push('\n**Constraints:**');
        sections.push(`${constraintsInput.input}`);
      }

      if (productInputs.some(item => item.id === 'steps')) {
        const stepsInput = productInputs.find(item => item.id === 'steps');
        sections.push('\n**Step-by-Step Approach:**');
        sections.push(`${stepsInput.input}`);
      }

      if (productInputs.some(item => item.id === 'thinking')) {
        const thinkingInput = productInputs.find(item => item.id === 'thinking');
        sections.push('\n**Think First:**');
        sections.push(`${thinkingInput.input}`);
      }

      if (productInputs.some(item => item.id === 'role')) {
        const roleInput = productInputs.find(item => item.id === 'role');
        sections.push('\n**AI Role & Communication:**');
        sections.push(`${roleInput.input}`);
      }
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
    setApiResponses(null);
    setApiError(null);
    setIsGenerating(false);
  };

  const generateComparison = async () => {
    setIsGenerating(true);
    setApiError(null);

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basicPrompt: basicPrompt,
          enhancedPrompt: improvedPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate responses');
      }

      const data = await response.json();
      setApiResponses({
        basicResponse: data.basicResponse.text,
        enhancedResponse: data.enhancedResponse.text,
      });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalSelected = Object.values(selectedImprovements).flat().length;
  const totalWithInput = Object.values(selectedImprovements).flat().filter(id =>
    improvementInputs[id] && improvementInputs[id].trim()
  ).length;

  if (currentStep === 'basic') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Communication for School Leaders</h1>
          <p className="text-xl text-gray-700 mb-6">Master the Description phase of the 4D Framework</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Beyond Writing Prompts: Creating Collaborative Communication</h2>

          <p className="text-gray-800 mb-6 text-lg">Description goes beyond simply writing great prompts. It's about creating a collaborative environment where both you and the AI can work effectively together as interactive partners.</p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm font-medium">
              <strong>Remember:</strong> AI can't read your mind. The quality of your results often comes down to how clearly you articulate your needs, preferred approach, and desired interaction style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 border border-blue-100 shadow-sm">
              <div className="bg-blue-500 text-white p-3 rounded-lg mb-4 w-12 h-12 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Description</h3>
              <p className="text-gray-600 text-sm">Clearly define what you want in terms of outputs, format, audience, and style. Be specific about the end result.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-green-100 shadow-sm">
              <div className="bg-green-500 text-white p-3 rounded-lg mb-4 w-12 h-12 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Description</h3>
              <p className="text-gray-600 text-sm">Guide how the AI approaches your request. The methodology can be as important as the end goal.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-purple-100 shadow-sm">
              <div className="bg-purple-500 text-white p-3 rounded-lg mb-4 w-12 h-12 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Description</h3>
              <p className="text-gray-600 text-sm">Define behavioral aspects: Should the AI be concise or detailed? Challenging or supportive? Match your leadership style.</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>Key Insight:</strong> AI systems are interactive partners, not databases or vending machines. Clear communication upfront saves time and leads to better results.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Practice the Three Components</h2>
          <p className="text-gray-700 mb-4">Start with any request you'd make to an AI system. We'll guide you through describing the Product, Process, and Performance to create more effective collaboration.</p>

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

        </div>

        {/* Product Description Section */}
        {basicPrompt.trim() && (
          <div className="bg-white border border-blue-500 rounded-lg p-6 mb-8 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 text-white p-2 rounded-lg mr-3">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">What do you want?</h3>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Product Description</h4>
                <p className="text-sm text-blue-600">Use some or all of the six foundational techniques to structure your communication with AI</p>
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
                        <div className="flex items-center mb-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mr-2">
                            {improvement.technique}
                          </span>
                        </div>
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
        )}

        {/* Prompt Preview */}
        {basicPrompt.trim() && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Evolving Prompt</h3>
            <div className="bg-white rounded-lg p-4 border border-gray-300">
              <div className="text-gray-800 whitespace-pre-wrap">
                {(() => {
                  const sections = [basicPrompt];

                  const productInputs = selectedImprovements.product.map(id => ({
                    id,
                    input: improvementInputs[id],
                    technique: improvementSuggestions.product.find(item => item.id === id)?.technique
                  })).filter(item => item.input && item.input.trim());

                  if (productInputs.some(item => item.id === 'context')) {
                    const contextInput = productInputs.find(item => item.id === 'context');
                    sections.push('\n**Context & Request:**');
                    sections.push(`${contextInput.input}`);
                  }

                  if (productInputs.some(item => item.id === 'examples')) {
                    const examplesInput = productInputs.find(item => item.id === 'examples');
                    sections.push('\n**Examples to Follow:**');
                    sections.push(`${examplesInput.input}`);
                  }

                  if (productInputs.some(item => item.id === 'constraints')) {
                    const constraintsInput = productInputs.find(item => item.id === 'constraints');
                    sections.push('\n**Constraints:**');
                    sections.push(`${constraintsInput.input}`);
                  }

                  if (productInputs.some(item => item.id === 'steps')) {
                    const stepsInput = productInputs.find(item => item.id === 'steps');
                    sections.push('\n**Step-by-Step Approach:**');
                    sections.push(`${stepsInput.input}`);
                  }

                  if (productInputs.some(item => item.id === 'thinking')) {
                    const thinkingInput = productInputs.find(item => item.id === 'thinking');
                    sections.push('\n**Think First:**');
                    sections.push(`${thinkingInput.input}`);
                  }

                  if (productInputs.some(item => item.id === 'role')) {
                    const roleInput = productInputs.find(item => item.id === 'role');
                    sections.push('\n**AI Role & Communication:**');
                    sections.push(`${roleInput.input}`);
                  }

                  return sections.join('\n');
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {basicPrompt.trim() && (
          <div className="text-center">
            <button
              onClick={handleBasicPromptSubmit}
              disabled={!basicPrompt.trim()}
              className="flex items-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg font-semibold mx-auto"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Continue to Process & Performance
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (currentStep === 'improve') {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Process & Performance Description</h1>
          <p className="text-gray-600">Complete your AI communication setup by defining how you want the AI to work and interact with you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Original Prompt */}
          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Enhanced Prompt</h3>
              <div className="bg-white rounded p-4 border max-h-96 overflow-y-auto">
                <div className="text-gray-800 whitespace-pre-wrap text-sm">
                  {(() => {
                    const sections = [basicPrompt];

                    const productInputs = selectedImprovements.product.map(id => ({
                      id,
                      input: improvementInputs[id],
                      technique: improvementSuggestions.product.find(item => item.id === id)?.technique
                    })).filter(item => item.input && item.input.trim());

                    if (productInputs.some(item => item.id === 'context')) {
                      const contextInput = productInputs.find(item => item.id === 'context');
                      sections.push('\n**Context & Request:**');
                      sections.push(`${contextInput.input}`);
                    }

                    if (productInputs.some(item => item.id === 'examples')) {
                      const examplesInput = productInputs.find(item => item.id === 'examples');
                      sections.push('\n**Examples to Follow:**');
                      sections.push(`${examplesInput.input}`);
                    }

                    if (productInputs.some(item => item.id === 'constraints')) {
                      const constraintsInput = productInputs.find(item => item.id === 'constraints');
                      sections.push('\n**Constraints:**');
                      sections.push(`${constraintsInput.input}`);
                    }

                    if (productInputs.some(item => item.id === 'steps')) {
                      const stepsInput = productInputs.find(item => item.id === 'steps');
                      sections.push('\n**Step-by-Step Approach:**');
                      sections.push(`${stepsInput.input}`);
                    }

                    if (productInputs.some(item => item.id === 'thinking')) {
                      const thinkingInput = productInputs.find(item => item.id === 'thinking');
                      sections.push('\n**Think First:**');
                      sections.push(`${thinkingInput.input}`);
                    }

                    if (productInputs.some(item => item.id === 'role')) {
                      const roleInput = productInputs.find(item => item.id === 'role');
                      sections.push('\n**AI Role & Communication:**');
                      sections.push(`${roleInput.input}`);
                    }

                    return sections.join('\n');
                  })()}
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Zap className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800">Improvements Selected: {totalSelected}</h4>
              </div>
              <p className="text-green-700 text-sm">
                Complete the final components of effective AI communication. These define how the AI works and interacts with you.
              </p>
            </div>
          </div>

          {/* Right: Process & Performance */}
          <div className="space-y-6">

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

        {/* API Comparison Section */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            See the Difference in Action
          </h3>
          <p className="text-purple-800 mb-4">
            Want to see how much better your enhanced prompt really is? Let's send both prompts to Claude and compare the actual responses.
          </p>

          {!apiResponses && !isGenerating && (
            <button
              onClick={generateComparison}
              disabled={isGenerating}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Generate Live Comparison
            </button>
          )}

          {isGenerating && (
            <div className="flex items-center text-purple-800">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-800 mr-2"></div>
              Generating responses from Claude...
            </div>
          )}

          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-medium">Error: {apiError}</p>
              <button
                onClick={generateComparison}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {apiResponses && (
            <div className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Response */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="bg-gray-400 text-white p-2 rounded-lg mr-3">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    Basic Prompt Response
                  </h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 h-80 overflow-y-auto">
                    <div className="text-gray-800 whitespace-pre-wrap text-sm">
                      {apiResponses.basicResponse}
                    </div>
                  </div>
                </div>

                {/* Enhanced Response */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="bg-green-500 text-white p-2 rounded-lg mr-3">
                      <Zap className="w-4 h-4" />
                    </div>
                    Enhanced Prompt Response
                  </h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 h-80 overflow-y-auto">
                    <div className="text-gray-800 whitespace-pre-wrap text-sm">
                      {apiResponses.enhancedResponse}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-purple-800 font-medium">
                  ✨ Notice how the enhanced prompt produces more targeted, detailed, and useful results!
                </p>
              </div>
            </div>
          )}
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