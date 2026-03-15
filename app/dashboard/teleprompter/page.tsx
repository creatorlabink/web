'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Settings, Minus, Plus, 
  ChevronUp, ChevronDown, Maximize2, Minimize2, Type, Gauge, Eye
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TeleprompterPage() {
  // Script content
  const [script, setScript] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  
  // Teleprompter controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50); // 1-100 scale
  const [customSpeedInput, setCustomSpeedInput] = useState('50');
  const [fontSize, setFontSize] = useState(42); // px
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  
  // Accumulators for sub-pixel scrolling (browsers ignore fractional scrollTop)
  const scrollAccumulator = useRef<number>(0);
  const previewScrollAccumulator = useRef<number>(0);
  
  // Preview state
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);

  // Auto-scroll logic using setInterval for reliable timing
  // speed 1 = 1 pixel per second, speed 100 = 100 pixels per second
  useEffect(() => {
    if (!isPlaying || !scrollContainerRef.current) {
      scrollAccumulator.current = 0;
      return;
    }

    const container = scrollContainerRef.current;
    
    // Use setInterval for more predictable scrolling
    // Run 60 times per second (every ~16.67ms)
    const intervalId = setInterval(() => {
      // Accumulate fractional pixels
      scrollAccumulator.current += speed / 60;
      
      // Only scroll when we have at least 1 whole pixel
      if (scrollAccumulator.current >= 1) {
        const pixelsToScroll = Math.floor(scrollAccumulator.current);
        container.scrollTop += pixelsToScroll;
        scrollAccumulator.current -= pixelsToScroll;
      }
      
      // Check if reached bottom
      if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
        setIsPlaying(false);
      }
    }, 16.67);

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, speed]);

  // Preview auto-scroll effect (loops) using setInterval
  useEffect(() => {
    if (!isPreviewPlaying || !previewContainerRef.current || !isEditing) {
      previewScrollAccumulator.current = 0;
      return;
    }

    const container = previewContainerRef.current;
    
    const intervalId = setInterval(() => {
      // Accumulate fractional pixels
      previewScrollAccumulator.current += speed / 60;
      
      // Only scroll when we have at least 1 whole pixel
      if (previewScrollAccumulator.current >= 1) {
        const pixelsToScroll = Math.floor(previewScrollAccumulator.current);
        container.scrollTop += pixelsToScroll;
        previewScrollAccumulator.current -= pixelsToScroll;
      }
      
      // Loop: reset to top when reaching bottom
      if (container.scrollTop >= container.scrollHeight - container.clientHeight - 5) {
        container.scrollTop = 0;
      }
    }, 16.67);

    return () => {
      clearInterval(intervalId);
    };
  }, [isPreviewPlaying, speed, isEditing]);

  // Handle manual scroll (doesn't stop auto-scroll, just adjusts position)
  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return;
    // Allow natural scrolling - it will continue from new position
    scrollContainerRef.current.scrollTop += e.deltaY;
  };

  // Touch scroll for mobile
  const touchStartY = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    const deltaY = touchStartY.current - e.touches[0].clientY;
    scrollContainerRef.current.scrollTop += deltaY;
    touchStartY.current = e.touches[0].clientY;
  };

  const resetScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const goLive = () => {
    if (!script.trim()) return;
    setIsEditing(false);
    resetScroll();
    setTimeout(() => setIsPlaying(true), 500);
  };

  // Preset scripts for demo
  const sampleScript = `Welcome to CreatorLab!

Today we're going to talk about how to turn your knowledge into a profitable digital product.

First, let's understand why ebooks are the perfect starting point for creators...

The beauty of an ebook is that it's evergreen content. You create it once, and it can sell forever.

Here are the three steps to creating your first ebook:

Step 1: Choose your topic
Pick something you know well and that others want to learn.

Step 2: Structure your content
Use chapters to break down complex ideas into digestible pieces.

Step 3: Design matters
A well-designed ebook builds trust and justifies premium pricing.

Remember: Your knowledge is valuable. Don't underestimate what you can teach others.

Thank you for watching, and don't forget to subscribe!`;

  if (isEditing) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Teleprompter
            </h1>
            <p className="text-gray-400">
              Paste your script, adjust settings, and go live. Auto-scrolls while you speak.
            </p>
          </div>

          {/* Settings Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">Settings</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Font Size */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <Type className="w-4 h-4" />
                  Font Size: <span className="text-white font-medium">{fontSize}px</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFontSize(Math.max(24, fontSize - 4))}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="24"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <button
                    onClick={() => setFontSize(Math.min(72, fontSize + 4))}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scroll Speed */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <Gauge className="w-4 h-4" />
                  Scroll Speed: <span className="text-white font-medium">{speed}</span>
                  <span className="text-gray-500 text-xs">({speed} px/s)</span>
                </label>
                
                {/* Slider row */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => {
                      const newSpeed = Math.max(1, speed - 10);
                      setSpeed(newSpeed);
                      setCustomSpeedInput(String(newSpeed));
                    }}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={speed}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSpeed(val);
                      setCustomSpeedInput(String(val));
                    }}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <button
                    onClick={() => {
                      const newSpeed = Math.min(100, speed + 10);
                      setSpeed(newSpeed);
                      setCustomSpeedInput(String(newSpeed));
                    }}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Manual input row */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Set exact speed:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={customSpeedInput}
                    onChange={(e) => setCustomSpeedInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = Math.min(100, Math.max(1, Number(customSpeedInput) || 1));
                        setSpeed(val);
                        setCustomSpeedInput(String(val));
                      }
                    }}
                    className="w-20 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-center focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
                  />
                  <button
                    onClick={() => {
                      const val = Math.min(100, Math.max(1, Number(customSpeedInput) || 1));
                      setSpeed(val);
                      setCustomSpeedInput(String(val));
                    }}
                    className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-lg font-semibold text-white">Live Preview</h2>
                <span className="text-sm text-gray-500">
                  ({speed} px/s)
                </span>
              </div>
              <button
                onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
              >
                {isPreviewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPreviewPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
            
            {/* Preview container - simulates the live view */}
            <div className="relative rounded-xl overflow-hidden bg-black border border-gray-700">
              {/* Top gradient fade */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
              
              {/* Scrolling content */}
              <div
                ref={previewContainerRef}
                className="h-48 overflow-hidden"
                style={{ scrollBehavior: 'auto' }}
              >
                <div className="px-6 py-12">
                  <p
                    className="text-white text-center leading-relaxed whitespace-pre-wrap"
                    style={{ fontSize: `${Math.max(14, fontSize / 2.5)}px` }}
                  >
                    {script || `Welcome to the teleprompter preview!\n\nThis is how your script will scroll when you go live.\n\nThe text moves upward at the speed you set.\n\nAdjust the speed slider to see how fast or slow it goes.\n\nAt speed 1, text moves very slowly - perfect for beginners.\n\nAt speed 100, text moves quickly for experienced readers.\n\nPaste your script below to see it in action!`}
                  </p>
                </div>
              </div>
              
              {/* Bottom gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
            </div>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              This preview shows how your script will scroll. The center line shows the current reading position.
            </p>
          </div>

          {/* Script Input */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Your Script</h2>
              <button
                onClick={() => setScript(sampleScript)}
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Load sample script
              </button>
            </div>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your script here... Everything you want to say during your live stream or video recording."
              className="w-full h-64 bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              {script.length} characters • ~{Math.ceil(script.split(/\s+/).filter(Boolean).length / 150)} min read
            </p>
          </div>

          {/* Go Live Button */}
          <button
            onClick={goLive}
            disabled={!script.trim()}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5" />
            Go Live
          </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Teleprompter View (fullscreen overlay)
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => { setIsEditing(true); setIsPlaying(false); }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
          >
            ← Edit Script
          </button>

          <div className="flex items-center gap-3">
            {/* Speed Control - Expanded */}
            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Gauge className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => {
                  const newSpeed = Math.max(1, speed - 5);
                  setSpeed(newSpeed);
                  setCustomSpeedInput(String(newSpeed));
                }}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSpeed(val);
                  setCustomSpeedInput(String(val));
                }}
                className="w-40 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <button
                onClick={() => {
                  const newSpeed = Math.min(100, speed + 5);
                  setSpeed(newSpeed);
                  setCustomSpeedInput(String(newSpeed));
                }}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <input
                type="number"
                min="1"
                max="100"
                value={customSpeedInput}
                onChange={(e) => setCustomSpeedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = Math.min(100, Math.max(1, Number(customSpeedInput) || 1));
                    setSpeed(val);
                    setCustomSpeedInput(String(val));
                  }
                }}
                className="w-14 bg-black/50 border border-gray-600 rounded px-2 py-1 text-white text-xs text-center focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <button
                onClick={() => {
                  const val = Math.min(100, Math.max(1, Number(customSpeedInput) || 1));
                  setSpeed(val);
                  setCustomSpeedInput(String(val));
                }}
                className="px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded transition-colors"
              >
                OK
              </button>
            </div>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-3 rounded-full ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Reset */}
            <button
              onClick={resetScroll}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              title="Reset to top"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Script Display */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="flex-1 overflow-y-auto scroll-smooth"
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Top padding for reading line */}
        <div className="h-[40vh]" />
        
        <div className="max-w-4xl mx-auto px-8 pb-[60vh]">
          <div
            className="text-white leading-relaxed whitespace-pre-wrap"
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: 1.6,
            }}
          >
            {script}
          </div>
        </div>
      </div>

      {/* Reading Line Indicator */}
      <div className="absolute top-[35vh] left-0 right-0 pointer-events-none">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div className="h-[60px] bg-gradient-to-b from-violet-500/10 to-transparent" />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
