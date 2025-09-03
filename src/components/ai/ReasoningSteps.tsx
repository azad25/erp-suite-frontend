'use client';

import React from 'react';

interface ReasoningStep {
  step_number: number;
  step_type: string;
  title: string;
  description: string;
  source: string;
  status: string;
  data?: any;
  timestamp: string;
  processing_time?: number;
  icon: string;
}

interface ReasoningStepsProps {
  steps: ReasoningStep[];
  isStreaming?: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <span className="text-green-500 animate-bounce">✓</span>;
    case 'failed':
      return <span className="text-red-500 animate-pulse">✗</span>;
    case 'in_progress':
    case 'processing':
      return (
        <span className="text-blue-500 animate-spin inline-block">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      );
    default:
      return <span className="text-gray-400 animate-pulse">○</span>;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'in_progress':
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

export function ReasoningSteps({ steps, isStreaming = false }: ReasoningStepsProps) {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">AI Reasoning Process</span>
        {isStreaming && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
            <span className="animate-pulse mr-1">⟳</span>
            Streaming
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg border-l-4 border-l-blue-500 bg-white shadow-sm transform transition-all duration-300 hover:shadow-md animate-fadeInUp"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="p-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <span className="text-lg animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>
                    {step.icon}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">
                      Step {step.step_number}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(step.status)}`}>
                      {getStatusIcon(step.status)}
                      <span className="ml-1 capitalize">{step.status}</span>
                    </span>
                    {step.processing_time && (
                      <span className="text-xs text-gray-400">
                        {step.processing_time.toFixed(2)}s
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-sm text-gray-900 mb-1">
                    {step.title}
                  </h4>
                  
                  <p className="text-xs text-gray-600 mb-2">
                    {step.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Source:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                      {step.source}
                    </span>
                  </div>
                  
                  {step.data && Object.keys(step.data).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                        View step data
                      </summary>
                      <pre className="mt-1 text-xs bg-gray-50 p-2 rounded border overflow-x-auto">
                        {JSON.stringify(step.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {isStreaming && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 animate-pulse">
          <span className="animate-spin inline-block">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          <span className="animate-pulse">Processing your request step by step...</span>
        </div>
      )}
    </div>
  );
}
