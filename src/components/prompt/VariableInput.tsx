import React, { useState, useEffect } from "react";
import { extractVariables } from "@/lib/modelUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Variable } from "lucide-react";

interface VariableInputProps {
  prompt: string;
  onChange: (variables: Record<string, string>) => void;
}

const VariableInput: React.FC<VariableInputProps> = ({ prompt, onChange }) => {
  // 变量值状态
  const [values, setValues] = useState<Record<string, string>>({});
  // 存储提取的变量
  const [variables, setVariables] = useState<string[]>([]);

  // 提取变量并初始化变量值
  useEffect(() => {
    // 提取变量
    const extractedVars = extractVariables(prompt);
    setVariables(extractedVars);

    // 初始化变量值 - 使用函数式更新以避免依赖values
    setValues(prevValues => {
      const initialValues: Record<string, string> = {};
      extractedVars.forEach(variable => {
        initialValues[variable] = prevValues[variable] || "";
      });
      return initialValues;
    });
  }, [prompt]); // 只在prompt变化时重新初始化

  // 处理变量值变化
  const handleVariableChange = (variable: string, value: string) => {
    const newValues = { ...values, [variable]: value };
    setValues(newValues);
    onChange(newValues);
  };

  // 如果没有变量，不渲染任何内容
  if (variables.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-4 border border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50 dark:bg-purple-900/20">
      <div className="flex items-center gap-2 mb-3 text-purple-700 dark:text-purple-300">
        <Variable className="h-5 w-5" />
        <h4 className="font-medium">自定义变量</h4>
      </div>
      <div className="grid gap-3">
        {variables.map((variable) => (
          <div key={variable} className="grid gap-1.5">
            <Label htmlFor={`var-${variable}`} className="text-sm text-purple-700 dark:text-purple-300">
              {variable}
            </Label>
            <Input
              id={`var-${variable}`}
              value={values[variable] || ""}
              onChange={(e) => handleVariableChange(variable, e.target.value)}
              placeholder={`输入 ${variable} 的值...`}
              className="border-purple-200 dark:border-purple-800 focus-visible:ring-purple-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariableInput;
