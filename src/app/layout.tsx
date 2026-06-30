import type { Metadata } from "next";
import { AppShell } from "@/components/common/app-shell";
import { LearningProvider } from "@/store/learning-store";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Skillora",
    template: "%s | Skillora",
  },
  description: "Skillora is a local self-paced LMS prototype by Sairaj Abhale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <LearningProvider>
          <AppShell>{children}</AppShell>
        </LearningProvider>
      </body>
    </html>
  );
}
