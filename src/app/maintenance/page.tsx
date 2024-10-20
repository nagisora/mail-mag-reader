import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MaintenancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>メンテナンス中</CardTitle>
        </CardHeader>
        <CardContent>
          <p>現在、システムメンテナンス中です。ご不便をおかけして申し訳ありません。</p>
          <p>しばらくしてから再度アクセスしてください。</p>
        </CardContent>
      </Card>
    </div>
  );
}
