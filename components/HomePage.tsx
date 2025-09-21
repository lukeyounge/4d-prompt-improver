'use client';

import React from 'react';
import Link from 'next/link';
import { Users, MessageSquare, ArrowRight, Target, Settings, Gamepad2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          AI Fluency for School Leaders
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master the 4D Framework to transform how you work with AI.
          Build fluency through interactive experiences designed for educational leaders.
        </p>
      </div>

      {/* Framework Overview */}
      <div className="mb-16 bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          The 4D Framework for AI Fluency
        </h3>
        <p className="text-gray-600 text-center mb-8">
          A systematic approach to working effectively with AI in educational settings
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">D1</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Discernment</h4>
            <p className="text-sm text-gray-600">When and what to delegate to AI</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold text-lg">D2</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600">How to communicate effectively with AI</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold text-lg">D3</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Design</h4>
            <p className="text-sm text-gray-600">Creating AI-enhanced workflows</p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 font-bold text-lg">D4</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Delivery</h4>
            <p className="text-sm text-gray-600">Implementing and scaling AI solutions</p>
          </div>
        </div>
      </div>

      {/* Tool Options */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Delegation Game Card */}
        <Link href="/delegate" className="group">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Delegation Game</h2>
                <p className="text-blue-700 font-medium">Interactive Decision Making</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Practice the art of delegation with AI through engaging scenarios.
              Learn when to delegate tasks to AI and when human expertise is essential.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Gamepad2 className="w-4 h-4 mr-2 text-blue-500" />
                <span>Interactive scenarios with real-time feedback</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                <span>Perfect for team training sessions</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Target className="w-4 h-4 mr-2 text-blue-500" />
                <span>Build delegation confidence and judgment</span>
              </div>
            </div>

            <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
              <span>Start Playing</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Description Tool Card */}
        <Link href="/prompts" className="group">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 hover:border-green-300 hover:shadow-lg transition-all duration-300 h-full">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-lg mr-4 group-hover:bg-green-200 transition-colors">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-900">Description Tools</h2>
                <p className="text-green-700 font-medium">Enhance Your AI Communication</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Transform basic prompts into powerful AI collaborations using the 3P Framework.
              Learn to describe what you want, how you want it done, and how to work together.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Target className="w-4 h-4 mr-2 text-green-500" />
                <span>Product Description: Define clear outcomes</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Settings className="w-4 h-4 mr-2 text-green-500" />
                <span>Process Description: Guide AI's approach</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
                <span>Performance Description: Shape collaboration style</span>
              </div>
            </div>

            <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
              <span>Explore Description</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>


      {/* Call to Action */}
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Ready to transform how you work with AI?
        </p>
        <p className="text-sm text-gray-500">
          Choose your path above to begin building AI fluency that enhances your professional expertise.
        </p>
      </div>
    </div>
  );
}