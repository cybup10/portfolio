import { Skill } from "@/lib/db";

const LEVEL_LABEL: Record<number, { label: string; cls: string }> = {
  1: { label: "learning", cls: "severity-medium" },
  2: { label: "familiar", cls: "severity-medium" },
  3: { label: "proficient", cls: "severity-high" },
  4: { label: "strong", cls: "severity-high" },
  5: { label: "expert", cls: "severity-verified" },
};

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const byCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  const categories = Object.keys(byCategory);

  return (
    <section id="skills" className="border-b border-[var(--line)]">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="finding-id mb-2">section 02</div>
        <h2 className="text-2xl md:text-3xl font-[700] mb-10">Skills</h2>

        {categories.length === 0 ? (
          <EmptyState label="No skills logged yet." />
        ) : (
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {categories.map((cat) => (
              <div key={cat}>
                <h3 className="font-mono-ui text-base uppercase tracking-wider text-[var(--ink-dim)] mb-4">
                  {cat}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {byCategory[cat].map((s) => {
                    const meta = LEVEL_LABEL[s.level] ?? LEVEL_LABEL[3];
                    return (
                      <span
                        key={s.id}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border text-base ${meta.cls}`}
                      >
                        {s.name}
                        <span className="font-mono-ui text-[0.8rem] opacity-70">
                          {meta.label}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-[var(--line)] rounded-lg px-6 py-10 text-center">
      <p className="font-mono-ui text-base text-[var(--ink-dim)]">{label}</p>
    </div>
  );
}
