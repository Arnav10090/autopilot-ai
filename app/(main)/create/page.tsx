import { Suspense } from "react";
import ProjectForm from "@/components/ProjectForm";

export default function CreatePage() {
  return (
    <Suspense fallback={<div>Loading project form...</div>}>
      <ProjectForm />
    </Suspense>
  );
}
