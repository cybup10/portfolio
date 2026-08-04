export default function Nav() {
  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-[var(--bg)]/80 border-b border-[var(--line)]">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between font-mono-ui text-base">
        <span className="text-[var(--ink-dim)]">trueone.dev</span>
        <div className="flex gap-5">
          <a href="#skills" className="hover:text-[var(--amber)]">
            skills
          </a>
          <a href="#projects" className="hover:text-[var(--amber)]">
            projects
          </a>
          <a href="#education" className="hover:text-[var(--amber)]">
            education
          </a>
          <a href="#certifications" className="hover:text-[var(--amber)]">
            certs
          </a>
        </div>
      </div>
    </nav>
  );
}
