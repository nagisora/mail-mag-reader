"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ReadingProgressBarProps {
  newsletterId: string;
}

export default function ReadingProgressBar({ newsletterId }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('position')
        .eq('newsletter_id', newsletterId)
        .single();

      if (error) {
        console.error('Error fetching reading progress:', error);
        return;
      }

      if (data) {
        setProgress(data.position);
        window.scrollTo(0, data.position);
      }
    };

    fetchProgress();
  }, [newsletterId]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setProgress(scrollPercent * 100);

      // Debounce the API call to save progress
      clearTimeout(updateProgress.timeoutId);
      updateProgress.timeoutId = setTimeout(async () => {
        await supabase
          .from('reading_progress')
          .upsert({ newsletter_id: newsletterId, position: scrollTop })
          .single();
      }, 1000);
    };

    window.addEventListener('scroll', updateProgress);

    return () => window.removeEventListener('scroll', updateProgress);
  }, [newsletterId]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
      <div
        className="h-full bg-blue-600 transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
