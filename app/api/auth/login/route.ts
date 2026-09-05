import { cookies } from "next/headers";
import supabaseServer from "@/lib/supabaseServer";
import { verifyPassword } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";

export const runtime = "nodejs";

async function findUserByEmailInSupabase(email: string) {
  if (!supabaseServer) return null;

  const candidates = [
    "tai_khoan",
    "users",
  ];

  let lastError: any = null;

  for (const table of candidates) {
    const { data, error } = await supabaseServer
      .from(table)
      .select("*")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return { table, user: data };
    }

    lastError = error;
  }

  if (lastError) {
    throw lastError;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return Response.json({ error: "Vui lòng nhập email và mật khẩu." }, { status: 400 });
    }

    let user: any = null;

    if (supabaseServer) {
      try {
        const supabaseUser = await findUserByEmailInSupabase(email);
        if (supabaseUser) {
          user = supabaseUser.user;
        }
      } catch {
        user = null;
      }
    }

    if (!user) {
      user = getUserByEmail(email);
    }

    const passwordHash = user?.password_hash ?? user?.password ?? "";

    if (!user || !passwordHash || !verifyPassword(password, passwordHash)) {
      return Response.json({ error: "Email hoặc mật khẩu không chính xác." }, { status: 401 });
    }

    const userId = user.id;

    const cookieStore = await cookies();
    cookieStore.set("session", String(userId), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({
      message: "Đăng nhập thành công.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        balance: user.balance ?? 0,
        address: user.address ?? "",
      },
    });
  } catch (error) {
    return Response.json({ error: "Không thể đăng nhập." }, { status: 500 });
  }
}
