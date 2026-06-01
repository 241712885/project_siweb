import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda Pelanggan",
  description: "Halaman beranda pelanggan",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}