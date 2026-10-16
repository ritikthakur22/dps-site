import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Daffodils Admin", template: "%s · Daffodils Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
