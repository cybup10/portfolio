"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Skill = {
  id: number;
  category: string;
  name: string;
  level: number;
  sort_order: number;
};
type Project = {
  id: number;
  title: string;
  description: string;
  tags: string;
  github_url: string;
  demo_url: string;
  sort_order: number;
};
type Cert = {
  id: number;
  name: string;
  issuer: string;
  date_earned: string;
  verify_url: string;
  sort_order: number;
};
type EducationItem = {
  id: number;
  institution: string;
  detail: string;
  years: string;
  status: string;
  sort_order: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<
    "profile" | "skills" | "projects" | "education" | "certs"
  >("profile");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="finding-id mb-1">admin-panel.md</div>
          <h1 className="text-2xl font-[700]">Manage your portfolio</h1>
        </div>
        <div className="flex gap-3">
          <a
            href="/"
            target="_blank"
            className="font-mono-ui text-xs px-3 py-2 border border-[var(--line)] rounded hover:border-[var(--amber)]"
          >
            view site →
          </a>
          <button
            onClick={logout}
            className="font-mono-ui text-xs px-3 py-2 border border-[var(--line)] rounded hover:border-[var(--red)] hover:text-[var(--red)]"
          >
            log out
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 font-mono-ui text-sm">
        {(["profile", "skills", "projects", "education", "certs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded border ${
              tab === t
                ? "border-[var(--amber)] text-[var(--amber)]"
                : "border-[var(--line)] text-[var(--ink-dim)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "profile" && <ProfileAdmin />}
      {tab === "skills" && <SkillsAdmin />}
      {tab === "projects" && <ProjectsAdmin />}
      {tab === "education" && <EducationAdmin />}
      {tab === "certs" && <CertsAdmin />}
    </main>
  );
}

/* ---------------- Profile ---------------- */

function ProfileAdmin() {
  const empty = {
    name: "",
    tagline: "",
    bio: "",
    github_url: "",
    linkedin_url: "",
    email: "",
    resume_url: "",
  };
  const [form, setForm] = useState(empty);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name ?? "",
          tagline: data.tagline ?? "",
          bio: data.bio ?? "",
          github_url: data.github_url ?? "",
          linkedin_url: data.linkedin_url ?? "",
          email: data.email ?? "",
          resume_url: data.resume_url ?? "",
        });
        setLoading(false);
      });
  }, []);

  async function save() {
    setSaved(false);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <p className="font-mono-ui text-sm text-[var(--ink-dim)]">loading...</p>
    );
  }

  return (
    <div className="border border-[var(--line)] rounded-lg p-5 bg-[var(--bg-raised)] space-y-4 max-w-2xl">
      <div>
        <label className="block font-mono-ui text-xs text-[var(--ink-dim)] mb-1">
          name
        </label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
        />
      </div>

      <div>
        <label className="block font-mono-ui text-xs text-[var(--ink-dim)] mb-1">
          tagline (short, one line)
        </label>
        <input
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
        />
      </div>

      <div>
        <label className="block font-mono-ui text-xs text-[var(--ink-dim)] mb-1">
          bio (a sentence or two)
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-mono-ui text-xs text-[var(--ink-dim)] mb-1">
            github url
          </label>
          <input
            value={form.github_url}
            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            placeholder="https://github.com/yourname"
            className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
        </div>
        <div>
          <label className="block font-mono-ui text-xs text-[var(--ink-dim)] mb-1">
            linkedin url
          </label>
          <input
            value={form.linkedin_url}
            onChange={(e) =>
              setForm({ ...form, linkedin_url: e.target.value })
            }
            placeholder="https://linkedin.com/in/yourname"
            className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
        </div>
        <div>
          <label className="block font-mono-ui text-xs text-[var(--ink-dim)] mb-1">
            email
          </label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
        </div>
        <div>
          <label className="block font-mono-ui text-xs text-[var(--ink-dim)] mb-1">
            resume url
          </label>
          <input
            value={form.resume_url}
            onChange={(e) => setForm({ ...form, resume_url: e.target.value })}
            placeholder="link to your resume PDF"
            className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
        </div>
      </div>

      <p className="font-mono-ui text-xs text-[var(--ink-dim)] leading-relaxed">
        Resume link options: (1) upload your resume PDF to Google Drive, set
        sharing to &quot;anyone with the link&quot;, paste that link here. Or
        (2) put a file named <code>resume.pdf</code> in this project&apos;s{" "}
        <code>public</code> folder and use <code>/resume.pdf</code> here.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          className="px-4 py-2 rounded border border-[var(--amber)] text-[var(--amber)] font-mono-ui text-sm hover:bg-[var(--amber)] hover:text-[#0a0d0c]"
        >
          save profile
        </button>
        {saved && (
          <span className="severity-verified font-mono-ui text-xs px-2 py-1 rounded border">
            saved
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------------- Skills ---------------- */

function SkillsAdmin() {
  const [items, setItems] = useState<Skill[]>([]);
  const [form, setForm] = useState({ category: "", name: "", level: 3 });
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/skills");
    setItems(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form.category || !form.name) return;
    if (editingId) {
      await fetch(`/api/skills/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ category: "", name: "", level: 3 });
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    load();
  }

  function edit(item: Skill) {
    setEditingId(item.id);
    setForm({ category: item.category, name: item.name, level: item.level });
  }

  return (
    <div>
      <div className="border border-[var(--line)] rounded-lg p-5 mb-8 bg-[var(--bg-raised)]">
        <p className="font-mono-ui text-xs text-[var(--ink-dim)] mb-3">
          {editingId ? "editing skill" : "add a skill"}
        </p>
        <div className="grid sm:grid-cols-4 gap-3">
          <input
            placeholder="category (e.g. Smart Contract Security)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="sm:col-span-2 bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
          <input
            placeholder="skill name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
          <select
            value={form.level}
            onChange={(e) =>
              setForm({ ...form, level: Number(e.target.value) })
            }
            className="bg-[var(--bg)] border border-[var(--line)] rounded px-3 py-2 text-sm"
          >
            <option value={1}>learning</option>
            <option value={2}>familiar</option>
            <option value={3}>proficient</option>
            <option value={4}>strong</option>
            <option value={5}>expert</option>
          </select>
        </div>
        <button
          onClick={save}
          className="mt-3 px-4 py-2 rounded border border-[var(--amber)] text-[var(--amber)] font-mono-ui text-sm hover:bg-[var(--amber)] hover:text-[#0a0d0c]"
        >
          {editingId ? "save changes" : "add skill"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ category: "", name: "", level: 3 });
            }}
            className="mt-3 ml-2 px-4 py-2 rounded border border-[var(--line)] font-mono-ui text-sm text-[var(--ink-dim)]"
          >
            cancel
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between border border-[var(--line)] rounded px-4 py-3"
          >
            <div>
              <span className="font-[600]">{s.name}</span>
              <span className="font-mono-ui text-xs text-[var(--ink-dim)] ml-3">
                {s.category} · level {s.level}
              </span>
            </div>
            <div className="flex gap-3 font-mono-ui text-xs">
              <button
                onClick={() => edit(s)}
                className="text-[var(--teal)] hover:underline"
              >
                edit
              </button>
              <button
                onClick={() => remove(s.id)}
                className="text-[var(--red)] hover:underline"
              >
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Projects ---------------- */

function ProjectsAdmin() {
  const empty = {
    title: "",
    description: "",
    tags: "",
    github_url: "",
    demo_url: "",
  };
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/projects");
    setItems(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form.title || !form.description) return;
    if (editingId) {
      await fetch(`/api/projects/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm(empty);
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

  function edit(item: Project) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      tags: item.tags,
      github_url: item.github_url,
      demo_url: item.demo_url,
    });
  }

  return (
    <div>
      <div className="border border-[var(--line)] rounded-lg p-5 mb-8 bg-[var(--bg-raised)] space-y-3">
        <p className="font-mono-ui text-xs text-[var(--ink-dim)]">
          {editingId ? "editing project" : "add a project"}
        </p>
        <input
          placeholder="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
        />
        <textarea
          placeholder="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
        />
        <input
          placeholder="tags, comma separated (e.g. Solidity, Foundry)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            placeholder="github url"
            value={form.github_url}
            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            className="bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
          <input
            placeholder="demo url"
            value={form.demo_url}
            onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
            className="bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
        </div>
        <button
          onClick={save}
          className="px-4 py-2 rounded border border-[var(--amber)] text-[var(--amber)] font-mono-ui text-sm hover:bg-[var(--amber)] hover:text-[#0a0d0c]"
        >
          {editingId ? "save changes" : "add project"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm(empty);
            }}
            className="ml-2 px-4 py-2 rounded border border-[var(--line)] font-mono-ui text-sm text-[var(--ink-dim)]"
          >
            cancel
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border border-[var(--line)] rounded px-4 py-3"
          >
            <div>
              <span className="font-[600]">{p.title}</span>
              <p className="font-mono-ui text-xs text-[var(--ink-dim)] mt-1 max-w-md truncate">
                {p.description}
              </p>
            </div>
            <div className="flex gap-3 font-mono-ui text-xs shrink-0 ml-4">
              <button
                onClick={() => edit(p)}
                className="text-[var(--teal)] hover:underline"
              >
                edit
              </button>
              <button
                onClick={() => remove(p.id)}
                className="text-[var(--red)] hover:underline"
              >
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Education ---------------- */

function EducationAdmin() {
  const empty = { institution: "", detail: "", years: "", status: "" };
  const [items, setItems] = useState<EducationItem[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/education");
    setItems(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form.institution) return;
    if (editingId) {
      await fetch(`/api/education/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm(empty);
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    await fetch(`/api/education/${id}`, { method: "DELETE" });
    load();
  }

  function edit(item: EducationItem) {
    setEditingId(item.id);
    setForm({
      institution: item.institution,
      detail: item.detail,
      years: item.years,
      status: item.status,
    });
  }

  return (
    <div>
      <div className="border border-[var(--line)] rounded-lg p-5 mb-8 bg-[var(--bg-raised)] space-y-3">
        <p className="font-mono-ui text-sm text-[var(--ink-dim)]">
          {editingId ? "editing entry" : "add an education entry"}
        </p>
        <input
          placeholder="institution (e.g. your college name)"
          value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
          className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
        />
        <input
          placeholder="detail (e.g. B.E. Computer Science, or PU stream)"
          value={form.detail}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
          className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            placeholder="years (e.g. 2023 — present)"
            value={form.years}
            onChange={(e) => setForm({ ...form, years: e.target.value })}
            className="bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
          <input
            placeholder="status badge, optional (e.g. currently studying)"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
        </div>
        <button
          onClick={save}
          className="px-4 py-2 rounded border border-[var(--amber)] text-[var(--amber)] font-mono-ui text-sm hover:bg-[var(--amber)] hover:text-[#0a0d0c]"
        >
          {editingId ? "save changes" : "add entry"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm(empty);
            }}
            className="ml-2 px-4 py-2 rounded border border-[var(--line)] font-mono-ui text-sm text-[var(--ink-dim)]"
          >
            cancel
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between border border-[var(--line)] rounded px-4 py-3"
          >
            <div>
              <span className="font-[600]">{e.institution}</span>
              <span className="font-mono-ui text-sm text-[var(--ink-dim)] ml-3">
                {e.detail} · {e.years}
              </span>
            </div>
            <div className="flex gap-3 font-mono-ui text-sm">
              <button
                onClick={() => edit(e)}
                className="text-[var(--teal)] hover:underline"
              >
                edit
              </button>
              <button
                onClick={() => remove(e.id)}
                className="text-[var(--red)] hover:underline"
              >
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Certifications ---------------- */

function CertsAdmin() {
  const empty = { name: "", issuer: "", date_earned: "", verify_url: "" };
  const [items, setItems] = useState<Cert[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/certifications");
    setItems(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form.name || !form.issuer) return;
    if (editingId) {
      await fetch(`/api/certifications/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm(empty);
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    await fetch(`/api/certifications/${id}`, { method: "DELETE" });
    load();
  }

  function edit(item: Cert) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      issuer: item.issuer,
      date_earned: item.date_earned,
      verify_url: item.verify_url,
    });
  }

  return (
    <div>
      <div className="border border-[var(--line)] rounded-lg p-5 mb-8 bg-[var(--bg-raised)] space-y-3">
        <p className="font-mono-ui text-xs text-[var(--ink-dim)]">
          {editingId ? "editing certification" : "add a certification"}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            placeholder="certification name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
          <input
            placeholder="issuer"
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            className="bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
          <input
            placeholder="date earned (e.g. Aug 2026)"
            value={form.date_earned}
            onChange={(e) => setForm({ ...form, date_earned: e.target.value })}
            className="bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
          <input
            placeholder="verify url"
            value={form.verify_url}
            onChange={(e) => setForm({ ...form, verify_url: e.target.value })}
            className="bg-transparent border border-[var(--line)] rounded px-3 py-2 text-sm focus:border-[var(--amber)] outline-none"
          />
        </div>
        <button
          onClick={save}
          className="px-4 py-2 rounded border border-[var(--amber)] text-[var(--amber)] font-mono-ui text-sm hover:bg-[var(--amber)] hover:text-[#0a0d0c]"
        >
          {editingId ? "save changes" : "add certification"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm(empty);
            }}
            className="ml-2 px-4 py-2 rounded border border-[var(--line)] font-mono-ui text-sm text-[var(--ink-dim)]"
          >
            cancel
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between border border-[var(--line)] rounded px-4 py-3"
          >
            <div>
              <span className="font-[600]">{c.name}</span>
              <span className="font-mono-ui text-xs text-[var(--ink-dim)] ml-3">
                {c.issuer}
              </span>
            </div>
            <div className="flex gap-3 font-mono-ui text-xs">
              <button
                onClick={() => edit(c)}
                className="text-[var(--teal)] hover:underline"
              >
                edit
              </button>
              <button
                onClick={() => remove(c.id)}
                className="text-[var(--red)] hover:underline"
              >
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
