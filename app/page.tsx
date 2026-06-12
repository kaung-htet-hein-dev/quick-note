import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function generateUUID() {
  return crypto.randomUUID();
}

export default function Home() {
  return redirect(`/${generateUUID()}`);
}
