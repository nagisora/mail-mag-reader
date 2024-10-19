"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ReadingProgressBarProps {
  newsletterId: string;
  onProgressLoaded: (position: number) => void;
}

export default function ReadingProgressBar({ newsletterId, onProgressLoaded }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('reading_progress')
          .select('position')
          .eq('user_id', user.id)
          .eq('newsletter_id', newsletterId)
          .single();

        if (data && !error) {
          setProgress(data.position);
          onProgressLoaded(data.position);
        }
      }
    };

    fetchProgress();
  }, [newsletterId, onProgressLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setProgress(scrollPercent * 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saveProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('reading_progress').upsert({
          user_id: user.id,
          newsletter_id: newsletterId,
          position: Math.round(progress),
        });
      }
    };

    const debounce = setTimeout(saveProgress, 1000);

    return () => clearTimeout(debounce);
  }, [progress, newsletterId]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
