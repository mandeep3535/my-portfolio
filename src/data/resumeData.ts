// ============================================================
// resumeData.ts
// All portfolio content derived directly from Mandeep's resume.
// Edit this file to update any portfolio information.
// Fields marked TODO need real links / content added.
// ============================================================

export interface Project {
  name: string;
  period: string;
  tech: string[];
  github: string | null;
  demo: string | null;
  bullets: string[];
  highlight: string | null;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface EducationItem {
  degree: string;
  school: string;
  year: string;
  honors: string;
}

export interface CourseItem {
  subject: string;
  grade: string;
}

export interface ResumeData {
  name: string;
  title: string;
  contact: {
    phone: string;
    email: string;
    github: string;
    linkedin: string;
  };
  about: string;
  skills: {
    backend: string[];
    frontend: string[];
    tools: string[];
  };
  experience: ExperienceItem[];
  projects: Project[];
  education: EducationItem[];
  awards: string[];
  coursework: CourseItem[];
  resumeUrl: string | null;
}

const resumeData: ResumeData = {
  name: "Mandeep Singh",
  title: "Full-Stack Developer · CS Graduate (UBC)",

  contact: {
    phone: "",
    email: "meritmandeep35@gmail.com",
    github: "https://github.com/mandeep3535",
    linkedin: "https://linkedin.com/in/mandeep-singh-3ab425228",
  },

  about: `Hi! I'm Mandeep Singh — a Computer Science graduate from the University of British Columbia (UBC, 2025) with a 9.2/10 GPA and Dean's List recognition. I love building full-stack applications: clean React frontends, robust Spring Boot services, and everything in between. I've shipped production-grade microservices, containerised with Docker, and topped my class with multiple A+ grades. Currently open to full-stack, backend, or software engineering roles.`,

  skills: {
    backend: [
      "Java",
      "Spring Boot",
      "MySQL",
      "PHP",
      "REST APIs",
      "JPA (Hibernate)",
      "JWT Authentication",
      "CRUD Operations",
      "Microservices",
      "Postman",
    ],
    frontend: [
      "React.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Bootstrap",
      "Axios / Fetch API",
      "Responsive Design",
    ],
    tools: [
      "Docker",
      "Git",
      "JDBC",
      "JUnit",
      "LAMP",
      "AI Tools",
      "CI/CD",
      "Prometheus",
      "Grafana",
      "OOP",
      "Algorithms",
      "Distributed Systems",
    ],
  },

  experience: [
    {
      role: "Technical Support Specialist",
      company: "Rogers Communications",
      period: "Jan 2022 – Sep 2023",
      location: "Kelowna, BC (Remote)",
      bullets: [
        "Resolved complex issues involving network connectivity, software glitches, and hardware malfunctions — handling ~30 tickets per day while maintaining high CSAT.",
        "Documented problems and resolutions in the internal knowledge base, improving future troubleshooting accuracy and reducing repeat incidents.",
        "Trained & mentored 4 new employees on diagnostic tools, escalation procedures, and best practices, strengthening overall team efficiency.",
      ],
    },
  ],

  projects: [
    {
      name: "TA Allocation & Management System (UBC)",
      period: "May – Aug 2025",
      tech: ["React", "TypeScript", "Spring Boot", "Tailwind CSS", "MySQL", "Docker", "Prometheus", "Grafana"],
      github: "https://github.com/mandeep3535", // TODO: replace with specific repo URL
      demo: null,
      bullets: [
        "Built a 5-microservice full-stack platform using Spring Boot REST APIs + React to automate TA allocation, reducing manual workload by ~95%.",
        "Implemented role-based access control and dynamic availability scheduling via FullCalendar.",
        "Used JPA (Hibernate) for persistence; JWT auth for secure access across services.",
        "Containerised all services with Docker; added observability via Prometheus + Grafana.",
        "Ranked UBC's 1st Choice Project for functionality, performance, and usability.",
      ],
      highlight: "UBC 1st Choice Project",
    },
    {
      name: "E-Commerce Electronics Web App",
      period: "Jan – Apr 2025",
      tech: ["HTML", "CSS", "JavaScript", "Bootstrap", "MySQL", "PHP"],
      github: "https://github.com/mandeep3535", // TODO: replace with specific repo URL
      demo: "https://mvelectronics.online",
      bullets: [
        "Built a full-stack e-commerce platform with product catalogue, cart, checkout, and admin order management.",
        "Developed PHP backend with MySQL CRUD operations & AJAX-powered live updates.",
        "Improved checkout responsiveness and page load performance by ~30% via frontend and query optimisation.",
        "Designed scalable database schema and backend logic to support concurrent users.",
      ],
      highlight: null,
    },
    {
      name: "Student Registration System",
      period: "Sept – Dec 2024",
      tech: ["Java", "MySQL", "JDBC", "NetBeans"],
      github: "https://github.com/mandeep3535", // TODO: replace with specific repo URL
      demo: null,
      bullets: [
        "Built a Java-based student registration system using JDBC with MySQL for enrollment and academic record management.",
        "Implemented complete CRUD workflows with real-time input validation.",
        "Designed relational database schema and optimised queries for reliable record storage and retrieval.",
      ],
      highlight: null,
    },
  ],

  education: [
    {
      degree: "Bachelor of Science, Computer Science",
      school: "University of British Columbia (UBC)",
      year: "2025",
      honors: "Dean's List · 9.2/10 GPA",
    },
    {
      degree: "Associate of Science, Mathematics & Statistics",
      school: "Okanagan College",
      year: "2021",
      honors: "Dean's List · 8.3/10 GPA",
    },
  ],

  awards: [
    "Dean's List — Okanagan College & UBC.",
    "Client Project Recognition: TA Allocation System ranked 1st Choice by UBC.",
    "Merit List: Topped the state of Punjab, India, in Secondary Education (96.67%).",
    "Full Scholarship for academic excellence at Meritorious School, Bathinda.",
  ],

  coursework: [
    { subject: "Data Structures", grade: "A" },
    { subject: "Databases", grade: "A+" },
    { subject: "Software Engineering", grade: "A+" },
    { subject: "Data Analytics", grade: "A+" },
    { subject: "Web Programming", grade: "A+" },
    { subject: "Image Processing", grade: "A+" },
  ],

  // TODO: Upload resume PDF and replace null with the public URL
  resumeUrl: "/Mandeep_Resume.pdf",
};

export default resumeData;
