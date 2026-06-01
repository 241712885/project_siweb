import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Armada",
  description: "Halaman armada",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}