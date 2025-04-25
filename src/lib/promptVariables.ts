// 提取提示词中的变量
export function extractVariables(content: string): string[] {
  const regex = /\{\{([^{}]+)\}\}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    // 确保变量名不重复
    if (!variables.includes(match[1].trim())) {
      variables.push(match[1].trim());
    }
  }

  return variables;
}

// 替换提示词中的变量
export function replaceVariables(content: string, variables: Record<string, string>): string {
  let result = content;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
}
