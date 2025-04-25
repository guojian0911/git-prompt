import React from 'react';

// 高亮提示词中的变量
export function highlightVariables(content: string): React.ReactNode[] {
  const regex = /(\{\{[^{}]+\}\})/g;
  const parts = content.split(regex);
  
  return parts.map((part, index) => {
    if (part.match(regex)) {
      // 这是一个变量，高亮显示
      return (
        <span 
          key={index} 
          className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-1 rounded"
        >
          {part}
        </span>
      );
    }
    // 普通文本
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
