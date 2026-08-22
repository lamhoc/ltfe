import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("session");

  return Response.json({ message: "Đăng xuất thành công." });
}
