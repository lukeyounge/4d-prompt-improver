'use client';

import React from 'react';
import Link from 'next/link';
import { Users, MessageSquare, ArrowRight, Target, Settings, Gamepad2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            AI Fluency for School Leaders
          </h1>
        </div>

        {/* Tool Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Delegation Game Card */}
          <Link href="/delegate" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">AI can help with that!</h2>
                  <p className="text-gray-600">Practicing delegation</p>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                  <span>Start Playing</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Description Tool Card */}
          <Link href="/prompts" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Communicate better</h2>
                  <p className="text-gray-600">Practicing description and some discernment</p>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center text-green-600 font-medium group-hover:text-green-700">
                  <span>Explore Description</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}