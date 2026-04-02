import { NextResponse } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { connectMongoose } from "@/lib/mongoose";
import { UserModel } from "@/lib/models/User";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const emailRaw = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!isValidEmail(emailRaw)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const email = normalizeEmail(emailRaw);
    await connectMongoose();

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    await UserModel.create({
      email,
      name,
      passwordHash,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
