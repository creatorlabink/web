'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, GripVertical, Check, ChevronDown, ChevronRight,
  Star, Sparkles, Play, RotateCcw, Edit3, Eye, Save, X
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Types
interface Step {
  id: string;
  title: string;
  body: string;
  mustSee: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  animation: 'curtain' | 'rise' | 'scale';
  revealed: Record<string, boolean>;
  createdAt: string;
}

const STORAGE_KEY = 'creatorlab_paths';

const generateId = () => Math.random().toString(36).slice(2, 11);

const defaultPath = (): LearningPath => ({
  id: generateId(),
  title: '',
  description: '',
  steps: [{ id: generateId(), title: '', body: '', mustSee: false }],
  animation: 'curtain',
  revealed: {},
  createdAt: new Date().toISOString(),
});

// Parse quick entry text into steps
// Format: "Title..Description,,Title2..Description2"
function parseQuickEntry(text: string): Step[] {
  if (!text.trim()) return [];
  
  return text.split(',,').map(stepText => {
    const trimmed = stepText.trim();
    if (!trimmed) return null;
    
    const parts = trimmed.split('..');
    const title = parts[0]?.trim() || '';
    const body = parts.slice(1).join('..').trim(); // Join back in case description has ..
    
    if (!title) return null;
    
    return {
      id: generateId(),
      title,
      body,
      mustSee: false,
    };
  }).filter((s): s is Step => s !== null);
}

// Convert steps to quick entry format
function stepsToQuickEntry(steps: Step[]): string {
  return steps
    .filter(s => s.title.trim())
    .map(s => s.body ? `${s.title}..${s.body}` : s.title)
    .join(',,');
}

