import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Halaman login",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}