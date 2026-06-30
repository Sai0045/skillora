import type { Metadata } from "next";
import { CertificatesView } from "@/components/certificates/certificates-view";
import { courses } from "@/data/courses";

export const metadata: Metadata = {
  title: "Certificates",
};

export default function CertificatesPage() {
  return <CertificatesView courses={courses} />;
}
