import React from 'react';

export const renderIcon = (icon: string, size = 32): React.ReactNode => {
  if (icon.startsWith('/')) {
    return (
      <img
        src={icon}
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
      />
    );
  }
  return icon;
};
