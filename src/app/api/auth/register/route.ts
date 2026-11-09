import { NextResponse } from "next/server";
import { createCredentialsUser } from "@/lib/auth-users";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const { name, email, password } = body as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
  };

  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const rawPassword = typeof password === "string" ? password : "";

  if (cleanName.length < 2 || cleanName.length > 80) {
    return NextResponse.json(
      { error: "Please enter your full name (2 to 80 characters)." },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 254) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (rawPassword.length < 8 || rawPassword.length > 128) {
    return NextResponse.json(
      { error: "Password must be between 8 and 128 characters." },
      { status: 400 }
    );
  }

  try {
    const user = await createCredentialsUser({
      name: cleanName,
      email: cleanEmail,
      password: rawPassword,
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to register account.";

    if (message.startsWith("DUPLICATE_EMAIL:")) {
      return NextResponse.json(
        { error: message.replace("DUPLICATE_EMAIL:", "") },
        { status: 409 }
      );
    }

    console.error("Account registration error:", error);
    return NextResponse.json(
      { error: "Unable to create account right now. Please try again." },
      { status: 500 }
    );
  }
}

