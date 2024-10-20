import Link from 'next/link';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface NewsletterCardProps {
  id: string;
  title: string;
  createdAt: string;
  isVerified: boolean;
}

export default function NewsletterCard({ id, title, createdAt, isVerified }: NewsletterCardProps) {
  return (
    <div className="border border-gray-300 p-4 mb-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <Link href={`/newsletters/${id}`}>
        <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 cursor-pointer">{title}</h2>
      </Link>
      <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
      <Badge variant={isVerified ? "success" : "secondary"} className="mt-2">
        {isVerified ? '照合済み' : '未照合'}
      </Badge>
    </div>
  );
}
