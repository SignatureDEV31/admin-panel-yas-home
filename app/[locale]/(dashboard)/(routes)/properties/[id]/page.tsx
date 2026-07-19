import { PropertyDetailPageView } from "@/features/properties/components/property-detail-page-view";

interface PropertyPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const resolvedParams = await params;
  return (
    <PropertyDetailPageView
      id={resolvedParams?.id || ""}
      locale={resolvedParams?.locale || "fr"}
    />
  );
}
