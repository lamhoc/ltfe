import Link from "next/link";

const options = [
  {
    title: "Mục tiêu nghề nghiệp",
    description:
      "Muốn học sâu hơn về phát triển web và xây dựng các sản phẩm có trải nghiệm tốt cho người dùng.",
  },
  {
    title: "Sở thích",
    description:
      "Đọc tài liệu công nghệ, nghe nhạc và tham gia các dự án nhóm để rèn kỹ năng thực hành.",
  },
  {
    title: "Kỹ năng",
    description:
      "HTML, CSS, JavaScript, React, Next.js, tư duy logic và làm việc nhóm hiệu quả.",
  },
];

export default function SecondPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-16 text-slate-800">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-700"
        >
          ← Quay lại trang chủ
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-lg md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
            Trang cấp 2
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Các nội dung tùy chọn
          </h1>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {options.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
