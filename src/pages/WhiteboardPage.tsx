import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pencil, 
  Eraser, 
  Trash2, 
  Download, 
  Circle, 
  Square, 
  Undo2, 
  Maximize2,
  Minimize2,
  Palette
} from 'lucide-react';

const COLORS = [
  '#ffffff', // Branco
  '#bff720', // Verde Limão Inova
  '#3b82f6', // Azul
  '#ef4444', // Vermelho
  '#f59e0b', // Amarelo/Laranja
  '#8b5cf6', // Roxo
];

const STROKE_WIDTHS = [2, 4, 8, 12];

export default function WhiteboardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#bff720');
  const [lineWidth, setLineWidth] = useState(4);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  // Prevent body scroll when on this page
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = originalStyle;
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, []);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const { width, height } = parent.getBoundingClientRect();
      
      // Save content before resize
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Reset transform before scale
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      
      // Restore content scaled
      ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, width, height);
      
      // Default settings
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    // Use requestAnimationFrame for smoother resize and initial calculation
    requestAnimationFrame(resize);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    // Get clientX and clientY regardless of event type
    let clientX: number;
    let clientY: number;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('changedTouches' in e && e.changedTouches.length > 0) {
      clientX = (e as any).changedTouches[0].clientX;
      clientY = (e as any).changedTouches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    // High precision: Use the ratio between CSS pixels and Buffer pixels
    const x = (clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
    const y = (clientY - rect.top) * (canvas.height / rect.height / (window.devicePixelRatio || 1));

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      if (e.cancelable) e.preventDefault();
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#0a0a0a' : color;
    ctx.lineWidth = lineWidth;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCoordinates(e);
    setMousePos({ x, y });

    if (!isDrawing) return;
    if ('touches' in e) {
      if (e.cancelable) e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!confirm('Tem certeza que deseja limpar todo o whiteboard?')) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;

    exportCtx.fillStyle = '#0a0a0a';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = `whiteboard-inova-${new Date().getTime()}.png`;
    link.href = exportCanvas.toDataURL();
    link.click();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Erro ao entrar em tela cheia: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative h-[calc(100vh-8rem)] w-full bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex flex-col transition-all duration-300 ${isFullscreen ? 'h-screen w-screen rounded-none m-0 p-0 fixed top-0 left-0 z-[100]' : ''}`}
      style={{ touchAction: 'none' }} // Crucial for mobile
    >
      {/* Dynamic Cursor */}
      <AnimatePresence>
        {showCursor && !('ontouchstart' in window) && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="pointer-events-none absolute z-[100] rounded-full border border-white/30 mix-blend-difference"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              width: lineWidth,
              height: lineWidth,
              backgroundColor: tool === 'eraser' ? 'white' : color,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Workspace Area */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={() => {
          stopDrawing();
          setShowCursor(false);
        }}
        onMouseEnter={() => setShowCursor(true)}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="flex-1 cursor-none touch-none"
      />

      {/* Floating Toolbar */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-2 p-3 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 max-w-[95vw] sm:max-w-none"
      >
        {/* Tools */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-2">
          <ToolButton 
            active={tool === 'pen'} 
            onClick={() => setTool('pen')} 
            icon={<Pencil className="w-4 h-4 sm:w-5 sm:h-5" />} 
            label="Caneta"
          />
          <ToolButton 
            active={tool === 'eraser'} 
            onClick={() => setTool('eraser')} 
            icon={<Eraser className="w-4 h-4 sm:w-5 sm:h-5" />} 
            label="Borracha"
          />
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1.5 border-r border-white/10 px-2 flex-wrap justify-center max-w-[150px] sm:max-w-none">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setTool('pen');
              }}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-200 ${color === c && tool === 'pen' ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'hover:scale-110 opacity-60 hover:opacity-100'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Thickness */}
        <div className="flex items-center gap-1 border-r border-white/10 px-2">
          {STROKE_WIDTHS.map((w) => (
            <button
              key={w}
              onClick={() => setLineWidth(w)}
              className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/5 transition-colors ${lineWidth === w ? 'text-[#bff720] bg-white/10' : 'text-white/40'}`}
            >
              <div 
                className="rounded-full bg-current" 
                style={{ width: Math.max(2, w/2), height: Math.max(2, w/2) }} 
              />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pl-1 sm:pl-2">
          <ToolButton onClick={clearCanvas} icon={<Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />} label="Limpar" className="hover:text-red-500" />
          <ToolButton onClick={downloadImage} icon={<Download className="w-4 h-4 sm:w-5 sm:h-5" />} label="Salvar PNG" />
          <ToolButton onClick={toggleFullscreen} icon={isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />} label="Tela Cheia" />
        </div>
      </motion.div>

      {/* Top Indicators */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-3">
        <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#bff720] animate-pulse" />
          <span className="text-white/60 text-[10px] sm:text-xs font-medium uppercase tracking-widest">Whiteboard Inova</span>
        </div>
      </div>
    </div>
  );
}

function ToolButton({ 
  active, 
  onClick, 
  icon, 
  label, 
  className 
}: { 
  active?: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 group relative ${active ? 'bg-[#bff720] text-black shadow-[0_0_20px_rgba(191,247,32,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'} ${className}`}
    >
      {icon}
      <span className="hidden sm:block absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-tighter shadow-xl">
        {label}
      </span>
    </button>
  );
}
