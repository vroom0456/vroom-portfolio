import { getGalleryData } from "@/lib/data";
import { isDriveConfigured } from "@/lib/drive";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getGalleryData();
  const driveReady = isDriveConfigured();

  return (
    <main className="min-h-screen bg-bg text-ink">
      <AdminDashboard initialCategories={data.categories} driveReady={driveReady} />
    </main>
  );
}
