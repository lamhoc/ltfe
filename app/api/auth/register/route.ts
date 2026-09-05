import { cookies } from "next/headers";
import supabaseServer from "@/lib/supabaseServer";
import { hashPassword, validateEmail, validatePassword } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/db";

export const runtime = "nodejs";

async function createUserInSupabase({ name, email, passwordHash, phone, balance, address }: {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  balance: number;
  address: string;
}) {
  if (!supabaseServer) {
    throw new Error("Missing Vercel server env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  const payload: Record<string, any> = {
    name,
    email,
    phone,
    balance,
    address,
    created_at: new Date().toISOString(),
  };

  if (passwordHash) {
    payload.password_hash = passwordHash;
  }

  if (!payload.password_hash) {
    payload.password = passwordHash;
  }

  const { data, error } = await supabaseServer
    .from("tai_khoan")
    .insert([payload])
    .select();

  if (error) {
    throw error;
  }

  return { table: "tai_khoan", user: data?.[0] ?? null };
}

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

    const passwordHash = hashPassword(password);

    if (!supabaseServer) {
      const userId = createUser({
        name,
        email,
        password: passwordHash,
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
        source: "local",
        message: "Đăng ký thành công.",
        user: { id: userId, name, email, phone, balance, address },
      });
    }

    let createdUser: any = null;
    try {
      createdUser = await createUserInSupabase({ name, email, passwordHash, phone, balance, address });
    } catch (supabaseError: any) {
      console.error("Supabase register failed:", supabaseError);
      return Response.json({
        error: "Không thể tạo tài khoản trên Supabase.",
        detail: supabaseError?.message ?? String(supabaseError),
        hint: "Kiểm tra bảng tai_khoan, cột name/email/password_hash/phone/balance/address/created_at và policy RLS.",
      }, { status: 500 });
    }

    const userId = createdUser?.user?.id ?? 0;
    const cookieStore = await cookies();
    cookieStore.set("session", String(userId), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({
      source: "supabase",
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
  } catch (error: any) {
    console.error("Register route error:", error);
    return Response.json({
      error: "Không thể đăng ký tài khoản.",
      detail: error?.message ?? String(error),
    }, { status: 500 });
  }
}
