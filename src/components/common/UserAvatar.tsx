import React from 'react';

interface UserAvatarProps {
  name?: string;
  email?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'User',
  email,
  className = '',
  size = 'md',
  showName = false,
}) => {
  const getInitials = (str: string) => {
    const names = str.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  const getColorFromString = (str: string) => {
    // Simple hash function to generate consistent colors for the same string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
  };

  const displayName = name || email?.split('@')[0] || 'User';
  const initials = getInitials(displayName);
  const bgColor = getColorFromString(displayName);

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium flex-shrink-0`}
        style={{ backgroundColor: bgColor }}
        aria-label={displayName}
      >
        {initials}
      </div>
      {showName && (
        <span className="ml-2 font-medium text-gray-700 dark:text-gray-300 truncate">
          {displayName}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
