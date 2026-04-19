import React from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  shape?: 'circle' | 'square';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-lg',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    src, 
    alt = '', 
    fallback, 
    size = 'md', 
    shape = 'circle', 
    className = '', 
    ...props 
  }, ref) => {
    const sizeClass = sizeClasses[size];
    const shapeClass = shapeClasses[shape];
    
    const classes = [
      'flex items-center justify-center bg-surface overflow-hidden',
      sizeClass,
      shapeClass,
      className
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        {...props}
        role="img"
        aria-label={alt || fallback || 'Avatar'}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-green-darker font-medium">
            {fallback || alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;