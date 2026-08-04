import { Certification } from "@/lib/db";
import { EmptyState } from "./SkillsSection";

export default function CertificationsSection({
  certs,
}: {
  certs: Certification[];
}) {
  return (
    <section id="certifications" className="border-b border-[var(--line)]">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="finding-id mb-2">section 05</div>
        <h2 className="text-2xl md:text-3xl font-[700] mb-10">
          Certifications
        </h2>

        {certs.length === 0 ? (
          <EmptyState label="No certifications added yet — add one from the admin panel." />
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certs.map((c) => (
              <div
                key={c.id}
                className="border border-[var(--line)] rounded-lg p-5 bg-[var(--bg-raised)]"
              >
                <div className="severity-verified inline-block font-mono-ui text-[0.8rem] px-2 py-0.5 rounded border mb-3">
                  verified
                </div>
                <h3 className="font-[600] text-base mb-1">{c.name}</h3>
                <p className="text-base text-[var(--ink-dim)]">{c.issuer}</p>
                {c.date_earned && (
                  <p className="font-mono-ui text-[0.85rem] text-[var(--ink-dim)] mt-2">
                    {c.date_earned}
                  </p>
                )}
                {c.verify_url && (
                  <a
                    href={c.verify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-ui text-base text-[var(--teal)] hover:underline mt-3 inline-block"
                  >
                    verify →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
