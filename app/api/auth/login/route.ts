import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return Response.json({ error: "Vui lòng nhập email và mật khẩu." }, { status: 400 });
    }

    const user = getUserByEmail(email);

    if (!user || !verifyPassword(password, user.password)) {
      return Response.json({ error: "Email hoặc mật khẩu không chính xác." }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("session", String(user.id), {
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
        phone: user.phone,
        balance: user.balance ?? 0,
        address: user.address,
      },
    });
  } catch (error) {
    return Response.json({ error: "Không thể đăng nhập." }, { status: 500 });
  }
}
