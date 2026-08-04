import { Education } from "@/lib/db";
import { EmptyState } from "./SkillsSection";

export default function EducationSection({ items }: { items: Education[] }) {
  return (
    <section id="education" className="border-b border-[var(--line)]">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="finding-id mb-2">section 04</div>
        <h2 className="text-2xl md:text-3xl font-[700] mb-10">Education</h2>

        {items.length === 0 ? (
          <EmptyState label="No education entries added yet — add one from the admin panel." />
        ) : (
          <div className="space-y-0">
            {items.map((e) => (
              <div
                key={e.id}
                className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 py-5 border-t border-[var(--line)] last:border-b"
              >
                <span className="font-mono-ui text-sm text-[var(--ink-dim)] md:w-40 shrink-0">
                  {e.years}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-[600]">{e.institution}</h3>
                    {e.status && (
                      <span className="severity-verified font-mono-ui text-[0.8rem] px-2 py-0.5 rounded border">
                        {e.status}
                      </span>
                    )}
                  </div>
                  {e.detail && (
                    <p className="text-base text-[var(--ink-dim)] mt-0.5">
                      {e.detail}
                    </p>
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
