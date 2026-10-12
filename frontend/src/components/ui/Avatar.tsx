import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export type AvatarStyle =
  | 'lorelei'
  | 'avataaars'
  | 'bottts'
  | 'thumbs'
  | 'initials'
  | 'shapes';

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  name: string;
  seed?: string;
  style?: AvatarStyle;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'rounded' | 'square';
  src?: string;
  alt?: string;
  showBorder?: boolean;
}

const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-700',
  'from-violet-500 to-purple-700',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-rose-600',
  'from-indigo-500 to-cyan-600',
];

export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarUrl(
  seed: string,
  style: AvatarStyle = 'lorelei'
): string {
  const safeSeed = encodeURIComponent(seed.trim() || 'default');
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${safeSeed}`;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const SHAPE_CLASSES = {
  circle: 'rounded-full',
  rounded: 'rounded-xl',
  square: 'rounded-2xl',
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  seed,
  style = 'lorelei',
  size = 'md',
  shape = 'circle',
  src,
  alt,
  showBorder = false,
  className,
  ...props
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const effectiveSeed = seed || name || 'user';
  const avatarUrl = src || getAvatarUrl(effectiveSeed, style);
  const initials = getInitials(name);
  const gradientIndex = stringToHash(effectiveSeed) % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIndex];

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden shrink-0 select-none bg-slate-100 dark:bg-slate-800',
        SIZE_CLASSES[size],
        SHAPE_CLASSES[shape],
        showBorder && 'border-2 border-white dark:border-slate-800 shadow-xs',
        className
      )}
      title={name}
      {...props}
    >
      {!imgError ? (
        <>
          <img
            src={avatarUrl}
            alt={alt || `${name}'s avatar`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-200',
              imgLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
          {!imgLoaded && (
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center font-bold text-white bg-gradient-to-br',
                gradient
              )}
            >
              {initials}
            </div>
          )}
        </>
      ) : (
        <div
          className={cn(
            'w-full h-full flex items-center justify-center font-bold text-white bg-gradient-to-br',
            gradient
          )}
        >
          {initials}
        </div>
      )}
    </div>
  );
};
