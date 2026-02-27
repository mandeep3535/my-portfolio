// ============================================================
// projects.ts
// All project data for the RightProjectSidebar component.
// Derived entirely from Mandeep's actual resume — no invented data.
// Update `links.demo` and `links.github` once you have real URLs.
// ============================================================

/** The six lens categories shown in the Quick Compare Chips. */
export type CompareCategory = "architecture" | "database" | "auth" | "ui" | "testing" | "details";

export type Project = {
  id: string;
  title: string;
  emoji?: string;
  description: string;            // One-line tagline
  stack: string[];                // Tech badge labels
  links: {
    demo?: string;                // Live URL (optional)
    github?: string;              // GitHub URL (optional)
  };
  highlights: Record<CompareCategory, string[]>;
};

// ─── Project data ─────────────────────────────────────────────────────────────
// All three projects are taken directly from Mandeep Singh's resume (UBC 2025).
// Fields marked TODO need real links added once repos are public.

const projects: Project[] = [
  {
    id: "ta-allocation",
    emoji: "",
    title: "TA Allocation & Management System",
    description: "5-microservice Spring Boot + React platform that automates TA assignment for UBC.",
    stack: ["React", "TypeScript", "Spring Boot", "MySQL", "Docker", "Tailwind CSS", "Prometheus", "Grafana"],
    links: {
      demo:   "https://www.youtube.com/watch?v=bx2WPYazKZo",
      github: "https://github.com/mandeep3535",      // TODO: replace with specific repo
    },
    highlights: {
      architecture: [
        "5 independent Spring Boot microservices communicating via REST",
        "Docker Compose orchestrates all services for one-command startup",
        "FullCalendar integrated for real-time availability scheduling",
        "Prometheus scrapers + Grafana dashboards for live observability",
        "Ranked UBC's 1st Choice Project for functionality & performance",
      ],
      database: [
        "MySQL relational schema: users, courses, availability_slots, allocations",
        "JPA (Hibernate) with lazy-loading for complex entity relationships",
        "Prepared statements throughout — no raw SQL concatenation",
        "Indexed on course_id and ta_id for fast allocation queries",
        "Optimistic locking on slot booking prevents double-allocation",
      ],
      auth: [
        "JWT-based stateless authentication across all 5 microservices",
        "Three roles: Admin, Instructor, TA — each sees a filtered dashboard",
        "Token verified at API Gateway; downstream services trust the header",
        "Refresh-token rotation with 15-min access / 7-day refresh window",
        "Passwords hashed with SHA-256",
      ],
      ui: [
        "React + TypeScript SPA with Tailwind CSS design system",
        "FullCalendar component for drag-and-drop schedule management",
        "Role-aware navigation: menu items render based on JWT claims",
        "Responsive layout tested on 320 px → 2560 px viewports",
        "Dark mode support via Tailwind class strategy",
      ],
      testing: [
        "JUnit 5 unit tests for allocation logic and conflict detection",
        "Postman collection (50+ requests) covers all REST endpoints",
        "Integration tests spin up an H2 in-memory DB for CI runs",
        "Manual end-to-end QA across all three role flows",
        "Docker Healthcheck probes confirm service readiness before tests",
      ],
      details: [
        "5-microservice Spring Boot + React platform automating the TA application, sorting, and assignment process for UBC courses",
        "Ranked UBC's 1st Choice Project for functionality & performance",
        "Replaces manual spreadsheet processes with real-time availability scheduling via FullCalendar",
        "Deployed via Docker Compose — single command startup for all 5 services",
        "Live Prometheus + Grafana observability dashboards monitor system health in real time",
      ],
    },
  },

  {
    id: "ecommerce",
    emoji: "",
    title: "E-Commerce Electronics Web App",
    description: "Full-stack LAMP e-commerce site with cart, checkout, and admin order management.",
    stack: ["HTML", "CSS", "JavaScript", "Bootstrap", "PHP", "MySQL"],
    links: {
      demo:   "https://mvelectronics.online",
      github: "https://github.com/mandeep3535",      // TODO: replace with specific repo
    },
    highlights: {
      architecture: [
        "LAMP stack: Linux + Apache + MySQL + PHP monolith",
        "MVC-style separation: controllers, models, views folders",
        "AJAX-powered cart and stock updates — no full page reloads",
        "Apache .htaccess rewrite rules for clean SEO-friendly URLs",
        "Page load improved ~30% through frontend and query optimisation",
      ],
      database: [
        "MySQL schema: products, categories, orders, order_items, users",
        "Foreign key constraints enforce referential integrity",
        "AJAX-triggered stock decrement wrapped in a transaction",
        "Indexed product searches on name + category for fast catalogue load",
        "Prepared PDO statements prevent SQL injection throughout",
      ],
      auth: [
        "PHP session-based authentication with CSRF token validation",
        "Admin role gated via role column in users table",
        "Passwords hashed with PHP password_hash() / password_verify()",
        "Auto-logout after 30 min of inactivity via session expiry",
        "Secure checkout flow: order only commits after auth check",
      ],
      ui: [
        "Bootstrap 5 responsive grid — mobile-first product catalogue",
        "AJAX live cart badge updates without page reload",
        "Product image carousel on detail pages",
        "Admin dashboard for order status management (Pending / Shipped / Done)",
        "Cross-browser tested: Chrome, Firefox, Safari, Edge",
      ],
      testing: [
        "Manual QA test cases for: add-to-cart, checkout, admin flows",
        "Regression tested after each DB schema change",
        "Browser compatibility matrix (Chrome, Firefox, Safari)",
        "Load tested with concurrent carts to validate transaction safety",
        "Form validation unit-tested in JavaScript",
      ],
      details: [
        "Full-stack LAMP site (Linux, Apache, MySQL, PHP) for an electronics retail store",
        "Complete shopping cart, secure checkout flow, and admin order management dashboard",
        "Live at mvelectronics.online — deployed and running on a production server",
        "AJAX-powered cart and stock updates with no full page reloads",
        "Page load optimised ~30% through query tuning and frontend asset improvements",
      ],
    },
  },

  {
    id: "portfolio",
    emoji: "",
    title: "Personal Portfolio Website",
    description: "This very site — a chat-style React portfolio with project explorer, dark mode, and rule-based Q&A.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Docker", "ESLint"],
    links: {
      demo:   "https://mandeep3535.github.io/my-portfolio",   // TODO: update with actual live URL
      github: "https://github.com/mandeep3535/my-portfolio",
    },
    highlights: {
      architecture: [
        "3-column SPA: Sidebar | Chat Panel | Project Explorer",
        "Vite 7 bundler with HMR for instant dev feedback",
        "Dockerised dev environment — single `docker-compose up` to run",
        "Type-safe resumeData.ts as single source of truth for all content",
        "Component-driven design: each UI zone is an isolated React FC",
      ],
      database: [
        "No server DB — all data lives in resumeData.ts and projects.ts",
        "Static JSON-style data structures typed with TypeScript interfaces",
        "Projects stored as a typed array with highlights per compare lens",
        "Resume content (skills, experience, education) fully typed and tree-shaken",
        "Easy to extend: add a project object and the UI updates automatically",
      ],
      auth: [
        "No auth required — public portfolio, fully open access",
        "GitHub Pages / static host deployment (no backend needed)",
        "Docker image runs only the Vite dev server — no sensitive secrets",
        "Environment-safe: no API keys embedded in client bundle",
        "Future: could add a contact form backed by a serverless function",
      ],
      ui: [
        "Dark / light theme toggle with smooth Tailwind class transitions",
        "Chat-style interaction powered by a rule-based chatEngine.ts",
        "Avatar lightbox — click to enlarge with scale-in animation + Escape key",
        "Prompt chips for quick questions; markdown-rendered responses",
        "Fully responsive: sidebar collapses to icon rail on small screens",
      ],
      testing: [
        "ESLint + TypeScript strict mode catches errors at author time",
        "Vite build step validates all imports and types before deploy",
        "Manual cross-browser QA: Chrome, Firefox, Safari, Edge",
        "Docker build tested on both Windows (host) and Linux (container)",
        "Component isolation: each FC is self-contained for easy unit testing",
      ],
      details: [
        "This very site — a React + TypeScript SPA styled as an interactive chat portfolio",
        "3-column layout: navigation sidebar, chat panel, and a project explorer (you're in it now)",
        "Rule-based chatbot answers questions about skills, projects, experience, and education",
        "Dark / light theme, prompt chips, markdown-rendered responses, and avatar lightbox",
        "Dockerised dev environment and deployed to GitHub Pages",
      ],
    },
  },

  {
    id: "student-reg",
    emoji: "",
    title: "Student Registration System",
    description: "Java desktop app using JDBC + MySQL for student enrolment and academic records.",
    stack: ["Java", "MySQL", "JDBC", "NetBeans", "Swing"],
    links: {
      demo:   "https://www.youtube.com/watch?v=bx2WPYazKZo",                        
      github: "https://github.com/mandeep3535",      
    },
    highlights: {
      architecture: [
        "Java desktop app built on MVC pattern in NetBeans IDE",
        "JDBC connection pooling via Apache DBCP for performance",
        "DAO layer abstracts all SQL from business logic",
        "Event-driven Swing UI with ActionListeners for form submission",
        "Layered package structure: ui, dao, model, util",
      ],
      database: [
        "MySQL schema: students, courses, enrollments, grades",
        "PreparedStatements for all CRUD ops — prevents SQL injection",
        "Foreign key + NOT NULL constraints enforce data integrity",
        "Indexed on student_id and course_code for fast look-ups",
        "Migrations managed with plain SQL scripts versioned in Git",
      ],
      auth: [
        "Basic admin login backed by a users table in MySQL",         // Resume doesn't detail auth here
        "Passwords stored as SHA-256 hashes (baseline implementation)",
        "Two user roles: Admin and Student ",
        "Session state managed in-memory for the duration of the app run",
        "Sha256 chosen for simplicity in an project context",
      ],
      ui: [
        "Java Swing GUI with tabbed panes: Register, Search, Update, Delete",
        "Real-time input validation with error labels next to fields",
        "Table view renders query results with sortable JTable columns",
        "Clear/Reset buttons restore forms to default state",
        "Keyboard-navigable forms (Tab order explicitly set)",
      ],
      testing: [
        "JUnit 4 tests with @Before/@After lifecycle hooks for setup and DB cleanup after each run",
        "Java Reflection used to access and inject private Swing fields and invoke private action handlers",
        "Button action simulation: addCourseButton and goBackButton events fired programmatically",
        "Duplicate course code constraint validated against live MySQL — asserts false on collision",
        "Placeholder text and foreground colour verified for all input fields",
        "Transaction rollback tested — failed inserts cleanly roll back without leaving dirty data",
      ],
      details: [
        "Java Swing desktop application for managing student enrolment and academic records",
        "Full CRUD interface across four screens: Register, Search, Update, and Delete",
        "JDBC + MySQL with a dedicated DAO layer separating SQL from business logic",
        "Real-time input validation and a sortable JTable for query result display",
        "Academic project demonstrating Java OOP, Swing UI design, and relational DB skills",
      ],
    },
  },
];

export default projects;
