import Link from "next/link";
import { profile } from "@/data/profile";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center bg-bg text-ink">
      <div className="relative">
        <span className="text-[clamp(6rem,16vw,12rem)] font-black text-purple/15 select-none leading-none">
          404
        </span>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#84a2fc]">
            Page Not Found
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
            Looking for something else?
          </h1>
        </div>
      </div>

      <p className="mt-6 max-w-md text-sm text-muted leading-relaxed">
        The page you are looking for doesn&apos;t exist or has moved. Explore {profile.name}&apos;s verified projects, technical skills, and experience on the homepage.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="glow rounded-xl px-6 py-3 text-xs font-bold text-white transition hover:scale-105"
          style={{ background: "linear-gradient(135deg, #3f66f5 0%, #2d52dc 100%)" }}
        >
          Return to Portfolio
        </Link>
        <Link
          href="/#contact"
          className="rounded-xl border border-line bg-white/[0.03] px-6 py-3 text-xs font-semibold text-muted transition hover:border-purple/40 hover:text-white"
        >
          Contact Abhishek
        </Link>
      </div>
    </div>
  );
}
