export type Project = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  gallery?: string[];
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
      "Construction platform to connect with people. Django REST API + Next.js",
    image: "https://res.cloudinary.com/dqcfzldat/image/upload/v1756942788/image_2025-09-03_163948809_ufx1cq.png",
    gallery: [
      "https://res.cloudinary.com/dqcfzldat/image/upload/v1757372814/d98c7da5-707c-4921-819e-49268072958f.png"
    ],
    tags: ["Django","DRF","Postgres","Redis","Next.js","Tailwind"],
    links: { demo: "https://build-in-hub-g5dnwfy3y-jcalleros-projects.vercel.app" },
    body: [
      "BuildInHUB connects contractors and clients, streamlining progress tracking and collaboration with a clean UX.",
      "Designed a modular Django REST API with solid auth and RBAC, and a Next.js front-end that ships reliably on Vercel.",
    ],
  },
  {
    slug: "architectpage",
    title: "Orca Website",
    summary:
      "Webpage to showcase projects, services an architect offers",
    image: "https://res.cloudinary.com/dqcfzldat/image/upload/v1757356594/1d875cf9-db18-42dd-8513-15cc99a26af1.png",
    gallery: [
      "https://res.cloudinary.com/dqcfzldat/image/upload/v1757373487/907d5c9e-7a4c-4f12-b120-e575704b7719.png",
      "https://res.cloudinary.com/dqcfzldat/image/upload/v1757373508/3e1cfb69-6fba-43a0-ac5a-cfb863581995.png",
      "https://res.cloudinary.com/dqcfzldat/image/upload/v1757373542/95d93e1c-3496-4295-beed-f67854fffcbe.png",
      "https://res.cloudinary.com/dqcfzldat/image/upload/v1757373645/e8ba74f1-7bb8-4238-af92-e0641c8c0cf4.png",
    ],
    tags: ["Next.js","Tailwind"],
    links: { demo: "https://orca-website-pi.vercel.app" },
    body: [
      "Built a responsive interface to showcase projects and services.",
    ],
  },
  {
    slug: "vetmanagement",
    title: "VetManagement",
    summary:
      "System to manage patients of a veterinary",
    image: "https://res.cloudinary.com/dqcfzldat/image/upload/v1757358256/3f0308a1-1754-4a5e-ab3b-8939dbd075e1.png",
    gallery: [
      "https://res.cloudinary.com/dqcfzldat/image/upload/v1757362935/36e2d1e9-a345-477a-9d43-923619a6731a.png",
      "https://res.cloudinary.com/dqcfzldat/image/upload/v1757362999/fcdc2c23-0917-4f0b-8d82-83f1334b2f28.png",
    ],
    tags: ["Django","DRF","Postgres","Next.js","Tailwind"],
    links: { demo: "https://vetmanagementwebclient.onrender.com", repo: "https://github.com/JCalleros/VetManagementWebClient" },
    body: [
      "Built a full-stack system with secure API endpoints and a user-friendly interface to streamline clinic operations.",
      "Added JWT-based authentication to improve security and cross-domain compatibility.",
      "Created an automated appointment scheduling feature to help staff manage bookings faster."
    ],
  },
];

export default projects;
