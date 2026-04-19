import { cva, type VariantProps } from 'class-variance-authority';

// Avatar variants
const avatarVariants = cva('inline-flex items-center justify-center rounded-full overflow-hidden', {
  variants: {
    size: {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    },
    variant: {
      circle: 'rounded-full',
      square: 'rounded',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'circle',
  },
});

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string;
  alt: string;
  name?: string;
  className?: string;
}

/**
 * Reusable Avatar component for displaying user profile images
 * Falls back to initials if no image is provided
 */
const Avatar = ({ src, alt, name, size, variant, className }: AvatarProps) => {
  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(name);

  return (
    <div
      className={avatarVariants({ size, variant, className })}
      role="img"
      aria-label={alt}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm font-medium text-white bg-burnt-orange w-full h-full flex items-center justify-center">
          {initials}
        </span>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

export default Avatar;
---