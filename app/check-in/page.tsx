import type { Metadata } from "next";
import CheckInKiosk from "@/components/CheckInKiosk";

export const metadata: Metadata = {
  title: "Check in",
  description: "Kingdom Overflow check-in and first-time registration.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckInPage() {
  return <CheckInKiosk />;
}
