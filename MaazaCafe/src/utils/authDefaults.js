/** Bill date string → same day key used in Reports grouping */
export function billDayKey(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return "";

  const firstPart = dateStr.split(",")[0].trim();
  if (firstPart.includes("/")) return firstPart;
  if (firstPart.includes("T")) {
    const [isoDate] = firstPart.split("T");
    return isoDate.split("-").reverse().join("/");
  }
  return firstPart;
}

/** Default credentials (localStorage) — run once on app load; migrates legacy staff* keys */
export function ensureAuthDefaults() {
  if (!localStorage.getItem("adminUser")) {
    localStorage.setItem("adminUser", "Moqeed");
    localStorage.setItem("adminPass", "Moqeed@786");
  }

  if (!localStorage.getItem("ownerUser")) {
    const legacyU = localStorage.getItem("staffUser");
    const legacyP = localStorage.getItem("staffPass");
    if (legacyU && legacyP) {
      localStorage.setItem("ownerUser", legacyU);
      localStorage.setItem("ownerPass", legacyP);
    } else {
      localStorage.setItem("ownerUser", "maaza_staff");
      localStorage.setItem("ownerPass", "Staff@786");
    }
  }

  if (localStorage.getItem("staffAuth") === "true" && localStorage.getItem("ownerAuth") !== "true") {
    localStorage.setItem("ownerAuth", "true");
  }
}
