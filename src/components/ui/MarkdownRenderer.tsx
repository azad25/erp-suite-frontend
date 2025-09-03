"use client";

import React from 'react';
import type { JSX } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const formatText = (text: string): React.JSX.Element => {
    const lines = text.split('\n');
    const elements: React.JSX.Element[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6 first:mt-0 border-b border-gray-200 dark:border-gray-700 pb-2">
            {formatInline(line.substring(2))}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-5 first:mt-0">
            {formatInline(line.substring(3))}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4 first:mt-0">
            {formatInline(line.substring(4))}
          </h3>
        );
      }
      // Code blocks
      else if (line.startsWith('```')) {
        const codeLines: string[] = [];
        i++; // Skip opening ```
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4 border border-gray-200 dark:border-gray-700">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic">
            {formatInline(line.substring(2))}
          </blockquote>
        );
      }
      // Lists
      else if (line.match(/^\d+\.\s/) || line.startsWith('- ') || line.startsWith('* ')) {
        const listItems: React.JSX.Element[] = [];
        const isOrdered = line.match(/^\d+\.\s/);
        
        while (i < lines.length && (lines[i].match(/^\d+\.\s/) || lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
          const itemText = isOrdered 
            ? lines[i].replace(/^\d+\.\s/, '')
            : lines[i].substring(2);
          
          listItems.push(
            <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {formatInline(itemText)}
            </li>
          );
          i++;
        }
        i--; // Back up one
        
        if (isOrdered) {
          elements.push(
            <ol key={i} className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1 ml-4">
              {listItems}
            </ol>
          );
        } else {
          elements.push(
            <ul key={i} className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1 ml-4">
              {listItems}
            </ul>
          );
        }
      }
      // Regular paragraphs
      else if (line.trim()) {
        elements.push(
          <p key={i} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {formatInline(line)}
          </p>
        );
      }
    }

    return <>{elements}</>;
  };

  const formatInline = (text: string): React.ReactNode => {
    // Handle bold, italic, code, and links
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-gray-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return (
          <em key={index} className="italic text-gray-700 dark:text-gray-300">
            {part.slice(1, -1)}
          </em>
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">
            {part.slice(1, -1)}
          </code>
        );
      } else if (part.match(/\[[^\]]+\]\([^)]+\)/)) {
        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          return (
            <a key={index} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors">
              {match[1]}
            </a>
          );
        }
      }
      return part;
    });
  };

  return (
    <div className={`markdown-content ${className}`}>
      {formatText(content)}
    </div>
  );
};

export default MarkdownRenderer;
