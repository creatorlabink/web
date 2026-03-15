'use client';

import { cn } from '@/lib/utils';
import { BookOpen, Briefcase, GraduationCap, Check } from 'lucide-react';
import type { Ebook } from '@/types';

interface TemplateSelectorProps {
  value: Ebook['template'];
  onChange: (value: Ebook['template']) => void;
}

const TEMPLATES: { 
  value: Ebook['template']; 
  label: string; 
  desc: string;
  icon: typeof BookOpen;
  gradient: string;
  accent: string;
}[] = [
  { 
    value: 'minimal', 
    label: 'Minimal', 
    desc: 'Clean, simple, reader-focused',
    icon: BookOpen,
    gradient: 'from-slate-600 to-slate-800',
    accent: 'text-amber-400'
  },
  { 
    value: 'business', 
    label: 'Business', 
    desc: 'Professional look for guides/reports',
    icon: Briefcase,
    gradient: 'from-blue-600 to-indigo-800',
    accent: 'text-amber-300'
  },
  { 
    value: 'workbook', 
    label: 'Workbook', 
    desc: 'Learning-focused with callouts',
    icon: GraduationCap,
    gradient: 'from-purple-600 to-violet-800',
    accent: 'text-amber-400'
  },
];

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">Template</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TEMPLATES.map((template) => {
          const isSelected = value === template.value;
          const Icon = template.icon;
          return (
            <button
              key={template.value}
              type="button"
              onClick={() => onChange(template.value)}
              className={cn(
                'group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300',
                'border backdrop-blur-sm',
                isSelected
                  ? 'border-indigo-500/50 bg-gradient-to-br ' + template.gradient + ' shadow-lg shadow-indigo-500/20 scale-[1.02]'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              
              {/* Icon */}
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors',
                isSelected 
                  ? 'bg-white/20' 
                  : 'bg-white/5 group-hover:bg-white/10'
              )}>
                <Icon className={cn(
                  'w-5 h-5 transition-colors',
                  isSelected ? template.accent : 'text-gray-400 group-hover:text-gray-300'
                )} />
              </div>
              
              {/* Text */}
              <div className={cn(
                'font-semibold text-sm mb-1 transition-colors',
                isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
              )}>
                {template.label}
              </div>
              <div className={cn(
                'text-xs transition-colors',
                isSelected ? 'text-white/70' : 'text-gray-500 group-hover:text-gray-400'
              )}>
                {template.desc}
              </div>
              
              {/* Subtle glow effect on selected */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
