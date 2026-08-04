import { Profile } from "@/lib/db";

export default function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative grid-texture border-b border-[var(--line)]">
      <div className="max-w-5xl mx-auto px-6 py-28 md:py-36">
        <div className="finding-id mb-6 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--teal)]" />
          audit-report.md — status: in progress
        </div>

        <h1 className="text-4xl md:text-6xl font-[800] tracking-tight leading-[1.05] mb-6">
          {profile.name}
        </h1>

        {profile.tagline && (
          <p className="text-lg md:text-xl text-[var(--ink-dim)] max-w-2xl leading-relaxed mb-4">
            {profile.tagline}
          </p>
        )}

        {profile.bio && (
          <p className="text-base md:text-lg text-[var(--ink-dim)] max-w-2xl leading-relaxed mb-10">
            {profile.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-3 font-mono-ui text-base">
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[var(--line)] rounded hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors"
            >
              github →
            </a>
          )}
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[var(--line)] rounded hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors"
            >
              linkedin →
            </a>
          )}
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[var(--line)] rounded hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors"
            >
              resume →
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="px-4 py-2 border border-[var(--line)] rounded hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors"
            >
              email →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
