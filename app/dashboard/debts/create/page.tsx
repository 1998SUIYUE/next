import { Suspense } from 'react';
import Form from '@/app/ui/debts/create-form';
import Breadcrumbs from '@/app/ui/debts/breadcrumbs';
import { DebtsCreateFormSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '借款', href: '/dashboard/debts' },
          {
            label: '创建借款',
            href: '/dashboard/debts/create', 
            active: true,
          },
        ]}
      />
      <Suspense fallback={<DebtsCreateFormSkeleton />}>
        <Form />
      </Suspense>
    </main>
  );
}