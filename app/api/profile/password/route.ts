import { cookies } from "next/headers";
import { hashPassword, validatePassword, verifyPassword } from "@/lib/auth";
import { getUserById, updatePasswordById } from "@/lib/db";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("session")?.value || 0);

  if (!userId) {
    return Response.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  const body = await request.json();
  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");
  const confirmPassword = String(body.confirmPassword ?? "");

  const user = getUserById(userId);

  if (!user) {
    return Response.json({ error: "Người dùng không tồn tại." }, { status: 404 });
  }

  if (!verifyPassword(currentPassword, user.password)) {
    return Response.json({ error: "Mật khẩu hiện tại không đúng." }, { status: 400 });
  }

  if (!validatePassword(newPassword)) {
    return Response.json({ error: "Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt." }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return Response.json({ error: "Mật khẩu xác nhận không khớp." }, { status: 400 });
  }

  updatePasswordById(userId, hashPassword(newPassword));

  return Response.json({ message: "Đổi mật khẩu thành công." });
}
