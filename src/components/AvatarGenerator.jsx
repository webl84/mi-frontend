// src/components/AvatarGenerator.jsx
import React, { useEffect, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

const AvatarGenerator = ({ userId }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const generateAvatar = async () => {
      try {
        const avatar = createAvatar(avataaars, {
          seed: userId.toString(),
          size: 64,
        });

        const dataUri = await avatar.toDataUri(); // ahora es async
        setAvatarUrl(dataUri);
      } catch (error) {
        console.error('Error al generar el avatar:', error);
      }
    };

    generateAvatar();
  }, [userId]);

  if (!avatarUrl) return <p>Cargando avatar...</p>;

  return (
    <img src={avatarUrl} alt="Avatar generado" className="w-24 h-24 rounded-full" />
  );
};

export default AvatarGenerator;
