import { redirect } from "next/navigation";

interface PropertyPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "fr";
  const id = resolvedParams?.id || "";

  redirect(`/${locale}/properties/edit/${id}`);
}
