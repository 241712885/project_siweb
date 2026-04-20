import { Suspense } from "react";
import TransferClient from "./transfer-client";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransferClient />
    </Suspense>
  );
}