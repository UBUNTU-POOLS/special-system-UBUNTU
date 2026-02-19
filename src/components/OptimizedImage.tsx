import React, { ImgHTMLAttributes, useState } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className,
  ...props 
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const aspectRatio = (height / width) * 100;

  return (
    <div 
      className={`relative ${className || ''}`}
      style={{ paddingBottom: `${aspectRatio}%`, height: 0, overflow: 'hidden' }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
