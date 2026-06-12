import { NextResponse } from "next/server";
import {
  STORAGE_BUCKET,
  hasStorageConfig,
  missingStorageConfigKeys,
  supabase
} from "@/lib/supabase";

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  message?: string;
};

const response = <T>(payload: ApiResponse<T>, status = 200) =>
  NextResponse.json(payload, { status });

export async function POST(request: Request) {
  if (!hasStorageConfig || !supabase || !STORAGE_BUCKET) {
    return response(
      {
        ok: false,
        message: `Supabase server config is missing: ${missingStorageConfigKeys.join(", ")}`
      },
      503
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const noteIdOrSlug = formData.get("noteIdOrSlug");

    if (!(file instanceof File) || typeof noteIdOrSlug !== "string") {
      return response({ ok: false, message: "Invalid upload payload" }, 400);
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const path = `notes/${noteIdOrSlug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) {
      return response({ ok: false, message: "Image upload failed" }, 500);
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

    return response({ ok: true, data: { publicUrl: data.publicUrl } });
  } catch {
    return response({ ok: false, message: "Internal server error" }, 500);
  }
}
