import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Get the feedback message and sender email from the request
    const { message, email } = await req.json();

    // Basic validation — don't send empty feedback
    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Send the email to yourself via Resend
    await resend.emails.send({
      from: "onboarding@resend.dev", // Resend's free sender — no setup needed
      to: "veryfriedurian@protonmail.com",          // 👈 Replace with your actual email
      subject: "New Feedback — The Dayly Brip",
      text: `
New feedback received on The Dayly Brip:

Message:
${message}

From: ${email ? email : "Anonymous"}
Sent at: ${new Date().toLocaleString()}
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Failed to send feedback" },
      { status: 500 }
    );
  }
}