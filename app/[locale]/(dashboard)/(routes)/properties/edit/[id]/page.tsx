import { PropertyDetailPageView } from "@/features/properties/components/property-detail-page-view";

interface PropertyEditPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function PropertyEditPage({ params }: PropertyEditPageProps) {
  const resolvedParams = await params;
  return (
    <PropertyDetailPageView
      id={resolvedParams?.id || ""}
      locale={resolvedParams?.locale || "fr"}
    />
  );
}
