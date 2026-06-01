import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Pengiriman",
  description: "Halaman riwayat pengiriman",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}