import { ProjectDetailPageView } from "@/features/projects/components/project-detail-page-view";

interface ProjectPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  return (
    <ProjectDetailPageView
      id={resolvedParams?.id || ""}
      locale={resolvedParams?.locale || "fr"}
    />
  );
}
