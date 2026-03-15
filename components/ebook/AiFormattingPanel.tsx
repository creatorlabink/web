'use client';

import { Sparkles, Loader2, Wand2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AiFormattingPanelProps {
  enabled: boolean;
  aiApplied: boolean;
  aiSource?: string;
  formatting: boolean;
  onToggle: (enabled: boolean) => void;
  onApply: () => void;
}

export function AiFormattingPanel({
  enabled,
  aiApplied,
  aiSource,
  formatting,
  onToggle,
  onApply,
}: AiFormattingPanelProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border backdrop-blur-sm p-4 transition-all duration-300',
      enabled 
        ? 'border-violet-500/30 bg-gradient-to-br from-violet-950/50 to-indigo-950/50 shadow-lg shadow-violet-500/10' 
        : 'border-white/10 bg-white/5'
    )}>
      {/* Animated gradient background when enabled */}
      {enabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-purple-600/10 to-indigo-600/5 animate-pulse" />
      )}
      
      <div className="relative flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
            enabled 
              ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30' 
              : 'bg-white/10'
          )}>
            {aiApplied ? (
              <CheckCircle2 className={cn('w-5 h-5', enabled ? 'text-white' : 'text-gray-500')} />
            ) : (
              <Wand2 className={cn('w-5 h-5', enabled ? 'text-white' : 'text-gray-500')} />
            )}
          </div>
          <div>
            <p className={cn(
              'text-sm font-semibold transition-colors',
              enabled ? 'text-white' : 'text-gray-300'
            )}>
              AI-assisted formatting
            </p>
            <p className={cn(
              'text-xs transition-colors',
              enabled ? 'text-violet-300/80' : 'text-gray-500'
            )}>
              Auto-detect chapters, headings, bullets, and quotes
            </p>
          </div>
        </div>
        
        {/* Premium toggle switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <div className={cn(
            'w-12 h-6 rounded-full relative transition-all duration-300',
            enabled 
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30' 
              : 'bg-white/10'
          )}>
            <div className={cn(
              'absolute top-1 w-4 h-4 rounded-full transition-all duration-300 shadow-sm',
              enabled 
                ? 'left-7 bg-white' 
                : 'left-1 bg-gray-400'
            )} />
          </div>
        </label>
      </div>

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {aiApplied ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">
                Applied ({aiSource || 'heuristic'})
              </span>
            </span>
          ) : (
            <span className={cn(
              'text-xs font-medium px-2.5 py-1 rounded-full border',
              enabled 
                ? 'text-violet-300 bg-violet-500/10 border-violet-500/20' 
                : 'text-gray-500 bg-white/5 border-white/10'
            )}>
              {enabled ? 'Ready to format' : 'Manual mode'}
            </span>
          )}
        </div>
        
        <button
          type="button"
          disabled={!enabled || formatting}
          onClick={onApply}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300',
            !enabled || formatting
              ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-400 hover:to-purple-400 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]'
          )}
        >
          {formatting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {formatting ? 'Formatting…' : 'Apply AI Formatting'}
        </button>
      </div>
    </div>
  );
}
