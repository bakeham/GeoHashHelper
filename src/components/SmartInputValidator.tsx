/**
 * 智能输入验证组件
 * 提供实时输入验证、错误提示和修正建议
 */

'use client';

import React, { useMemo } from 'react';
import { validateGeohash, ValidationResult } from '../lib/input-validator';

interface SmartInputValidatorProps {
  value: string;
  isBatchMode: boolean;
  coordinateSystem: 'BD09' | 'GPS84';
  className?: string;
}

interface ValidationSuggestion {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  suggestion?: string;
  correctedValue?: string;
}

// 精度描述函数
const getPrecisionDescription = (length: number): string => {
  const precisionMap: Record<number, string> = {
    1: '±2500公里',
    2: '±630公里',
    3: '±78公里',
    4: '±20公里',
    5: '±2.4公里',
    6: '±610米',
    7: '±76米',
    8: '±19米',
    9: '±2.4米',
    10: '±60厘米',
    11: '±7.5厘米',
    12: '±1.9厘米'
  };
  
  return precisionMap[length] || '精度未知';
};

// 智能建议函数
const getSmartSuggestion = (input: string, result: ValidationResult): string => {
  if (!result.error) return '';

  // 检查常见错误模式
  if (result.error.includes('无效字符')) {
    const invalidChars = input.match(/[ailo]/gi);
    if (invalidChars) {
      return `发现禁用字符: ${invalidChars.join(', ')}。GeoHash不能包含 a, i, l, o`;
    }
    
    const otherInvalid = input.match(/[^0-9b-z]/gi);
    if (otherInvalid) {
      return `发现无效字符: ${otherInvalid.join(', ')}。只能使用 0-9, b-z`;
    }
  }

  if (result.error.includes('长度')) {
    if (input.length > 12) {
      return 'GeoHash过长，请截取前12位';
    }
    if (input.length === 0) {
      return '请输入GeoHash字符串';
    }
  }

  return '请检查GeoHash格式，参考示例进行输入';
};

// 修正建议函数
const suggestCorrection = (input: string): string | null => {
  if (!input) return null;

  let corrected = input.toLowerCase();
  
  // 替换常见错误字符
  const replacements: Record<string, string> = {
    'a': '0',
    'i': '1',
    'l': '1',
    'o': '0'
  };

  let hasChanges = false;
  for (const [invalid, valid] of Object.entries(replacements)) {
    if (corrected.includes(invalid)) {
      corrected = corrected.replace(new RegExp(invalid, 'g'), valid);
      hasChanges = true;
    }
  }

  // 移除其他无效字符
  const cleaned = corrected.replace(/[^0-9b-z]/g, '');
  if (cleaned !== corrected) {
    corrected = cleaned;
    hasChanges = true;
  }

  // 限制长度
  if (corrected.length > 12) {
    corrected = corrected.substring(0, 12);
    hasChanges = true;
  }

  return hasChanges && corrected.length > 0 ? corrected : null;
};

const SmartInputValidator: React.FC<SmartInputValidatorProps> = ({
  value,
  isBatchMode,
  coordinateSystem,
  className = ''
}) => {
  const validationResults = useMemo(() => {
    if (!value.trim()) {
      return {
        suggestions: [],
        overallStatus: 'empty' as const
      };
    }

    const suggestions: ValidationSuggestion[] = [];
    let overallStatus: 'success' | 'warning' | 'error' = 'success';

    if (isBatchMode) {
      // 批量模式验证
      const lines = value.split(/[\n,]/).map(line => line.trim()).filter(line => line.length > 0);
      
      if (lines.length === 0) {
        return {
          suggestions: [],
          overallStatus: 'empty' as const
        };
      }

      let validCount = 0;
      let invalidCount = 0;
      const sampleErrors: string[] = [];

      lines.forEach((line, index) => {
        const result = validateGeohash(line);
        if (result.isValid) {
          validCount++;
        } else {
          invalidCount++;
          if (sampleErrors.length < 3) {
            sampleErrors.push(`第${index + 1}行: ${line} - ${result.error}`);
          }
        }
      });

      // 批量验证结果
      if (invalidCount === 0) {
        suggestions.push({
          type: 'success',
          message: `所有 ${validCount} 个GeoHash格式正确`
        });
      } else if (invalidCount < validCount) {
        overallStatus = 'warning';
        suggestions.push({
          type: 'warning',
          message: `${validCount} 个有效，${invalidCount} 个无效`,
          suggestion: '建议修正无效项目后再转换'
        });
        
        // 显示示例错误
        sampleErrors.forEach(error => {
          suggestions.push({
            type: 'error',
            message: error
          });
        });
      } else {
        overallStatus = 'error';
        suggestions.push({
          type: 'error',
          message: `大部分GeoHash格式无效 (${invalidCount}/${lines.length})`,
          suggestion: '请检查输入格式或参考示例'
        });
      }

      // 数量提示
      if (lines.length > 1000) {
        suggestions.push({
          type: 'warning',
          message: `输入数量较多 (${lines.length} 个)`,
          suggestion: '大量数据将分批处理，可能需要较长时间'
        });
      }

    } else {
      // 单个模式验证
      const result = validateGeohash(value.trim());
      
      if (result.isValid) {
        suggestions.push({
          type: 'success',
          message: 'GeoHash格式正确'
        });

        // 精度提示
        const length = value.trim().length;
        if (length < 5) {
          suggestions.push({
            type: 'info',
            message: `当前精度较低 (${length}位)`,
            suggestion: '建议使用5位以上的GeoHash以获得更好精度'
          });
        } else if (length >= 8) {
          suggestions.push({
            type: 'info',
            message: `精度良好 (${length}位，约${getPrecisionDescription(length)})`
          });
        }
      } else {
        overallStatus = 'error';
        suggestions.push({
          type: 'error',
          message: result.error || '格式错误',
          suggestion: getSmartSuggestion(value.trim(), result)
        });

        // 尝试提供修正建议
        const corrected = suggestCorrection(value.trim());
        if (corrected) {
          suggestions.push({
            type: 'info',
            message: '建议修正',
            correctedValue: corrected
          });
        }
      }
    }

    return {
      suggestions,
      overallStatus
    };
  }, [value, isBatchMode]);

  const handleCorrectionClick = (correctedValue: string) => {
    // 触发自定义事件，让父组件知道用户选择了修正建议
    const event = new CustomEvent('applyCorrection', { 
      detail: { correctedValue } 
    });
    window.dispatchEvent(event);
  };

  if (validationResults.overallStatus === 'empty') {
    return null;
  }

  const getStatusColor = (type: ValidationSuggestion['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'info':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (type: ValidationSuggestion['type']) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {validationResults.suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`
            flex items-start p-3 rounded-md border text-sm
            ${getStatusColor(suggestion.type)}
          `}
        >
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {getStatusIcon(suggestion.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-medium mb-1">
              {suggestion.message}
            </div>
            
            {suggestion.suggestion && (
              <div className="text-xs opacity-90">
                {suggestion.suggestion}
              </div>
            )}
            
            {suggestion.correctedValue && (
              <div className="mt-2">
                <button
                  onClick={() => handleCorrectionClick(suggestion.correctedValue!)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-current hover:bg-current hover:bg-opacity-10 transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  应用修正: {suggestion.correctedValue}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartInputValidator;