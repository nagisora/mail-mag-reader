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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('reading_progress')
        .select('position')
        .eq('user_id', user.id)
        .eq('newsletter_id', newsletterId)
        .single();

      if (error) {
        console.error('Error fetching reading progress:', error);
        return;
      }

      if (data) {
        setProgress(data.position);
      }
    };

    fetchProgress();
  }, [newsletterId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const newProgress = Math.floor((scrollPosition / (documentHeight - windowHeight)) * 100);
      setProgress(newProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saveProgress = async () => {
      // 自動保存が無効な場合は早期リターン
      if (!window.env?.ENABLE_AUTO_SAVE_PROGRESS) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const integerProgress = Math.floor(progress);

      const { error } = await supabase
        .from('reading_progress')
        .upsert({
          user_id: user.id,
          newsletter_id: newsletterId,
          position: integerProgress,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving reading progress:', error);
      }
    };

    const debounce = setTimeout(saveProgress, 1000);
    return () => clearTimeout(debounce);
  }, [progress, newsletterId]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
