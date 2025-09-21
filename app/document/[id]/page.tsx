'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Download, Mail, CheckCircle } from 'lucide-react';

interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setDocumentId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!documentId) return;
    
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/document?id=${documentId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load document');
        }

        setContent(data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  const copyToClipboard = async () => {
    if (content) {
      try {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const emailDocument = () => {
    if (content) {
      const subject = encodeURIComponent('Essential Human Capabilities in AI Fluency Document');
      const body = encodeURIComponent(`Here is my Essential Human Capabilities in AI Fluency document:\n\n${content}\n\nGenerated using the AI Fluency Framework tool.`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">Document Not Found</h2>
            <p className="text-red-700">{error}</p>
            <p className="text-red-600 text-sm mt-2">
              Documents are only available for 24 hours after creation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Essential Human Capabilities in AI Fluency
          </h1>
          <p className="text-gray-600">Generated using the AI Fluency Framework tool</p>
        </div>

        <div className="prose prose-gray max-w-none mb-8">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {content}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </button>

            <button
              onClick={emailDocument}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email to Myself
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}