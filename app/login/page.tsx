import { Suspense } from "react";
import { Login } from "@/components/login";

export default function Page() {
  return <Suspense fallback={<main className="login-page" aria-busy="true" />}><Login /></Suspense>;
}
