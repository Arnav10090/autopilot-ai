
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { TermsContent } from '@/components/legal/TermsContent';

export default function TermsPage() {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto animate-fade-in">
      <Card>
        <CardHeader title="Terms of Service" subtitle="Last updated: January 15, 2026" />
        <CardBody>
          <TermsContent />
        </CardBody>
      </Card>
    </main>
  );
}
