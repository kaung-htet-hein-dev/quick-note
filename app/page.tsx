import { redirect } from "next/navigation";

function generateUUID() {
  return crypto.randomUUID();
}

export default function Home() {
  return redirect(`/${generateUUID()}`);
}
