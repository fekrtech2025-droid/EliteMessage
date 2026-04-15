import { CustomerInstanceDetailPage } from './page-client';

type CustomerInstanceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerInstanceDetailRoute({
  params,
}: CustomerInstanceDetailPageProps) {
  const { id } = await params;
  return <CustomerInstanceDetailPage instanceId={id} />;
}
