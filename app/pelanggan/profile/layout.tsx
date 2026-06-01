import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Pelanggan",
  description: "Halaman profil pelanggan",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}