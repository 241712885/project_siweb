import { Suspense } from "react";
import TransferClient from "./transfer-payment";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransferClient />
    </Suspense>
  );
}