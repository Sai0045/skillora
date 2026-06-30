"use client";

import { Award, Copy, Download, ExternalLink, Printer, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/common/badge";
import { Button, LinkButton } from "@/components/common/button";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { useLearning } from "@/hooks/use-learning";
import type { Course } from "@/types/lms";

export function CertificatesView({ courses }: { courses: Course[] }) {
  const { state } = useLearning();
  const [activeCertificateId, setActiveCertificateId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const activeCertificate = state.certificates.find((certificate) => certificate.id === activeCertificateId);
  const activeCourse = activeCertificate ? courses.find((course) => course.id === activeCertificate.courseId) : undefined;

  async function copyCredential(code: string) {
    await navigator.clipboard.writeText(code);
    setMessage("Credential code copied.");
  }

  if (state.certificates.length === 0) {
    return (
      <EmptyState
        icon={<Award className="size-5" aria-hidden="true" />}
        title="No certificates yet"
        description="Complete every lesson in a course to generate a local demo certificate."
        action={<LinkButton href={routes.courses}>Browse courses</LinkButton>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <Badge tone="accent">Certificates</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Earned credentials</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Certificates are generated from local demo progress and are stored only in this browser.
        </p>
      </section>

      {message ? <p className="text-sm text-[var(--success)]" aria-live="polite">{message}</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.certificates.map((certificate) => {
          const course = courses.find((item) => item.id === certificate.courseId);
          return (
            <article key={certificate.id} className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-12 items-center justify-center rounded-[var(--radius-control)] bg-[var(--warning-soft)] text-[var(--warning)]">
                  <Award className="size-6" aria-hidden="true" />
                </span>
                <Badge tone="success">Issued</Badge>
              </div>
              <h2 className="mt-5 text-xl font-semibold">{course?.title ?? "Course"}</h2>
              <dl className="mt-4 grid gap-2 text-sm text-[var(--muted)]">
                <div>
                  <dt className="font-medium text-[var(--foreground)]">Learner</dt>
                  <dd>{certificate.learnerName}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[var(--foreground)]">Issue date</dt>
                  <dd>{formatDate(certificate.issueDate)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[var(--foreground)]">Credential code</dt>
                  <dd className="font-mono text-xs">{certificate.credentialCode}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setActiveCertificateId(certificate.id)}>
                  <ExternalLink className="size-4" aria-hidden="true" />
                  View
                </Button>
                <Button variant="ghost" onClick={() => copyCredential(certificate.credentialCode)}>
                  <Copy className="size-4" aria-hidden="true" />
                  Copy
                </Button>
              </div>
            </article>
          );
        })}
      </section>

      {activeCertificate && activeCourse ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="certificate-title">
          <button className="absolute inset-0 bg-black/45" aria-label="Close certificate" onClick={() => setActiveCertificateId(null)} />
          <div className="absolute left-1/2 top-1/2 w-[min(94vw,760px)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-2xl sm:p-6">
            <div className="no-print mb-4 flex items-center justify-between gap-3">
              <h2 id="certificate-title" className="text-lg font-semibold">
                Printable certificate
              </h2>
              <Button variant="ghost" size="icon" aria-label="Close certificate" onClick={() => setActiveCertificateId(null)}>
                <X className="size-5" aria-hidden="true" />
              </Button>
            </div>
            <div className="rounded-[var(--radius-card)] border-2 border-[var(--accent)] bg-[var(--surface)] p-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Skillora certificate</p>
              <h3 className="mt-6 text-3xl font-semibold sm:text-5xl">Certificate of Completion</h3>
              <p className="mt-6 text-sm text-[var(--muted)]">This local demo certificate is awarded to</p>
              <p className="mt-3 text-3xl font-semibold">{activeCertificate.learnerName}</p>
              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[var(--muted)]">
                for completing <strong className="text-[var(--foreground)]">{activeCourse.title}</strong> on Skillora.
              </p>
              <dl className="mx-auto mt-8 grid max-w-xl gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-[var(--foreground)]">Issue date</dt>
                  <dd className="mt-1 text-[var(--muted)]">{formatDate(activeCertificate.issueDate)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[var(--foreground)]">Credential code</dt>
                  <dd className="mt-1 font-mono text-[var(--muted)]">{activeCertificate.credentialCode}</dd>
                </div>
              </dl>
              <p className="mt-8 text-sm font-medium">Sairaj Abhale</p>
              <p className="text-xs text-[var(--muted)]">Skillora prototype author</p>
            </div>
            <div className="no-print mt-4 flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={() => copyCredential(activeCertificate.credentialCode)}>
                <Copy className="size-4" aria-hidden="true" />
                Copy code
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="size-4" aria-hidden="true" />
                Print
              </Button>
              <Button onClick={() => window.print()}>
                <Download className="size-4" aria-hidden="true" />
                Download
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
