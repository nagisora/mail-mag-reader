import Link from 'next/link';

interface NewsletterCardProps {
  id: string;
  title: string;
  createdAt: string;
}

export default function NewsletterCard({ id, title, createdAt }: NewsletterCardProps) {
  return (
    <div className="border p-4 mb-4 rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
      <Link href={`/newsletters/${id}`} className="text-blue-500 hover:underline">
        詳細を見る
      </Link>
    </div>
  );
}
