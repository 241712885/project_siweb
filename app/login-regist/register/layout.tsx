import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Halaman register",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}