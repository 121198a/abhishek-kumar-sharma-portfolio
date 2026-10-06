import Link from "next/link";
import { profile } from "@/data/profile";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center bg-bg text-ink">
      <div className="relative">
        <span className="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-purple/20 select-none leading-none">
          404
        </span>
        <div className="mt-4 flex flex-col items-center justify-center">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple">
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
          className="btn-primary"
        >
          Return to Portfolio
        </Link>
        <Link
          href="/#contact"
          className="btn-secondary"
        >
          Contact Abhishek
        </Link>
      </div>
    </div>
  );
}
