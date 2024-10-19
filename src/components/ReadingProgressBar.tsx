"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface ReadingProgressBarProps {
  newsletterId: string;
}

export default function ReadingProgressBar({ newsletterId }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('reading_progress')
        .select('position')
        .eq('newsletter_id', newsletterId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
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
    const updateProgress = async () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setProgress(scrollPercent * 100);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          const { error } = await supabase
            .from('reading_progress')
            .upsert({ 
              newsletter_id: newsletterId, 
              user_id: user.id, 
              position: scrollTop 
            }, {
              onConflict: 'user_id,newsletter_id'
            });

          if (error) throw error;
        } catch (error) {
          console.error('Error saving reading progress:', error);
        }
      }, 1000);
    };

    window.addEventListener('scroll', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [newsletterId]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
      <div
        className="h-full bg-blue-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
