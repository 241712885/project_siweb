import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengiriman",
  description: "Halaman pengiriman",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}