import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getUserProfileByEmail,
  updateUserProfileByEmail,
} from "@/lib/auth-users";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stored = await getUserProfileByEmail(session.user.email);
  if (stored) {
    return NextResponse.json({ user: stored });
  }

  return NextResponse.json({
    user: {
      id: session.user.id || "",
      name: session.user.name || session.user.email.split("@")[0],
      email: session.user.email,
      provider: session.user.provider === "google" ? "google" : "credentials",
      image: session.user.image || undefined,
      phone: "",
      rigSpecs: "",
      createdAt: new Date().toISOString(),
    },
  });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const { name, phone, rigSpecs } = body as {
    name?: unknown;
    phone?: unknown;
    rigSpecs?: unknown;
  };

  if (typeof name === "string") {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 80) {
      return NextResponse.json(
        { error: "Full name must be between 2 and 80 characters." },
        { status: 400 }
      );
    }
  }

  if (typeof phone === "string" && phone.trim().length > 40) {
    return NextResponse.json(
      { error: "Phone number must be 40 characters or fewer." },
      { status: 400 }
    );
  }

  if (typeof rigSpecs === "string" && rigSpecs.trim().length > 300) {
    return NextResponse.json(
      { error: "Hardware spec blueprint must be 300 characters or fewer." },
      { status: 400 }
    );
  }

  const updated = await updateUserProfileByEmail(session.user.email, {
    name: typeof name === "string" ? name.trim() : undefined,
    phone: typeof phone === "string" ? phone.trim() : undefined,
    rigSpecs: typeof rigSpecs === "string" ? rigSpecs.trim() : undefined,
  });

  return NextResponse.json({ user: updated });
}

