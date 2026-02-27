import type { CompareCategory } from "../../data/projects";

export const COMPARE_CHIPS: { key: CompareCategory; label: string }[] = [
  { key: "details",      label: "Overview"     },
  { key: "architecture", label: "Architecture" },
  { key: "database",     label: "Database"     },
  { key: "auth",         label: "Auth"         },
  { key: "ui",           label: "UI"           },
  { key: "testing",      label: "Testing"      },
];

export default COMPARE_CHIPS;
