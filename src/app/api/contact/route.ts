import { NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000, "Message is too long"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = Schema.parse(json);

    if ((data.message.match(/https?:\/\//g) || []).length > 2) {
      return NextResponse.json({ ok: false, error: "spam_guard" }, { status: 400 });
    }

    console.log("Contact form:", data);
    // TODO: integrate Resend/Formspree
    // Example:
    // await resend.emails.send({
    //   from: 'contact@example.com',
    //   to: 'your@email.com',
    //   subject: `Portfolio Contact: ${data.name}`,
    //   text: `From: ${data.name} (${data.email})\n\n${data.message}`,
    // });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
