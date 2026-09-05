import { cookies } from "next/headers";
import { hashPassword, validateEmail, validatePassword } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");
    const confirmPassword = String(body.confirmPassword ?? "");
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const balance = Number(body.balance ?? 0);

    if (!name || !email || !password) {
      return Response.json({ error: "Vui lòng nhập đầy đủ thông tin." }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return Response.json({ error: "Email không hợp lệ." }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return Response.json({ error: "Mật khẩu phải từ 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return Response.json({ error: "Mật khẩu xác nhận không khớp." }, { status: 400 });
    }

    if (getUserByEmail(email)) {
      return Response.json({ error: "Email đã được sử dụng." }, { status: 409 });
    }

    const userId = createUser({
      name,
      email,
      password: hashPassword(password),
      phone,
      address,
      balance,
    });

    const cookieStore = await cookies();
    cookieStore.set("session", String(userId), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({
      message: "Đăng ký thành công.",
      user: {
        id: userId,
        name,
        email,
        phone,
        balance,
        address,
      },
    });
  } catch (error) {
    return Response.json({ error: "Không thể đăng ký tài khoản." }, { status: 500 });
  }
}
