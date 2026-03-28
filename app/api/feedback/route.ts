import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Maximum allowed lengths — anything beyond this gets rejected
const MAX_MESSAGE_LENGTH = 1000;
const MAX_EMAIL_LENGTH = 254;

// Strips out any HTML tags from a string
// This prevents someone from injecting scripts into your email
function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

// Checks if an email looks valid — basic format check only
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Cleans a string — strips HTML and trims whitespace
function sanitize(text: string): string {
  return stripHtml(text).trim();
}

export async function POST(req: Request) {
  try {
    // Make sure the request body is actually JSON
    // If someone sends garbage data, this will catch it
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const { message, email } = body;

    // Make sure message exists and is a string
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Clean the message by stripping HTML and trimming whitespace
    const cleanMessage = sanitize(message);

    // Reject empty messages after cleaning
    if (cleanMessage.length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // Reject messages that are too long
    if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Validate email only if the user provided one
    let cleanEmail = "Anonymous";
    if (email && typeof email === "string") {
      // Reject emails that are too long
      if (email.length > MAX_EMAIL_LENGTH) {
        return NextResponse.json(
          { error: "Email address is too long" },
          { status: 400 }
        );
      }

      // Reject emails that don't look valid
      if (!isValidEmail(email.trim())) {
        return NextResponse.json(
          { error: "Please enter a valid email address" },
          { status: 400 }
        );
      }

      cleanEmail = sanitize(email);
    }

    // Everything looks good — send the email
    await resend.emails.send({
      from: "onboarding@resend.dev", // this should be a verified sender in your Resend account
      to: "daylybrip.feedback@resend.dev", // email address where I want to receive feedback
      subject: "New Feedback — The Dayly Brip",
      text: `
New feedback received on The Dayly Brip:

Message:
${cleanMessage}

From: ${cleanEmail}
Sent at: ${new Date().toLocaleString()}
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    // Log the real error internally but never expose it to the user
    // This prevents leaking internal details to potential attackers
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}