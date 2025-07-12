'use client';

import { useState, useRef, useEffect } from 'react';

interface ProfileMenuButtonProps {
  name: string;
  imageUrl?: string;
}

const ProfileMenuButton: React.FC<ProfileMenuButtonProps> = ({ name, imageUrl }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = name?.[0]?.toUpperCase() || '?';

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover border-2 border-gray-300"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold">
            {initials}
          </div>
        )}
        <span className="hidden sm:inline font-medium text-sm text-gray-700 dark:text-gray-200">
          {name.split(' ')[0]}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 animate-fade-in"
        >
          <div className="py-1 text-sm text-gray-700 dark:text-gray-200">
            <div className="px-4 py-2 font-medium border-b dark:border-gray-700">
              {name}
            </div>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              My Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenuButton