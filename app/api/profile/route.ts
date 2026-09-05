import { cookies } from "next/headers";
import { getPublicUserById, updateUserById } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("session")?.value || 0);

  if (!userId) {
    return Response.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  const user = getPublicUserById(userId);

  if (!user) {
    return Response.json({ error: "Người dùng không tồn tại." }, { status: 404 });
  }

  return Response.json({ user });
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("session")?.value || 0);

  if (!userId) {
    return Response.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const address = String(body.address ?? "").trim();

  if (!name) {
    return Response.json({ error: "Tên không được để trống." }, { status: 400 });
  }

  const updated = updateUserById(userId, { name, phone, address });

  if (!updated) {
    return Response.json({ error: "Không tìm thấy người dùng." }, { status: 404 });
  }

  const publicUser = getPublicUserById(userId);
  return Response.json({ message: "Cập nhật thông tin thành công.", user: publicUser });
}