export default function UnveilPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
  const [mode, setMode] = useState<'list' | 'edit' | 'reveal'>('list');
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [quickEntryMode, setQuickEntryMode] = useState(false);
  const [quickEntryText, setQuickEntryText] = useState('');

  // Load paths from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPaths(JSON.parse(stored));
      } catch {
        setPaths([]);
      }
    }
  }, []);

  // Save paths to localStorage
  const savePaths = (newPaths: LearningPath[]) => {
    setPaths(newPaths);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPaths));
  };

  const createNewPath = () => {
    setEditingPath(defaultPath());
    setMode('edit');
  };

  const editPath = (path: LearningPath) => {
    setEditingPath({ ...path });
    setMode('edit');
  };

  const savePath = () => {
    if (!editingPath || !editingPath.title.trim()) return;
    
    // Filter out empty steps
    const cleanedPath = {
      ...editingPath,
      steps: editingPath.steps.filter(s => s.title.trim()),
    };

    if (cleanedPath.steps.length === 0) return;

    const existingIndex = paths.findIndex(p => p.id === cleanedPath.id);
    if (existingIndex >= 0) {
      const updated = [...paths];
      updated[existingIndex] = cleanedPath;
      savePaths(updated);
    } else {
      savePaths([cleanedPath, ...paths]);
    }
    
    setEditingPath(null);
    setMode('list');
  };

  const deletePath = (id: string) => {
    if (confirm('Delete this learning path?')) {
      savePaths(paths.filter(p => p.id !== id));
    }
  };

  const startReveal = (path: LearningPath) => {
    setCurrentPath({ ...path });
    setMode('reveal');
  };

  const toggleReveal = (stepId: string) => {
    if (!currentPath) return;
    const updated = {
      ...currentPath,
      revealed: {
        ...currentPath.revealed,
        [stepId]: !currentPath.revealed[stepId],
      },
    };
    setCurrentPath(updated);
    
    // Also save to storage
    const pathIndex = paths.findIndex(p => p.id === currentPath.id);
    if (pathIndex >= 0) {
      const updatedPaths = [...paths];
      updatedPaths[pathIndex] = updated;
      savePaths(updatedPaths);
    }
  };

  const resetProgress = () => {
    if (!currentPath) return;
    const updated = { ...currentPath, revealed: {} };
    setCurrentPath(updated);
    
    const pathIndex = paths.findIndex(p => p.id === currentPath.id);
    if (pathIndex >= 0) {
      const updatedPaths = [...paths];
      updatedPaths[pathIndex] = updated;
      savePaths(updatedPaths);
    }
  };

  // List View
  if (mode === 'list') {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Unveil
              </h1>
              <p className="text-gray-400">
                Create learning paths. Reveal each step as you master it.
              </p>
            </div>
            <button
              onClick={createNewPath}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              New Path
            </button>
          </div>

          {/* Paths List */}
          {paths.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No learning paths yet</h3>
              <p className="text-gray-400 mb-6">Create your first path to start your learning journey</p>
              <button
                onClick={createNewPath}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Path
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {paths.map((path) => {
                const totalSteps = path.steps.length;
                const revealedSteps = Object.values(path.revealed).filter(Boolean).length;
                const progress = totalSteps > 0 ? (revealedSteps / totalSteps) * 100 : 0;

                return (
                  <div
                    key={path.id}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-1">{path.title}</h3>
                        {path.description && (
                          <p className="text-gray-400 text-sm line-clamp-2">{path.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => editPath(path)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deletePath(path.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 whitespace-nowrap">
                        {revealedSteps} / {totalSteps} steps
                      </span>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => startReveal(path)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-medium rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {revealedSteps > 0 ? 'Continue' : 'Start'} Revealing
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      </DashboardLayout>
    );
  }

  // Edit View
  if (mode === 'edit' && editingPath) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => { setEditingPath(null); setMode('list'); }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to paths
            </button>
            <button
              onClick={savePath}
              disabled={!editingPath.title.trim() || editingPath.steps.filter(s => s.title.trim()).length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Path
            </button>
          </div>

          {/* Path Details */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Path Title</label>
              <input
                type="text"
                value={editingPath.title}
                onChange={(e) => setEditingPath({ ...editingPath, title: e.target.value })}
                placeholder="e.g. Master JavaScript in 30 Days"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Description (optional)</label>
              <textarea
                value={editingPath.description}
                onChange={(e) => setEditingPath({ ...editingPath, description: e.target.value })}
                placeholder="What will you learn? Why does it matter?"
                rows={2}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Steps */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Learning Steps</h3>
              <button
                onClick={() => {
                  if (!quickEntryMode) {
                    // Switching to quick entry - convert existing steps
                    setQuickEntryText(stepsToQuickEntry(editingPath.steps));
                  } else {
                    // Switching back to form - parse quick entry
                    const parsed = parseQuickEntry(quickEntryText);
                    if (parsed.length > 0) {
                      setEditingPath({ ...editingPath, steps: parsed });
                    }
                  }
                  setQuickEntryMode(!quickEntryMode);
                }}
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                {quickEntryMode ? '← Form Mode' : 'Quick Entry →'}
              </button>
            </div>

            {quickEntryMode ? (
              <div className="space-y-4">
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-3">
                    Enter steps using: <code className="text-amber-400">Title..Description,,Title2..Description2</code>
                  </p>
                  <textarea
                    value={quickEntryText}
                    onChange={(e) => setQuickEntryText(e.target.value)}
                    placeholder="Introduction to React..Learn the basics of React components and JSX,,State Management..Understanding useState and useEffect hooks,,Building Projects..Apply your knowledge in real projects"
                    rows={6}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-mono text-sm"
                  />
                </div>
                <button
                  onClick={() => {
                    const parsed = parseQuickEntry(quickEntryText);
                    if (parsed.length > 0) {
                      setEditingPath({ ...editingPath, steps: parsed });
                      setQuickEntryMode(false);
                    }
                  }}
                  disabled={!quickEntryText.trim()}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-colors"
                >
                  Apply Steps ({parseQuickEntry(quickEntryText).length})
                </button>
              </div>
            ) : (
              <React.Fragment>
                <div className="space-y-3">
                  {editingPath.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 pt-2">
                          <GripVertical className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-500 font-mono w-6">{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => {
                              const updated = [...editingPath.steps];
                              updated[index] = { ...step, title: e.target.value };
                              setEditingPath({ ...editingPath, steps: updated });
                            }}
                            placeholder="Step title"
                            className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                          />
                          <textarea
                            value={step.body}
                            onChange={(e) => {
                              const updated = [...editingPath.steps];
                              updated[index] = { ...step, body: e.target.value };
                              setEditingPath({ ...editingPath, steps: updated });
                            }}
                            placeholder="What will you learn in this step? (optional)"
                            rows={2}
                            className="w-full bg-transparent border-b border-gray-600 py-2 text-gray-300 placeholder-gray-500 resize-none focus:outline-none focus:border-amber-500 text-sm"
                          />
                          
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => {
                                const updated = [...editingPath.steps];
                                updated[index] = { ...step, mustSee: !step.mustSee };
                                setEditingPath({ ...editingPath, steps: updated });
                              }}
                              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                                step.mustSee
                                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                                  : 'border-gray-600 text-gray-500 hover:text-gray-300'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5" fill={step.mustSee ? 'currentColor' : 'none'} />
                              Must See
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (editingPath.steps.length > 1) {
                              setEditingPath({
                                ...editingPath,
                                steps: editingPath.steps.filter((_, i) => i !== index),
                              });
                            }
                          }}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setEditingPath({
                      ...editingPath,
                      steps: [...editingPath.steps, { id: generateId(), title: '', body: '', mustSee: false }],
                    });
                  }}
                  className="w-full mt-4 py-3 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-xl text-gray-400 hover:text-gray-300 transition-colors"
                >
                  + Add Step
                </button>
              </React.Fragment>
            )}
          </div>

          {/* Animation Selection */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Reveal Animation</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'curtain', name: 'Curtain', desc: 'Slides in' },
                { id: 'rise', name: 'Rise', desc: 'Drifts up' },
                { id: 'scale', name: 'Breathe', desc: 'Expands' },
              ].map((anim) => (
                <button
                  key={anim.id}
                  onClick={() => setEditingPath({ ...editingPath, animation: anim.id as LearningPath['animation'] })}
                  className={`p-4 rounded-xl border transition-all text-center ${
                    editingPath.animation === anim.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="h-8 flex items-center justify-center mb-2">
                    <div className={`w-10 h-1 bg-amber-500 rounded ${anim.id === 'scale' ? 'transform scale-110' : ''}`} />
                  </div>
                  <div className="text-white font-medium text-sm">{anim.name}</div>
                  <div className="text-gray-500 text-xs">{anim.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      </DashboardLayout>
    );
  }

  // Reveal View
  if (mode === 'reveal' && currentPath) {
    const totalSteps = currentPath.steps.length;
    const revealedSteps = Object.values(currentPath.revealed).filter(Boolean).length;
    const progress = totalSteps > 0 ? (revealedSteps / totalSteps) * 100 : 0;

    return (
      <DashboardLayout>
        <div className="flex-1">
        {/* Header */}
        <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-white">{currentPath.title}</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">
                    {revealedSteps}/{totalSteps}
                  </span>
                </div>

                <button
                  onClick={resetProgress}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Reset progress"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setMode('list')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-6">
          {currentPath.description && (
            <p className="text-gray-400 text-lg italic mb-8 font-serif">
              {currentPath.description}
            </p>
          )}

          {/* Steps */}
          <div className="space-y-3">
            {currentPath.steps.map((step, index) => {
              const isRevealed = currentPath.revealed[step.id];

              return (
                <button
                  key={step.id}
                  onClick={() => toggleReveal(step.id)}
                  className={`w-full text-left border rounded-xl overflow-hidden transition-all duration-300 relative ${
                    step.mustSee ? 'border-l-4 border-l-amber-500' : ''
                  } ${
                    isRevealed ? 'border-gray-700 bg-gray-900/30' : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {/* Step number indicator */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-sm text-gray-500 font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Must See badge */}
                  {step.mustSee && (
                    <div className="absolute top-4 right-14 z-10">
                      <span className="text-xs text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        Must See
                      </span>
                    </div>
                  )}

                  {/* Reveal status indicator */}
                  <div className="absolute top-4 right-4 z-10">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isRevealed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-600'
                      }`}
                    >
                      {isRevealed && <Check className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Content area - always present but covered when not revealed */}
                  <div className="relative min-h-[100px] p-5 pl-12">
                    {/* Actual content */}
                    <div className={`transition-all duration-500 ${
                      isRevealed ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <h3 className={`text-white font-medium text-lg mb-2 pr-20 ${
                        currentPath.animation === 'curtain' && isRevealed ? 'animate-curtain' : ''
                      } ${
                        currentPath.animation === 'rise' && isRevealed ? 'animate-rise' : ''
                      } ${
                        currentPath.animation === 'scale' && isRevealed ? 'animate-scale' : ''
                      }`}>
                        {step.title}
                      </h3>
                      {step.body && (
                        <p className={`text-gray-400 leading-relaxed ${
                          currentPath.animation === 'curtain' && isRevealed ? 'animate-curtain' : ''
                        } ${
                          currentPath.animation === 'rise' && isRevealed ? 'animate-rise' : ''
                        } ${
                          currentPath.animation === 'scale' && isRevealed ? 'animate-scale' : ''
                        }`} style={{ animationDelay: '0.1s' }}>
                          {step.body}
                        </p>
                      )}
                    </div>

                    {/* Cover overlay when not revealed */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800" />
                      <div className="relative flex flex-col items-center gap-2 text-gray-400">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                          <Eye className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Click to Unveil</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Completion Message */}
          {revealedSteps === totalSteps && totalSteps > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl text-center">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-1">Path Complete!</h3>
              <p className="text-gray-400">You've revealed all steps in this learning path.</p>
            </div>
          )}
        </div>

        {/* Animation Styles */}
        <style jsx>{`
          @keyframes curtain {
            from { clip-path: inset(0 100% 0 0); opacity: 0; }
            to { clip-path: inset(0 0% 0 0); opacity: 1; }
          }
          @keyframes rise {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes scale {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-curtain { animation: curtain 0.5s ease-out; }
          .animate-rise { animation: rise 0.45s ease-out; }
          .animate-scale { animation: scale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        `}</style>
        </div>
      </DashboardLayout>
    );
  }

  return null;
}
