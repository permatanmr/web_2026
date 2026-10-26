import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET belum diisi di file .env");
  return new TextEncoder().encode(secret);
}

export async function createSession(userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getKey());

  const store = await cookies();
  store.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getUserId(): Promise<number | null> {
  const store = await cookies();
  const token = store.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    return Number(payload.userId);
  } catch {
    return null;
  }
}

// Untuk halaman dan Server Action: arahkan ke /login bila belum masuk
export async function requireUserId(): Promise<number> {
  const userId = await getUserId();
  if (!userId) redirect("/login");
  return userId;
}

export async function deleteSession() {
  const store = await cookies();
  store.delete("session");
}
