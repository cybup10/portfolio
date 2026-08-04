import db, { ensureSchema, Skill, Project, Certification, Profile, Education } from "@/lib/db";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import CertificationsSection from "@/components/CertificationsSection";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  await ensureSchema();

  const profileResult = await db.execute("SELECT * FROM profile WHERE id = 1");
  const profile = profileResult.rows[0] as unknown as Profile;

  const skillsResult = await db.execute(
    "SELECT * FROM skills ORDER BY category, sort_order, id"
  );
  const skills = skillsResult.rows as unknown as Skill[];

  const projectsResult = await db.execute(
    "SELECT * FROM projects ORDER BY sort_order, id"
  );
  const projects = projectsResult.rows as unknown as Project[];

  const educationResult = await db.execute(
    "SELECT * FROM education ORDER BY sort_order, id"
  );
  const education = educationResult.rows as unknown as Education[];

  const certsResult = await db.execute(
    "SELECT * FROM certifications ORDER BY sort_order, id"
  );
  const certs = certsResult.rows as unknown as Certification[];

  return (
    <>
      <Nav />
      <main>
        <Hero profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <EducationSection items={education} />
        <CertificationsSection certs={certs} />
      </main>
      <Footer profile={profile} />
    </>
  );
}