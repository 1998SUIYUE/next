import Form from '@/app/ui/products/create-form';
import Breadcrumbs from '@/app/ui/debts/breadcrumbs';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '商品', href: '/dashboard/products' },
          {
            label: '创建商品',
            href: '/dashboard/products/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
