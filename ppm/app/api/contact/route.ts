import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const enquiry = await Enquiry.create(body);

  return Response.json({
    success: true,
    enquiry,
  });
}