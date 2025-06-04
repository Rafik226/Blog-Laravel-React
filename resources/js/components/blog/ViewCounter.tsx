import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EyeIcon } from 'lucide-react';

interface ViewCounterProps {
  postId: number;
  postSlug: string;
  initialCount: number;
}

export default function ViewCounter({ postId, postSlug, initialCount }: ViewCounterProps) {
  const [viewCount, setViewCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cette fonction ne s'exécute que côté client
    const recordView = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(route('posts.view', postSlug));
        if (response.data.success) {
          setViewCount(response.data.views);
        }
      } catch (error) {
        console.error('Error recording view:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Enregistre la vue après un petit délai pour s'assurer que l'utilisateur est réellement en train de lire
    const timer = setTimeout(() => {
      recordView();
    }, 5000);

    return () => clearTimeout(timer);
  }, [postId, postSlug]);

  return (
    <div className="flex items-center text-gray-500 dark:text-gray-400">
      <EyeIcon size={16} className="mr-1" />
      <span className="text-sm">{isLoading ? '...' : viewCount}</span>
    </div>
  );
}