import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const storedName = searchParams.get("storedName");
  const resourceType = searchParams.get("resourceType") as "image" | "video" | "raw" | null;
  const fileUrl = searchParams.get("fileUrl") ?? "";
  const fileType = searchParams.get("fileType") ?? "";
  const originalName = searchParams.get("originalName") ?? "";
  const attachment = searchParams.get("attachment") === "1";

  if (!storedName || !resourceType) {
    return new NextResponse("Missing storedName or resourceType", { status: 400 });
  }

  // For image-typed resources (old PDFs uploaded before the raw fix), request the
  // correct output format so Cloudinary delivers the original bytes, not a JPEG render.
  const urlExt = fileUrl.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  const storedExt = storedName.split(".").pop()?.toLowerCase() ?? "";
  const format =
    resourceType === "image" && urlExt && urlExt !== storedExt ? urlExt : undefined;

  // Generate a signed URL (120s expiry) — signed URLs bypass Strict Transformations.
  const signedUrl = cloudinary.url(storedName, {
    resource_type: resourceType,
    type: "upload",
    secure: true,
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 120,
    ...(format ? { format } : {}),
  });

  const upstream = await fetch(signedUrl);

  if (!upstream.ok) {
    return new NextResponse(`Storage error: ${upstream.status}`, {
      status: upstream.status === 401 || upstream.status === 403 ? 502 : upstream.status,
    });
  }

  // Cloudinary may return the wrong content-type for files whose public_id has no
  // extension (data-URI uploads generate a random ID like "elrruqq39zzdlagswfnb").
  // Always prefer the stored fileType so the browser knows how to handle the file.
  const contentType =
    fileType || upstream.headers.get("content-type") || "application/octet-stream";

  const safeFilename = (originalName || storedName.split("/").pop() || "document").replace(/"/g, "");
  const contentDisposition = attachment
    ? `attachment; filename="${safeFilename}"`
    : `inline; filename="${safeFilename}"`;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
      "Cache-Control": "private, max-age=60",
    },
  });
}
