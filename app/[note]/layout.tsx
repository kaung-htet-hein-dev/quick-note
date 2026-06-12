import type { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: Promise<{ note: string }>;
}): Promise<Metadata> {
  const { note } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

  return {
    title: `Note: ${note} | Note App`,
    description: `View and edit note: ${note}`,
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      title: `Note: ${note}`,
      description: `View and edit note: ${note}`,
      type: "website",
      url: `${baseUrl}/${note}`
    },
    twitter: {
      card: "summary",
      title: `Note: ${note}`,
      description: `View and edit note: ${note}`
    }
  };
}

export default function NoteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
