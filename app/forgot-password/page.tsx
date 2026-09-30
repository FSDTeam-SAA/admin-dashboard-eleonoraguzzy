import { Suspense } from "react"; import { AuthScreen } from "@/components/auth-screen";
export default function Page() { return <Suspense><AuthScreen mode="forgot" /></Suspense>; }
