import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Maximize, Eye, Search, Calendar, User, ArrowUpRight, Play, Image, Download, Heart, Share2 } from 'lucide-react';

const ACCENT_COLORS = [
  { 
    shadow: 'shadow-pink-500/30', 
    title: 'text-pink-400', 
    iconBg: 'bg-pink-500/20', 
    iconText: 'text-pink-300',
    ctaText: 'text-pink-400',
    gradient: 'from-pink-500/10 to-purple-500/10',
    border: 'border-pink-500/20'
  },
  { 
    shadow: 'shadow-indigo-500/30', 
    title: 'text-indigo-400', 
    iconBg: 'bg-indigo-500/20', 
    iconText: 'text-indigo-300',
    ctaText: 'text-indigo-400',
    gradient: 'from-indigo-500/10 to-blue-500/10',
    border: 'border-indigo-500/20'
  },
  { 
    shadow: 'shadow-emerald-500/30', 
    title: 'text-emerald-400', 
    iconBg: 'bg-emerald-500/20', 
    iconText: 'text-emerald-300',
    ctaText: 'text-emerald-400',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-500/20'
  },
  { 
    shadow: 'shadow-yellow-500/30', 
    title: 'text-yellow-400', 
    iconBg: 'bg-yellow-500/20', 
    iconText: 'text-yellow-300',
    ctaText: 'text-yellow-400',
    gradient: 'from-yellow-500/10 to-orange-500/10',
    border: 'border-yellow-500/20'
  },
];

// Fixed Image preloader component
const useImagePreloader = (imageUrls) => {
  const [loadedImages, setLoadedImages] = useState(new Set());

  useEffect(() => {
    if (typeof window === 'undefined') return; // Check if running in browser

    const preloadImages = async () => {
      const loadPromises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          // Use window.Image for browser environment
          const img = new window.Image();
          img.src = url;
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, url]));
            resolve(url);
          };
          img.onerror = () => {
            console.warn(`Failed to load image: ${url}`);
            reject(url);
          };
        });
      });

      try {
        await Promise.all(loadPromises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    preloadImages();
  }, [imageUrls]);

  return loadedImages;
};

// Alternative simpler preloader without constructor issues
const useSimpleImagePreloader = (imageUrls) => {
  const [loadedImages, setLoadedImages] = useState(new Set());

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) return;

    imageUrls.forEach(url => {
      // Simple fetch-based preloading
      fetch(url, { method: 'HEAD', mode: 'no-cors' })
        .then(() => {
          setLoadedImages(prev => new Set([...prev, url]));
        })
        .catch(() => {
          // Silently fail for preloading
        });
    });
  }, [imageUrls]);

  return loadedImages;
};

