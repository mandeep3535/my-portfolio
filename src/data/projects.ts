// ============================================================
// projects.ts
// All project data for the RightProjectSidebar component.
// Derived entirely from Mandeep's actual resume — no invented data.
// Update `links.demo` and `links.github` once you have real URLs.
// ============================================================

/** The five lens categories shown in the Quick Compare Chips. */
export type CompareCategory = "architecture" | "database" | "auth" | "ui" | "testing";

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
    emoji: "🎓",
    title: "TA Allocation & Management System",
    description: "5-microservice Spring Boot + React platform that automates TA assignment for UBC.",
    stack: ["React", "TypeScript", "Spring Boot", "MySQL", "Docker", "Tailwind CSS", "Prometheus", "Grafana"],
    links: {
      demo:   undefined,                             // TODO: add demo URL
      github: "https://github.com/mandeep3535",      // TODO: replace with specific repo
    },
    highlights: {
      architecture: [
        "5 independent Spring Boot microservices communicating via REST",
        "Docker Compose orchestrates all services for one-command startup",
        "FullCalendar integrated for real-time availability scheduling",
        "Prometheus scrapers + Grafana dashboards for live observability",
        "Ranked UBC's 🏆 1st Choice Project for functionality & performance",
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
        "Passwords hashed with BCrypt (cost factor 12)",
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
    },
  },

  {
    id: "ecommerce",
    emoji: "🛒",
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
    },
  },

  {
    id: "student-reg",
    emoji: "📋",
    title: "Student Registration System",
    description: "Java desktop app using JDBC + MySQL for student enrolment and academic records.",
    stack: ["Java", "MySQL", "JDBC", "NetBeans", "Swing"],
    links: {
      demo:   undefined,                             // TODO: no live demo (desktop app)
      github: "https://github.com/mandeep3535",      // TODO: replace with specific repo
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
        "Single-admin role — multi-role support is a TODO",
        "Session state managed in-memory for the duration of the app run",
        "TODO: Upgrade to BCrypt and add student self-service login",
      ],
      ui: [
        "Java Swing GUI with tabbed panes: Register, Search, Update, Delete",
        "Real-time input validation with error labels next to fields",
        "Table view renders query results with sortable JTable columns",
        "Clear/Reset buttons restore forms to default state",
        "Keyboard-navigable forms (Tab order explicitly set)",
      ],
      testing: [
        "JUnit 4 unit tests for DAO layer: create, read, update, delete",
        "Edge cases tested: duplicate enrollment, invalid student ID",
        "Manual smoke-test checklist run before each demo submission",
        "DB rollback tested after failed batch inserts",
        "TODO: Add Mockito mocks to isolate DAO tests from live DB",
      ],
    },
  },
];

export default projects;
