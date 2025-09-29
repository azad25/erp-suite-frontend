"use client";

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const formatText = (text: string): React.JSX.Element => {
    if (!text || typeof text !== 'string') {
      return <></>;
    }

    const lines = text.split('\n');
    const elements: React.JSX.Element[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        if (!inCodeBlock) {
          // Starting code block
          inCodeBlock = true;
          codeLanguage = trimmedLine.substring(3).trim();
          const codeLines: string[] = [];
          i++; // Skip opening ```
          
          while (i < lines.length && !lines[i].trim().startsWith('```')) {
            codeLines.push(lines[i]);
            i++;
          }
          
          const codeContent = codeLines.join('\n');
          elements.push(
            <div key={`code-${i}`} className="mb-4 relative group">
              {codeLanguage && (
                <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-t-lg border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
                  <span>{codeLanguage}</span>
                  <button
                    onClick={() => navigator.clipboard?.writeText(codeContent)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                    title="Copy code"
                  >
                    Copy
                  </button>
                </div>
              )}
              <pre className={`bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 text-sm font-mono overflow-x-auto border border-gray-200 dark:border-gray-700 ${codeLanguage ? 'rounded-b-lg' : 'rounded-lg'} relative`}>
                <code>{codeContent}</code>
                {!codeLanguage && (
                  <button
                    onClick={() => navigator.clipboard?.writeText(codeContent)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    title="Copy code"
                  >
                    Copy
                  </button>
                )}
              </pre>
            </div>
          );
          inCodeBlock = false;
        }
        continue;
      }

      if (inCodeBlock) continue;

      // Headers with better styling
      if (trimmedLine.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-6 first:mt-0 border-b border-gray-200 dark:border-gray-700 pb-2">
            {formatInline(trimmedLine.substring(2))}
          </h1>
        );
      } else if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-5 first:mt-0">
            {formatInline(trimmedLine.substring(3))}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-base font-medium text-gray-900 dark:text-white mb-2 mt-4 first:mt-0">
            {formatInline(trimmedLine.substring(4))}
          </h3>
        );
      } else if (trimmedLine.startsWith('#### ')) {
        elements.push(
          <h4 key={`h4-${i}`} className="text-sm font-medium text-gray-900 dark:text-white mb-2 mt-3 first:mt-0">
            {formatInline(trimmedLine.substring(5))}
          </h4>
        );
      }
      // Blockquotes
      else if (trimmedLine.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('> ')) {
          quoteLines.push(lines[i].trim().substring(2));
          i++;
        }
        i--; // Back up one
        
        elements.push(
          <blockquote key={`quote-${i}`} className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic rounded-r-lg">
            {quoteLines.map((quoteLine, idx) => (
              <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                {formatInline(quoteLine)}
              </p>
            ))}
          </blockquote>
        );
      }
      // Lists with better handling
      else if (trimmedLine.match(/^(\d+\.|\-|\*|\+)\s/)) {
        const listItems: React.JSX.Element[] = [];
        const isOrdered = trimmedLine.match(/^\d+\.\s/);
        const startIndex = i;
        
        while (i < lines.length) {
          const currentLine = lines[i].trim();
          if (!currentLine.match(/^(\d+\.|\-|\*|\+)\s/)) {
            break;
          }
          
          const itemText = isOrdered 
            ? currentLine.replace(/^\d+\.\s/, '')
            : currentLine.replace(/^[\-\*\+]\s/, '');
          
          listItems.push(
            <li key={`li-${i}`} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-1">
              {formatInline(itemText)}
            </li>
          );
          i++;
        }
        i--; // Back up one
        
        if (isOrdered) {
          elements.push(
            <ol key={`ol-${startIndex}`} className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1 ml-4 pl-2">
              {listItems}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`ul-${startIndex}`} className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1 ml-4 pl-2">
              {listItems}
            </ul>
          );
        }
      }
      // Horizontal rules
      else if (trimmedLine.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
        elements.push(
          <hr key={`hr-${i}`} className="border-gray-300 dark:border-gray-600 my-6" />
        );
      }
      // Tables (basic support)
      else if (trimmedLine.includes('|') && trimmedLine.split('|').length > 2) {
        const tableRows: string[][] = [];
        let tableStartIndex = i;
        
        while (i < lines.length && lines[i].trim().includes('|')) {
          const row = lines[i].trim().split('|').map(cell => cell.trim()).filter(cell => cell);
          if (row.length > 0) {
            tableRows.push(row);
          }
          i++;
        }
        i--; // Back up one
        
        if (tableRows.length > 0) {
          elements.push(
            <div key={`table-${tableStartIndex}`} className="mb-4 overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {tableRows[0].map((header, idx) => (
                      <th key={idx} className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                        {formatInline(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {tableRows.slice(1).map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                          {formatInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }
      // Empty lines for spacing
      else if (!trimmedLine) {
        // Add spacing between elements
        if (elements.length > 0) {
          const lastElement = elements[elements.length - 1];
          if (lastElement && !lastElement.key?.toString().includes('space')) {
            elements.push(<div key={`space-${i}`} className="h-2" />);
          }
        }
      }
      // Task lists (GitHub style)
      else if (trimmedLine.match(/^[\-\*\+]\s\[(x| )\]/)) {
        const taskItems: React.JSX.Element[] = [];
        const startIndex = i;
        
        while (i < lines.length) {
          const currentLine = lines[i].trim();
          const taskMatch = currentLine.match(/^[\-\*\+]\s\[(x| )\]\s(.+)/);
          if (!taskMatch) break;
          
          const isChecked = taskMatch[1] === 'x';
          const taskText = taskMatch[2];
          
          taskItems.push(
            <li key={`task-${i}`} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300 leading-relaxed mb-1">
              <input 
                type="checkbox" 
                checked={isChecked} 
                readOnly 
                className="mt-1 rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500"
              />
              <span className={isChecked ? 'line-through opacity-60' : ''}>
                {formatInline(taskText)}
              </span>
            </li>
          );
          i++;
        }
        i--; // Back up one
        
        elements.push(
          <ul key={`tasklist-${startIndex}`} className="space-y-1 mb-4">
            {taskItems}
          </ul>
        );
      }
      // Regular paragraphs
      else if (trimmedLine) {
        elements.push(
          <p key={`p-${i}`} className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {formatInline(line)}
          </p>
        );
      }
    }

    return <>{elements}</>;
  };

  const formatInline = (text: string): React.ReactNode => {
    if (!text) return '';
    
    // Enhanced regex to handle nested formatting and edge cases
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|~~[^~]+~~|==([^=]+)==)/);
    
    return parts.map((part, index) => {
      // Bold text
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={index} className="font-bold text-gray-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      } 
      // Italic text (but not bold)
      else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**') && part.length > 2) {
        return (
          <em key={index} className="italic text-gray-700 dark:text-gray-300">
            {part.slice(1, -1)}
          </em>
        );
      } 
      // Strikethrough
      else if (part.startsWith('~~') && part.endsWith('~~') && part.length > 4) {
        return (
          <del key={index} className="line-through text-gray-500 dark:text-gray-400">
            {part.slice(2, -2)}
          </del>
        );
      }
      // Highlight
      else if (part.startsWith('==') && part.endsWith('==') && part.length > 4) {
        return (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
            {part.slice(2, -2)}
          </mark>
        );
      }
      // Inline code
      else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200 dark:border-gray-700">
            {part.slice(1, -1)}
          </code>
        );
      } 
      // Links
      else if (part.match(/\[[^\]]+\]\([^)]+\)/)) {
        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          return (
            <a 
              key={index} 
              href={match[2]} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors font-medium"
            >
              {match[1]}
            </a>
          );
        }
      }
      
      return part;
    });
  };

  return (
    <div className={`markdown-content prose prose-sm max-w-none prose-gray dark:prose-invert ${className}`}>
      {formatText(content)}
    </div>
  );
};

export default MarkdownRenderer;
