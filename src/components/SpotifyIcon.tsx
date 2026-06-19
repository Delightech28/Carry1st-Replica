import React from 'react';

interface SpotifyIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const SpotifyIcon: React.FC<SpotifyIconProps> = ({ className, ...props }) => {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_Icon_RGB_Green.png"
      alt="Spotify Logo"
      className={className}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
