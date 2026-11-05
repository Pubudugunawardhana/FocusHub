import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getOwnedBundle } from '@/lib/bundles';
import { HttpError } from '@/lib/http';
import BundleManager from '@/components/BundleManager';
import { EditShell } from './edit-shell';

export const dynamic = 'force-dynamic';

export default async function EditBundlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  let bundle;
  try {
    bundle = await getOwnedBundle(id, session.user.id);
  } catch (err) {
    if (err instanceof HttpError) redirect('/dashboard/bundles');
    throw err;
  }

  // Serialize Dates for the client component
  const data = JSON.parse(JSON.stringify(bundle));

  return (
    <EditShell>
      <BundleManager key={bundle.id} initialBundle={data} />
    </EditShell>
  );
}
