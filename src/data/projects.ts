export type Project = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  tags: string[];
  links?: { demo?: string; repo?: string };
  metrics?: { label: string; value: string }[];
  body?: string[];
};

const projects: Project[] = [
  {
    slug: "buildinhub",
    title: "BuildInHUB",
    summary:
      "Real estate & construction platform. Django REST API + Next.js; Dockerized dev stack.",
    image: "https://res.cloudinary.com/dqcfzldat/image/upload/v1756942788/image_2025-09-03_163948809_ufx1cq.png",
    tags: ["Django","DRF","Postgres","Redis","Next.js","Tailwind","Docker","Nginx","Vercel","CI/CD"],
    links: { demo: "#", repo: "#" },
    body: [
      "BuildInHUB connects contractors and clients, streamlining progress tracking and collaboration with a clean UX.",
      "I designed a modular Django REST API with solid auth and RBAC, and a Next.js front-end that ships reliably on Vercel.",
      "Local dev is fully containerized with Docker Compose; production uses CI to build and verify before deploy."
    ],
  },
  {
    slug: "buildinhub1",
    title: "BuildInHUB1",
    summary:
      "Real estate & construction platform. Django REST API + Next.js; Dockerized dev stack.",
    image: "https://res.cloudinary.com/dqcfzldat/image/upload/v1756942788/image_2025-09-03_163948809_ufx1cq.png",
    tags: ["Django","DRF"],
    links: { demo: "#", repo: "#" },
    body: [
      "BuildInHUB connects contractors and clients, streamlining progress tracking and collaboration with a clean UX.",
      "I designed a modular Django REST API with solid auth and RBAC, and a Next.js front-end that ships reliably on Vercel.",
      "Local dev is fully containerized with Docker Compose; production uses CI to build and verify before deploy."
    ],
  },
  {
    slug: "buildinhub2",
    title: "BuildInHUB2",
    summary:
      "Real estate & construction platform. Django REST API + Next.js; Dockerized dev stack.",
    image: "https://res.cloudinary.com/dqcfzldat/image/upload/v1756942788/image_2025-09-03_163948809_ufx1cq.png",
    tags: ["Django","DRF","Postgres","Redis","Next.js","Tailwind"],
    links: { demo: "#", repo: "#" },
    body: [
      "BuildInHUB connects contractors and clients, streamlining progress tracking and collaboration with a clean UX.",
      "I designed a modular Django REST API with solid auth and RBAC, and a Next.js front-end that ships reliably on Vercel.",
      "Local dev is fully containerized with Docker Compose; production uses CI to build and verify before deploy."
    ],
  },
  {
    slug: "buildinhub3",
    title: "BuildInHUB3",
    summary:
      "Real estate & construction platform. Django REST API + Next.js; Dockerized dev stack.",
    image: "https://res.cloudinary.com/dqcfzldat/image/upload/v1756942788/image_2025-09-03_163948809_ufx1cq.png",
    tags: ["Django"],
    links: { demo: "#", repo: "#" },
    body: [
      "BuildInHUB connects contractors and clients, streamlining progress tracking and collaboration with a clean UX.",
      "I designed a modular Django REST API with solid auth and RBAC, and a Next.js front-end that ships reliably on Vercel.",
      "Local dev is fully containerized with Docker Compose; production uses CI to build and verify before deploy."
    ],
  },
  {
    slug: "buildinhub4",
    title: "BuildInHUB4",
    summary:
      "Real estate & construction platform. Django REST API + Next.js; Dockerized dev stack.",
    image: "https://res.cloudinary.com/dqcfzldat/image/upload/v1756942788/image_2025-09-03_163948809_ufx1cq.png",
    tags: ["Django","DRF","Postgres","Redis","Next.js","Tailwind","Docker","Nginx","Vercel","CI/CD"],
    links: { demo: "#", repo: "#" },
    body: [
      "BuildInHUB connects contractors and clients, streamlining progress tracking and collaboration with a clean UX.",
      "I designed a modular Django REST API with solid auth and RBAC, and a Next.js front-end that ships reliably on Vercel.",
      "Local dev is fully containerized with Docker Compose; production uses CI to build and verify before deploy."
    ],
  },
];

export default projects;
