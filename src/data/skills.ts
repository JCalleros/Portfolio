export type Item = { 
    label: string;
    icon: string 
};

export const ringA: Item[] = [
  { label: "React", icon: "⚛️" },
  { label: "Python", icon: "🐍" },
  { label: "Django", icon: "🧩" },
  { label: "Flask", icon: "🧪" },
  { label: "AWS", icon: "☁️" },
  { label: "Docker", icon: "🐳" },
  { label: "Postgres", icon: "🐘" },
  { label: "MySQL", icon: "🐬" },
];

export const ringB: Item[] = [
  { label: "Git", icon: "🌿" },
  { label: "Linux", icon: "🐧" },
  { label: "Tailwind", icon: "💨" },
  { label: "Next.js", icon: "⏭️" },
];

export const groups: { title: string; items: Item[] }[] = [
  {
    title: "Languages",
    items: [
      { label: "Python", icon: "🐍" },
      { label: "JavaScript", icon: "🟨" },
      { label: "SQL", icon: "🧾" },
    ],
  },
  {
    title: "Frameworks",
    items: [
      { label: "Django", icon: "🧩" },
      { label: "Django REST", icon: "🛰️" },
      { label: "Flask", icon: "🧪" },
      { label: "React", icon: "⚛️" },
      { label: "Next.js", icon: "⏭️" },
      { label: "Tailwind", icon: "💨" },
    ],
  },
  {
    title: "Cloud & DevOps",
    items: [
      { label: "AWS", icon: "☁️" },
      { label: "Docker", icon: "🐳" },
      { label: "CI/CD", icon: "🔁" },
    ],
  },
  {
    title: "Data",
    items: [
      { label: "MySQL", icon: "🐬" },
      { label: "Postgres", icon: "🐘" },
      { label: "Redis", icon: "🧠" },
    ],
  },
  {
    title: "Testing & QA",
    items: [
      { label: "UnitTest", icon: "🧪" },
      { label: "Automation", icon: "🤖" },
    ],
  },
  {
    title: "Tooling",
    items: [
      { label: "Git", icon: "🌿" },
      { label: "Linux", icon: "🐧" },
    ],
  },
];