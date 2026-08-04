import { Project } from "@/lib/db";
import { EmptyState } from "./SkillsSection";

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="border-b border-[var(--line)]">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="finding-id mb-2">section 03</div>
        <h2 className="text-2xl md:text-3xl font-[700] mb-10">Projects</h2>

        {projects.length === 0 ? (
          <EmptyState label="No projects published yet — add the first one from the admin panel." />
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((p, i) => (
              <div
                key={p.id}
                className="border border-[var(--line)] rounded-lg p-6 bg-[var(--bg-raised)] hover:border-[var(--amber)] transition-colors"
              >
                <div className="finding-id mb-3">
                  PROJ-{String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-[700] mb-2">{p.title}</h3>
                <p className="text-base text-[var(--ink-dim)] leading-relaxed mb-4">
                  {p.description}
                </p>
                {p.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.split(",").map((t) => (
                      <span
                        key={t}
                        className="font-mono-ui text-[0.8rem] px-2 py-0.5 border border-[var(--line)] rounded text-[var(--ink-dim)]"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 font-mono-ui text-base">
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--teal)] hover:underline"
                    >
                      github →
                    </a>
                  )}
                  {p.demo_url && (
                    <a
                      href={p.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--teal)] hover:underline"
                    >
                      demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
