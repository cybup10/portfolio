import { Profile } from "@/lib/db";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p className="font-[600] mb-1">Let&apos;s talk security.</p>
        {profile.email && (
          <a
            href={`mailto:${profile.email}`}
            className="text-[var(--teal)] font-mono-ui text-base hover:underline"
          >
            {profile.email}
          </a>
        )}
      </div>
      <div className="flex gap-4 font-mono-ui text-sm text-[var(--ink-dim)]">
        {profile.github_url && (
          <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--amber)]">
            github
          </a>
        )}
        {profile.linkedin_url && (
          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--amber)]">
            linkedin
          </a>
        )}
      </div>
    </footer>
  );
}
