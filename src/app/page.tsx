import db, { Skill, Project, Certification, Profile, Education } from "@/lib/db";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import CertificationsSection from "@/components/CertificationsSection";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get() as Profile;
  const skills = db
    .prepare("SELECT * FROM skills ORDER BY category, sort_order, id")
    .all() as Skill[];
  const projects = db
    .prepare("SELECT * FROM projects ORDER BY sort_order, id")
    .all() as Project[];
  const education = db
    .prepare("SELECT * FROM education ORDER BY sort_order, id")
    .all() as Education[];
  const certs = db
    .prepare("SELECT * FROM certifications ORDER BY sort_order, id")
    .all() as Certification[];

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
