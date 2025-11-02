import React, { memo } from 'react';
import { Maximize, Eye, Search } from 'lucide-react'; // បន្ថែម Search សម្រាប់ Icon ឆ្លាស់គ្នា

// 🌈 កំណត់ Array នៃពណ៌ Accent ដែលត្រូវវិលជុំ (Loop)
const ACCENT_COLORS = [
  { 
    shadow: 'shadow-pink-500/30', 
    title: 'text-pink-400', 
    iconBg: 'bg-pink-500/20', 
    iconText: 'text-pink-300',
    ctaText: 'text-pink-400' 
  },
  { 
    shadow: 'shadow-indigo-500/30', 
    title: 'text-indigo-400', 
    iconBg: 'bg-indigo-500/20', 
    iconText: 'text-indigo-300',
    ctaText: 'text-indigo-400' 
  },
  { 
    shadow: 'shadow-emerald-500/30', 
    title: 'text-emerald-400', 
    iconBg: 'bg-emerald-500/20', 
    iconText: 'text-emerald-300',
    ctaText: 'text-emerald-400' 
  },
  { 
    shadow: 'shadow-yellow-500/30', 
    title: 'text-yellow-400', 
    iconBg: 'bg-yellow-500/20', 
    iconText: 'text-yellow-300',
    ctaText: 'text-yellow-400' 
  },
];

const CardProject = memo(({ project, onImageClick, index }) => {
  const { title, image, description } = project;

  // 1. ប្រើ Index ដើម្បីជ្រើសរើសពណ៌
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
  
  // 2. កំណត់លក្ខខណ្ឌឆ្លាស់គ្នា (លេខគូ ឬ លេខសេស)
  const isEven = index % 2 === 0;

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(image, title);
    }
  };

  return (
    // 💥 Dynamic Shadow Color
    <div 
      className={`relative group cursor-pointer overflow-hidden rounded-xl md:rounded-2xl transition-all duration-300 
                 transform perspective-1000 
                 hover:shadow-2xl ${color.shadow} 
                 hover:scale-[1.03] hover:rotateY-[1deg] hover:rotateX-[1deg]`}
      onClick={handleImageClick}
      aria-label={`View full-size image for ${title}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleImageClick();
        }
      }}
    >
      
      {/* 1. IMAGE - Full width/height */}
      <img
        src={image}
        alt={title}
        className="object-cover w-full h-auto transition-all duration-300 group-hover:opacity-100 opacity-95 brightness-[0.8] group-hover:brightness-[1.05]"
        style={{ aspectRatio: '16/10' }} 
        loading={index < 3 ? 'eager' : 'lazy'}
      />
      
      {/* Subtle border to frame the image */}
      <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-xl md:rounded-2xl"></div>

      {/* 2. INFO OVERLAY */}
      <div 
        className="absolute inset-x-0 bottom-0 p-3 md:p-5 transition-all duration-300 
                   transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100
                   bg-black/40 backdrop-blur-sm" 
        style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.0) 0%, rgba(0, 0, 0, 0.5) 100%)'
        }}
      >
        {/* ចំណងជើង: Dynamic Title Color */}
        <h3 className={`text-lg md:text-xl font-bold ${color.title} mb-1`}> 
          {title}
        </h3>
        
        {/* ការពិពណ៌នា */}
        <p className="text-xs md:text-sm text-gray-300 line-clamp-2 mb-2 md:mb-3">
          {description}
        </p>
        
        {/* 🚀 CALL TO ACTION: ឆ្លាស់គ្នា (flex-row ឬ flex-row-reverse) */}
        <span 
          className={`text-xs md:text-sm ${color.ctaText} font-semibold flex items-center gap-1 md:gap-2 
                    ${isEven ? 'flex-row' : 'flex-row-reverse'}` // លេខគូ = ធម្មតា, លេខសេស = បញ្ច្រាស
          }
        >
          {isEven ? 'View Full UX/UI Case Study' : 'Case Study Details'}
          {isEven 
            ? <Maximize className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:scale-110" /> 
            : <Eye className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:scale-110" />
          }
        </span>
      </div>
      
      {/* 3. TOP RIGHT HOVER ICON (Visual Cue) - ឆ្លាស់ Icon */}
      <div 
        className={`absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full ${color.iconBg} backdrop-blur-sm ${color.iconText}
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          {isEven 
            ? <Maximize className="w-4 h-4 md:w-5 md:h-5" /> // លេខគូ (0, 2, 4...)
            : <Search className="w-4 h-4 md:w-5 md:h-5" />  // លេខសេស (1, 3, 5...)
          }
      </div>
    </div>
  );
});

CardProject.displayName = "CardProject";
export default CardProject;