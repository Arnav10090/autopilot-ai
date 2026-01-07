interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg',
};

export function Avatar({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  className = '',
}: AvatarProps) {
  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center flex-shrink-0 font-medium`;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${baseClasses} object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${baseClasses} bg-gradient-to-br from-accent to-accent-2 text-white ${className}`}
      role="img"
      aria-label={alt}
    >
      {initials}
    </div>
  );
}
