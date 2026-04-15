import { AdminWorkerDetailPage } from './page-client';

type AdminWorkerDetailRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminWorkerDetailRoute({
  params,
}: AdminWorkerDetailRouteProps) {
  const { id } = await params;
  return <AdminWorkerDetailPage workerId={id} />;
}