const CardProject = memo(({ 
  project, 
  onImageClick, 
  index, 
  showTags = true, 
  variant = 'default',
  priority = false
}) => {
  const { 
    title, 
    image, 
    images = [],
    description, 
    category, 
    tags, 
    date, 
    client, 
    status,
    videoUrl,
    likes = 0,
    views = 0,
    type = 'image',
    thumbnail,
  } = project;
  
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const cardRef = useRef();

  // Preload images - using the safer version
  const allImages = images.length > 0 ? images : [image];
  const loadedImages = useSimpleImagePreloader(allImages);

  // 1. ប្រើ Index ដើម្បីជ្រើសរើសពណ៌
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
  
  // 2. កំណត់លក្ខខណ្ឌឆ្លាស់គ្នា (លេខគូ ឬ លេខសេស)
  const isEven = index % 2 === 0;

  // Device detection
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Optimized auto-slide for gallery images (desktop only)
  useEffect(() => {
    if (isHovered && images.length > 1 && !isMobile) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length, isMobile]);

  // Enhanced Intersection Observer with better thresholds
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '50px' : '100px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile]);

  // Touch handlers for mobile gallery
  const handleTouchStart = useCallback((e) => {
    if (images.length <= 1) return;
    setTouchStart(e.touches[0].clientX);
  }, [images.length]);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart || images.length <= 1) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      } else {
        setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
      }
    }
    setTouchStart(null);
  }, [touchStart, images.length]);

  const handleImageClick = useCallback(() => {
    if (onImageClick) {
      if (images.length > 0) {
        onImageClick(images, title, description, currentImageIndex);
      } else {
        onImageClick([image], title, description, 0);
      }
    }
  }, [onImageClick, images, title, description, currentImageIndex, image]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleImageClick();
    }
  }, [handleImageClick]);

  const handleLike = useCallback((e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  }, [isLiked]);

  const getCurrentImage = useCallback(() => {
    if (images.length > 0) {
      return images[currentImageIndex];
    }
    return image;
  }, [images, currentImageIndex, image]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true); // Stop loading animation
  }, []);

  const isGallery = images.length > 1;
  const isVideo = type === 'video' || videoUrl;

  // Optimized loading strategy
  const loadingStrategy = priority ? 'eager' : (index < (isMobile ? 2 : 4) ? 'eager' : 'lazy');
  const shouldShowHoverEffects = !isMobile && isHovered;

  return (
    <div 
      ref={cardRef}
      className={`relative group cursor-pointer overflow-hidden rounded-xl md:rounded-2xl transition-all duration-300 
                 transform perspective-1000 
                 hover:shadow-2xl ${color.shadow} 
                 ${shouldShowHoverEffects ? 'hover:scale-[1.02] hover:rotateY-2 hover:rotateX-1' : ''}
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                 bg-gradient-to-br ${color.gradient} border ${color.border}
                 ${isMobile ? 'active:scale-95 active:brightness-95' : ''}`}
      onClick={handleImageClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label={`View project details for ${title}`}
      role="button"
      tabIndex={0}
    >
      {/* Animated Background Gradient - Desktop only */}
      {!isMobile && (
        <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      )}
      
      {/* 1. IMAGE/GALLERY CONTAINER */}
      <div className="relative w-full z-10" style={{ aspectRatio: '16/10' }}>
        {isVisible && (
          <>
            {/* Low-quality placeholder first */}
            {thumbnail && !imageLoaded && (
              <img
                src={thumbnail}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
                loading="eager"
              />
            )}
            
            {/* Main Image */}
            <img
              src={imageError ? '/images/placeholder.jpg' : getCurrentImage()}
              alt={title}
              onError={handleImageError}
              onLoad={handleImageLoad}
              className={`w-full h-full object-cover transition-all duration-300 
                         group-hover:opacity-100 opacity-95 brightness-[0.85] 
                         ${shouldShowHoverEffects ? 'group-hover:brightness-100 group-hover:scale-105' : ''}
                         ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading={loadingStrategy}
              decoding="async"
            />

            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 animate-pulse flex items-center justify-center">
                <div className="text-gray-500 text-sm">Loading...</div>
              </div>
            )}

            {/* Gallery Indicators */}
            {isGallery && images.length > 1 && (
              <>
                {/* Dots Indicator */}
                <div className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 
                              ${isMobile ? 'bottom-2' : ''}`}>
                  {images.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`transition-all duration-300 ${
                        idx === currentImageIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 scale-100'
                      } ${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full`}
                    />
                  ))}
                </div>

                {/* Gallery Badge */}
                <div className={`absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white flex items-center gap-1 rounded-full
                              ${isMobile ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'}`}>
                  <Image className={isMobile ? "w-2.5 h-2.5" : "w-3 h-3"} />
                  <span>{images.length}</span>
                </div>

                {/* Mobile Swipe Arrows */}
                {isMobile && isGallery && (
                  <>
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-1">
                      <div className="w-4 h-4 border-l-2 border-b-2 border-white transform rotate-45" />
                    </div>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-1">
                      <div className="w-4 h-4 border-r-2 border-b-2 border-white transform -rotate-45" />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Video Play Button */}
            {isVideo && (
              <div className={`absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300 
                            ${shouldShowHoverEffects ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`bg-white/20 backdrop-blur-sm rounded-full border border-white/30 
                              ${isMobile ? 'p-3' : 'p-4'}`}>
                  <Play className={isMobile ? "w-6 h-6 text-white fill-white" : "w-8 h-8 text-white fill-white"} />
                </div>
              </div>
            )}

            {/* Mockup Badge */}
            {type === 'mockup' && (
              <div className={`absolute top-3 left-3 bg-orange-500/80 backdrop-blur-sm text-white rounded-full
                            ${isMobile ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'}`}>
                Mockup
              </div>
            )}
          </>
        )}
        
        {/* Initial Loading skeleton */}
        {!isVisible && (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-700 animate-pulse flex items-center justify-center">
            <div className="text-gray-500 text-sm">Loading project...</div>
          </div>
        )}

        {/* Status Badge */}
        {status && (
          <div className={`absolute top-3 right-3 rounded-full text-xs font-semibold backdrop-blur-sm
            ${status === 'Completed' ? 'bg-green-500/20 text-green-300' : 
              status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
              'bg-yellow-500/20 text-yellow-300'}
            ${isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'}`}>
            {status}
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className={`absolute top-12 right-3 rounded-full text-sm font-medium backdrop-blur-sm
                         ${color.iconBg} ${color.iconText}
                         ${isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-1'}`}>
            {category}
          </div>
        )}
      </div>
      
      {/* Image Stats (Likes, Views) */}
      <div className="absolute top-3 left-3 flex gap-2 z-20">
        {(likes > 0 || views > 0) && (
          <>
            {views > 0 && (
              <div className={`flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm text-white
                            ${isMobile ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'}`}>
                <Eye className={isMobile ? "w-2.5 h-2.5" : "w-3 h-3"} />
                <span>{views}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Subtle border to frame the image */}
      <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-xl md:rounded-2xl z-15" />

      {/* 2. INFO OVERLAY - Enhanced for mobile */}
      <div 
        className={`absolute inset-x-0 bottom-0 backdrop-blur-sm z-30
                   ${isMobile ? 
                     'p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent transform translate-y-0 opacity-100' : 
                     `p-4 md:p-6 transition-all duration-300 transform 
                      ${shouldShowHoverEffects ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
                      bg-gradient-to-t from-black/90 via-black/60 to-transparent`
                   }`}
      >
        {/* Project Metadata */}
        {(date || client) && (
          <div className={`flex items-center gap-4 text-gray-300 mb-3
                         ${isMobile ? 'text-xs gap-2' : 'text-xs'}`}>
            {date && (
              <div className="flex items-center gap-1">
                <Calendar className={isMobile ? "w-2.5 h-2.5" : "w-3 h-3"} />
                <span>{date}</span>
              </div>
            )}
            {client && (
              <div className="flex items-center gap-1">
                <User className={isMobile ? "w-2.5 h-2.5" : "w-3 h-3"} />
                <span>{client}</span>
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className={`font-bold ${color.title} mb-2 transition-all duration-300 
                      ${isMobile ? 
                        'text-base translate-x-0' : 
                        `${shouldShowHoverEffects ? 'translate-x-0' : 'translate-x-2'} text-lg md:text-xl`
                      }`}> 
          {title}
        </h3>
        
        {/* Description */}
        <p className={`text-gray-300 line-clamp-2 mb-3 md:mb-4 leading-relaxed
                     ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>

        {/* Tags */}
        {showTags && tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, isMobile ? 2 : 3).map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-lg border border-white/20"
              >
                {tag}
              </span>
            ))}
            {tags.length > (isMobile ? 2 : 3) && (
              <span className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-lg">
                +{tags.length - (isMobile ? 2 : 3)}
              </span>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          {/* CALL TO ACTION */}
          <div 
            className={`flex items-center gap-2 transition-all duration-300 
                       ${isMobile ? 'opacity-100 translate-x-0' : 
                         `${shouldShowHoverEffects ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}`}
          >
            <span 
              className={`font-semibold ${color.ctaText} flex items-center gap-2
                         ${isMobile ? 'text-xs' : 'text-sm'}`}
            >
              {isGallery ? 'View Gallery' : isVideo ? 'Watch Video' : 'View Project'}
              <ArrowUpRight className={`transition-transform duration-300 
                                     ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}
                                     ${shouldShowHoverEffects ? 'translate-x-1 -translate-y-1' : ''}`} />
            </span>
          </div>

          {/* Like Button */}
          <button 
            onClick={handleLike}
            className={`rounded-full backdrop-blur-sm transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            } ${isMobile ? 'p-1.5' : 'p-2'}`}
          >
            <Heart className={`${isLiked ? 'fill-current' : ''} ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
          </button>
        </div>
      </div>
      
      {/* 3. TOP RIGHT HOVER ICON (Desktop only) */}
      {!isMobile && (
        <div 
          className={`absolute top-4 right-4 p-3 rounded-2xl ${color.iconBg} backdrop-blur-sm ${color.iconText} border border-white/10
                     transition-all duration-500 transform z-40
                     ${shouldShowHoverEffects ? 'opacity-100 scale-110 rotate-12' : 'opacity-0 scale-90'}`}>
          {isGallery ? (
            <Image className="w-5 h-5" />
          ) : isVideo ? (
            <Play className="w-5 h-5 fill-current" />
          ) : isEven ? (
            <Maximize className="w-5 h-5" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
      )}

      {/* 4. HOVER EFFECT - Shine Overlay (Desktop only) */}
      {!isMobile && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                       transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] 
                       transition-transform duration-1000 z-5 pointer-events-none" />
      )}

      {/* 5. DOWNLOAD BUTTON (Optional) */}
      {variant === 'with-download' && !isMobile && (
        <button 
          className={`absolute bottom-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 
                     border border-white/20 transition-all duration-300 transform z-40
                     ${shouldShowHoverEffects ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Download image:', getCurrentImage());
          }}
        >
          <Download className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

CardProject.displayName = "CardProject";
export default CardProject;