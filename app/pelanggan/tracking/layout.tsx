import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tracking Paket",
  description: "Halaman tracking paket",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}