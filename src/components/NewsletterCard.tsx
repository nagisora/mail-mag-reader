import Link from 'next/link';

interface NewsletterCardProps {
  id: string;
  title: string;
  createdAt: string;
}

export default function NewsletterCard({ id, title, createdAt }: NewsletterCardProps) {
  return (
    <div className="border border-gray-300 p-4 mb-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
      <Link href={`/newsletters/${id}`} className="text-blue-600 hover:underline">
        詳細を見る
      </Link>
    </div>
  );
}
