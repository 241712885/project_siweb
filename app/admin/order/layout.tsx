import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pemesanan",
  description: "Halaman pemesanan",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}