import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

interface NewsletterCardProps {
  id: string;
  title: string;
  createdAt: string;
  isVerified: boolean;
}

export default function NewsletterCard({ id, title, createdAt, isVerified }: NewsletterCardProps) {
  return (
    <div className="border border-gray-300 p-4 mb-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      <Link href={`/newsletters/${id}`}>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer mb-2">{title}</h2>
      </Link>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(createdAt).toLocaleDateString()}</p>
        <Badge 
          variant={isVerified ? "success" : "secondary"}
          className={`text-xs ${isVerified ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
        >
          {isVerified ? '照合済み' : '未照合'}
        </Badge>
      </div>
    </div>
  );
}
