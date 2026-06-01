import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda Admin",
  description: "Halaman beranda admin",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}