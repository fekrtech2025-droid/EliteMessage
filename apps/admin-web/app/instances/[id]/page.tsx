import { AdminInstanceDetailPage } from './page-client';

type AdminInstanceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminInstanceDetailRoute({
  params,
}: AdminInstanceDetailPageProps) {
  const { id } = await params;
  return <AdminInstanceDetailPage instanceId={id} />;
}
