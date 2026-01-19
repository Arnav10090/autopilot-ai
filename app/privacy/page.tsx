import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { PrivacyContent } from '@/components/legal/PrivacyContent';

export default function PrivacyPage() {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto animate-fade-in">
      <Card>
        <CardHeader title="Privacy Policy" subtitle="Last updated: January 15, 2026" />
        <CardBody>
          <PrivacyContent />
        </CardBody>
      </Card>
    </main>
  );
}
