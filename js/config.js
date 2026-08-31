"use strict";
const CONFIG = {
  APP_NAME: "DTC Diag Pro",
  VERSION: "4.1.0",
  AUTH_VERSION: 2,               // force la mise à jour du mot de passe sur les anciens appareils
  YEARS: [2017,2018,2019,2020,2021,2022,2023,2024,2025,2026],
  PAGE_SIZE: 50,
  TOTAL_FICHES: 21000,
  K: {
    settings: "dtc_settings_v4",
    overrides: "dtc_overrides_v4",
    customs: "dtc_customs_v4",
    deleted: "dtc_deleted_v4",
    tiers: "dtc_tiers_v4",
    audit: "dtc_audit_v4",
    session: "dtc_session_v4"
  },
  DEFAULT_ADMIN: { user: "admin", pass: "Kevin83600" },
  DEFAULT_TIER: { code: "TIERS-DEMO-2026", name: "Accès démonstration" }
};
