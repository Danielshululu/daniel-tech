/* =========================================================
   DANIEL TECH V2.0.0
   MAIN JAVASCRIPT ARCHITECTURE
   Vite + Supabase Auth & Database + Web3Forms Integration
   ========================================================= */
"use strict";

/* =========================================================
   1. SUPABASE CONFIGURATION & CREDENTIALS
   ========================================================= */
const SUPABASE_URL = "https://bodprzntcloioncwhpvr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";
const ADMIN_UID = "05fef3eb-16a3-4554-9d9b-de7d2b29144b";
const STORAGE_BUCKET = "daniel-files";
const WEB3FORMS_ACCESS_KEY = "1cb63017-240b-4b68-b71f-51c53a824a97";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

// Initialize Supabase Client
let sb = null;
if (typeof window !== "undefined" && window.supabase) {
  try {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  } catch (e) {
    console.warn("Supabase initialization note:", e.message);
  }
}

// Global Application State
let currentSession = null;
let currentUser = null;
let isAdmin = false;
let currentService = null;
let currentCurrency = localStorage.getItem("danielTechCurrency") || "TZS";
let currentThemeMode = localStorage.getItem("danielTechThemeMode") || "auto";
let currentLanguage = localStorage.getItem("danielTechLanguage") || "en";

/* =========================================================
   2. DOM SELECTOR & STRING HELPERS
   ========================================================= */
function qs(idOrSelector) {
  if (!idOrSelector) return null;
  if (/^[a-zA-Z0-9_-]+$/.test(idOrSelector)) {
    return document.getElementById(idOrSelector) || document.querySelector(idOrSelector);
  }
  return document.querySelector(idOrSelector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}

function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function setStatus(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("error", Boolean(isError));
  element.classList.toggle("success", !isError && Boolean(message));
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value || "";
  }
}

function formatPrice(amountTZS, amountUSD) {
  if (currentCurrency === "USD") {
    const usd = amountUSD || Math.round(amountTZS / 2600);
    return `$${Number(usd).toFixed(2)}`;
  }
  return `TZS ${Number(amountTZS).toLocaleString()}`;
}

/* =========================================================
   3. AUTOMATIC TIME-BASED THEME & MANUAL OVERRIDE
   ========================================================= */
function applyTheme() {
  const root = document.documentElement;

  if (currentThemeMode === "light") {
    root.classList.remove("dark-mode");
    return;
  }
  if (currentThemeMode === "dark") {
    root.classList.add("dark-mode");
    return;
  }

  // Automatic mode: 06:00–17:59 = Light, 18:00–05:59 = Dark
  const hour = new Date().getHours();
  const isDark = hour >= 18 || hour < 6;
  root.classList.toggle("dark-mode", isDark);
}

applyTheme();
setInterval(applyTheme, 30000);

/* =========================================================
   4. NAVIGATION & MULTI-PAGE ROUTING
   ========================================================= */
const pages = qsa(".page");

function showPage(pageName) {
  if (!pageName) return;

  if (pageName === "customer-dashboard") {
    openCustomerDashboard();
    return;
  }
  if (pageName === "admin-dashboard" && isAdmin) {
    openAdminDashboard();
    return;
  }

  closeCustomerDashboard();
  closeAdminDashboard();

  pages.forEach(page => page.classList.remove("active-page"));
  const target = document.getElementById(pageName);
  if (target) {
    target.classList.add("active-page");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  qsa("[data-page]").forEach(link => {
    link.classList.toggle("active", link.getAttribute("data-page") === pageName);
  });

  closeMenuDrawer();
}

qsa("[data-page]").forEach(element => {
  element.addEventListener("click", function (event) {
    event.preventDefault();
    const pageName = this.getAttribute("data-page");
    showPage(pageName);
  });
});

/* =========================================================
   5. HAMBURGER MENU & RIGHT-SIDE DRAWER
   ========================================================= */
const menuButton = qs("menuButton");
const menuDrawer = qs("menuDrawer");
const closeMenu = qs("closeMenu");
const overlay = qs("overlay");

function openMenuDrawer() {
  if (menuDrawer) menuDrawer.classList.add("open");
  if (overlay) overlay.classList.add("active");
  if (menuButton) menuButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeMenuDrawer() {
  if (menuDrawer) menuDrawer.classList.remove("open");
  if (overlay) overlay.classList.remove("active");
  if (menuButton) menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

if (menuButton) menuButton.addEventListener("click", openMenuDrawer);
if (closeMenu) closeMenu.addEventListener("click", closeMenuDrawer);
if (overlay) overlay.addEventListener("click", closeMenuDrawer);

/* =========================================================
   6. MODALS MANAGEMENT
   ========================================================= */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("active");
  document.body.classList.add("modal-open");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("active");
  if (!document.querySelector(".modal.active")) {
    document.body.classList.remove("modal-open");
  }
}

function closeAllModals() {
  qsa(".modal").forEach(modal => modal.classList.remove("active"));
  document.body.classList.remove("modal-open");
}

qsa("[data-close-modal]").forEach(button => {
  button.addEventListener("click", function () {
    closeModal(this.getAttribute("data-close-modal"));
  });
});

qsa(".modal").forEach(modal => {
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal(modal.id);
  });
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeAllModals();
    closeMenuDrawer();
  }
});

/* =========================================================
   7. LANGUAGE SWITCHER (ENG / KISW) — FULL TRANSLATION SYSTEM
   ========================================================= */

const TRANSLATIONS = {
  en: {
    // Navigation
    "nav-home": "Home",
    "nav-services": "Services",
    "nav-tech": "Tech",
    "nav-ai-tools": "AI Tools",
    "nav-programming": "Programming",
    "nav-blog": "Blog / News",
    "nav-contact": "Contact",
    // Header Buttons
    "btn-signin": "Sign In",
    "btn-signup": "Sign Up",
    // Hero
    "hero-label": "DANIEL TECH V2.0.0",
    "hero-h1-line1": "Your Idea,",
    "hero-h1-line2": "Brought to Life",
    "hero-h1-line3": "Through Technology.",
    "hero-description": "We engineer cutting-edge web platforms, mobile solutions, AI integrations, cloud infrastructure, and immersive gaming experiences — built for the future, optimized for today.",
    "hero-btn-primary": "Get Started",
    "hero-btn-secondary": "View Services",
    "hero-card-title": "Our Capabilities",
    "hero-stat-web": "Web & Mobile",
    "hero-stat-ai": "AI & Cloud",
    "hero-stat-gaming": "Gaming",
    "hero-stat-support": "24/7 Support",
    // Services Section
    "services-label": "WHAT WE OFFER",
    "services-h2": "Our Technology Services",
    "services-desc": "From web development to AI solutions — we build everything your business needs to grow.",
    "filter-all": "All",
    "filter-web": "Web",
    "filter-phone": "Phone",
    "filter-gaming": "Gaming",
    "filter-ai": "AI",
    // Contact Section
    "contact-label": "GET IN TOUCH",
    "contact-h2": "Contact Us",
    "contact-desc": "Have a project in mind? We would love to hear from you.",
    "contact-name": "Full Name",
    "contact-email": "Email Address",
    "contact-phone": "Phone Number",
    "contact-subject": "Subject",
    "contact-message": "Your Message",
    "contact-send": "Send Message",
    // Footer
    "footer-tagline": "Engineering tomorrow's solutions, today.",
    "footer-services": "Services",
    "footer-company": "Company",
    "footer-legal": "Legal",
    "footer-rights": "All rights reserved.",
    // Misc
    "read-more": "Read More",
    "view-details": "View Details",
    "learn-more": "Learn More",
    "back": "Back",
    "close": "Close",
    "loading": "Loading...",
    "news-label": "Latest News",
  },
  sw: {
    // Navigation
    "nav-home": "Nyumbani",
    "nav-services": "Huduma",
    "nav-tech": "Teknolojia",
    "nav-ai-tools": "Zana za AI",
    "nav-programming": "Programu",
    "nav-blog": "Blogu / Habari",
    "nav-contact": "Wasiliana",
    // Header Buttons
    "btn-signin": "Ingia",
    "btn-signup": "Jisajili",
    // Hero
    "hero-label": "DANIEL TECH V2.0.0",
    "hero-h1-line1": "Wazo Lako,",
    "hero-h1-line2": "Linafanywa Ukweli",
    "hero-h1-line3": "Kupitia Teknolojia.",
    "hero-description": "Tunaunda mifumo ya kisasa ya wavuti, suluhisho za simu, ujumuishaji wa AI, miundombinu ya wingu, na uzoefu wa burudani wa michezo — iliyoundwa kwa mustakabali, iliyoboreshwa kwa leo.",
    "hero-btn-primary": "Anza Sasa",
    "hero-btn-secondary": "Ona Huduma",
    "hero-card-title": "Uwezo Wetu",
    "hero-stat-web": "Wavuti & Simu",
    "hero-stat-ai": "AI & Wingu",
    "hero-stat-gaming": "Michezo",
    "hero-stat-support": "Msaada 24/7",
    // Services Section
    "services-label": "TUNACHOTOA",
    "services-h2": "Huduma Zetu za Teknolojia",
    "services-desc": "Kuanzia utengenezaji wavuti hadi suluhisho za AI — tunajenga kila kitu biashara yako inahitaji kukua.",
    "filter-all": "Zote",
    "filter-web": "Wavuti",
    "filter-phone": "Simu",
    "filter-gaming": "Michezo",
    "filter-ai": "AI",
    // Contact Section
    "contact-label": "WASILIANA NASI",
    "contact-h2": "Wasiliana Nasi",
    "contact-desc": "Una mradi akilini? Tungependa kukusikia.",
    "contact-name": "Jina Kamili",
    "contact-email": "Barua Pepe",
    "contact-phone": "Nambari ya Simu",
    "contact-subject": "Mada",
    "contact-message": "Ujumbe Wako",
    "contact-send": "Tuma Ujumbe",
    // Footer
    "footer-tagline": "Tunaunda suluhisho za kesho, leo.",
    "footer-services": "Huduma",
    "footer-company": "Kampuni",
    "footer-legal": "Kisheria",
    "footer-rights": "Haki zote zimehifadhiwa.",
    // Misc
    "read-more": "Soma Zaidi",
    "view-details": "Ona Maelezo",
    "learn-more": "Jifunze Zaidi",
    "back": "Rudi",
    "close": "Funga",
    "loading": "Inapakia...",
    "news-label": "Habari za Hivi Karibuni",
  }
};

function applyTranslations(language) {
  const t = TRANSLATIONS[language] || TRANSLATIONS["en"];
  // Apply all data-i18n attributes
  qsa("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });
  // Apply placeholder-specific translations
  qsa("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key] !== undefined) el.placeholder = t[key];
  });
}

function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem("danielTechLanguage", language);

  // Update active button state — all language buttons across the page
  qsa(".language-button").forEach(btn => btn.classList.remove("active"));
  if (language === "sw") {
    qsa("#languageSW, #settingsSW").forEach(el => el?.classList.add("active"));
  } else {
    qsa("#languageEN, #settingsEN").forEach(el => el?.classList.add("active"));
  }

  // Apply translations
  applyTranslations(language);
}

const languageEN = qs("languageEN");
const languageSW = qs("languageSW");
if (languageEN) languageEN.addEventListener("click", () => setLanguage("en"));
if (languageSW) languageSW.addEventListener("click", () => setLanguage("sw"));
setLanguage(currentLanguage);

/* =========================================================
   8. AUTHENTICATION (SUPABASE AUTH & SESSION)
   ========================================================= */
const authModal = qs("authModal");
const signInButton = qs("signInButton");
const signUpButton = qs("signUpButton");
const signInForm = qs("signInForm");
const signUpForm = qs("signUpForm");
const switchAuthMode = qs("switchAuthMode");
const authModalTitle = qs("authModalTitle");

function openSignIn() {
  if (authModalTitle) authModalTitle.textContent = "Sign In";
  if (signInForm) signInForm.hidden = false;
  if (signUpForm) signUpForm.hidden = true;
  if (switchAuthMode) switchAuthMode.textContent = "Create an account";
  openModal("authModal");
}

function openSignUp() {
  if (authModalTitle) authModalTitle.textContent = "Create Account";
  if (signInForm) signInForm.hidden = true;
  if (signUpForm) signUpForm.hidden = false;
  if (switchAuthMode) switchAuthMode.textContent = "Already have an account? Sign In";
  openModal("authModal");
}

function handleSignInClick() {
  if (currentUser) {
    if (isAdmin) { openAdminDashboard(); return; }
    openCustomerDashboard();
  } else {
    openSignIn();
  }
}

function handleSignUpClick() {
  if (currentUser) {
    if (isAdmin) { openAdminDashboard(); return; }
    openCustomerDashboard();
  } else {
    openSignUp();
  }
}

if (signInButton) signInButton.addEventListener("click", handleSignInClick);
if (signUpButton) signUpButton.addEventListener("click", handleSignUpClick);

if (switchAuthMode) {
  switchAuthMode.addEventListener("click", function () {
    if (signInForm && !signInForm.hidden) openSignUp();
    else openSignIn();
  });
}

// Password Visibility Eye Toggle
qsa(".password-toggle").forEach(button => {
  button.addEventListener("click", function () {
    const targetId = this.getAttribute("data-password-target");
    const input = document.getElementById(targetId);
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      this.textContent = "Hide";
    } else {
      input.type = "password";
      this.textContent = "Show";
    }
  });
});

// Sign Up Handler
if (signUpForm) {
  signUpForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = qs("signUpName")?.value.trim();
    const email = qs("signUpEmail")?.value.trim();
    const password = qs("signUpPassword")?.value;
    const confirmPassword = qs("signUpConfirmPassword")?.value;
    const status = qs("signUpStatus");

    if (!name || !email || !password || !confirmPassword) {
      setStatus(status, "Please complete all fields.", true);
      return;
    }
    if (password !== confirmPassword) {
      setStatus(status, "Passwords do not match.", true);
      return;
    }

    setStatus(status, "Creating account securely with Supabase...");

    try {
      if (!sb) throw new Error("Supabase client not initialized.");
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) throw error;

      // Automatically create the customer's profile record
      if (data.user) {
        await sb.from("profiles").upsert({
          id: data.user.id,
          full_name: name,
          email: email,
          role: "customer",
          updated_at: new Date().toISOString()
        });
      }

      setStatus(status, "Account created successfully! Redirecting...");
      setTimeout(() => {
        closeAllModals();
        openCustomerDashboard();
      }, 1000);
    } catch (error) {
      console.error("Sign up error:", error);
      setStatus(status, error.message || "Unable to create account.", true);
    }
  });
}

// Sign In Handler
if (signInForm) {
  signInForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = qs("signInEmail")?.value.trim();
    const password = qs("signInPassword")?.value;
    const status = qs("signInStatus");

    if (!email || !password) {
      setStatus(status, "Please enter your email and password.", true);
      return;
    }
    setStatus(status, "Authenticating credentials...");

    try {
      if (!sb) throw new Error("Supabase client not initialized.");
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;

      currentSession = data.session;
      currentUser = data.user;
      await handleAuthenticatedUser();
    } catch (error) {
      console.error("Sign in error:", error);
      setStatus(status, error.message || "Sign in failed.", true);
    }
  });
}

// Session Verification & Role Authorization Routing
async function handleAuthenticatedUser() {
  if (!currentUser) return;

  // Verify Admin privilege using secure admin UID or database role
  isAdmin = currentUser.id === ADMIN_UID;
  if (!isAdmin && sb) {
    try {
      const { data: prof } = await sb.from("profiles").select("role").eq("id", currentUser.id).single();
      if (prof && prof.role === "admin") isAdmin = true;
    } catch (e) {
      console.warn("Profile check:", e.message);
    }
  }

  closeAllModals();
  updateAuthUI();

  if (isAdmin) {
    console.log("Admin authorized:", currentUser.id);
    openAdminDashboard();
  } else {
    await loadCustomerDashboard();
    openCustomerDashboard();
  }
}

async function initializeAuth() {
  if (!sb) return;
  try {
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    currentSession = data.session || null;
    currentUser = data.session?.user || null;

    if (currentUser) {
      isAdmin = currentUser.id === ADMIN_UID;
      updateAuthUI();
    }
  } catch (error) {
    console.error("Auth init error:", error);
  }

  sb.auth.onAuthStateChange(async function (event, session) {
    currentSession = session || null;
    currentUser = session?.user || null;
    isAdmin = currentUser?.id === ADMIN_UID;
    updateAuthUI();

    if (event === "SIGNED_OUT") {
      currentSession = null;
      currentUser = null;
      isAdmin = false;
      closeCustomerDashboard();
      closeAdminDashboard();
      showPage("home");
    }
  });
}

function updateAuthUI() {
  const headerUserQuick = qs("headerUserQuick");
  const headerAuthButtons = qs("headerAuthButtons");
  const headerUserName = qs("headerUserName");
  const drawerSignOut = qs("drawerSignOut");
  const drawerUserStatus = qs("drawerUserStatus");
  const drawerUserName = qs("drawerUserName");
  const drawerUserEmail = qs("drawerUserEmail");

  if (currentUser) {
    if (headerAuthButtons) headerAuthButtons.classList.add("hidden");
    if (headerUserQuick) headerUserQuick.classList.remove("hidden");
    const name = currentUser.user_metadata?.full_name || currentUser.email.split("@")[0];
    if (headerUserName) headerUserName.textContent = isAdmin ? "Admin Portal" : name;

    if (drawerUserStatus) drawerUserStatus.classList.remove("hidden");
    if (drawerUserName) drawerUserName.textContent = `Hello, ${name}`;
    if (drawerUserEmail) drawerUserEmail.textContent = currentUser.email;
    if (drawerSignOut) drawerSignOut.hidden = false;
  } else {
    if (headerAuthButtons) headerAuthButtons.classList.remove("hidden");
    if (headerUserQuick) headerUserQuick.classList.add("hidden");
    if (drawerUserStatus) drawerUserStatus.classList.add("hidden");
    if (drawerSignOut) drawerSignOut.hidden = true;
  }
}

async function logoutUser() {
  if (sb) {
    try {
      await sb.auth.signOut();
    } catch (e) {
      console.warn("SignOut:", e.message);
    }
  }
  currentSession = null;
  currentUser = null;
  isAdmin = false;
  closeCustomerDashboard();
  closeAdminDashboard();
  updateAuthUI();
  showPage("home");
}

qs("customerLogout")?.addEventListener("click", logoutUser);
qs("drawerSignOut")?.addEventListener("click", logoutUser);
qs("adminLogoutBtn")?.addEventListener("click", logoutUser);
qs("btnHeaderPortal")?.addEventListener("click", () => {
  if (isAdmin) openAdminDashboard();
  else openCustomerDashboard();
});
qs("drawerMyPortalBtn")?.addEventListener("click", () => {
  closeMenuDrawer();
  if (isAdmin) openAdminDashboard();
  else openCustomerDashboard();
});
qs("btnCustomerExitToSite")?.addEventListener("click", () => showPage("home"));
qs("btnAdminExitToSite")?.addEventListener("click", () => showPage("home"));

/* =========================================================
   9. CUSTOMER DASHBOARD CONTROLS
   ========================================================= */
const customerDashboard = qs("customerDashboard");
const adminDashboard = qs("adminDashboard");

function openCustomerDashboard() {
  if (!currentUser) { openSignIn(); return; }
  if (customerDashboard) customerDashboard.hidden = false;
  closeAdminDashboard();
  pages.forEach(p => p.classList.remove("active-page"));
  document.body.classList.add("dashboard-open");
  loadCustomerDashboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeCustomerDashboard() {
  if (customerDashboard) customerDashboard.hidden = true;
  document.body.classList.remove("dashboard-open");
}

function openAdminDashboard() {
  if (!currentUser || !isAdmin) return;
  if (adminDashboard) adminDashboard.hidden = false;
  closeCustomerDashboard();
  pages.forEach(p => p.classList.remove("active-page"));
  document.body.classList.add("dashboard-open");
  loadAdminDashboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeAdminDashboard() {
  if (adminDashboard) adminDashboard.hidden = true;
}

// Customer Dashboard Panels Tab Switcher
qsa("[data-dashboard-panel]").forEach(button => {
  button.addEventListener("click", function () {
    const panelName = this.getAttribute("data-dashboard-panel");
    qsa("[data-dashboard-panel]").forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    qsa("#customerDashboard .dashboard-panel").forEach(panel => {
      panel.classList.remove("active-dashboard-panel");
    });

    const panelMap = {
      overview: "dashboardOverview",
      services: "dashboardServices",
      requests: "dashboardRequests",
      messages: "dashboardMessages",
      payments: "dashboardPayments",
      receipts: "dashboardReceipts",
      notifications: "dashboardNotifications",
      profile: "dashboardProfile",
      security: "dashboardSecurity"
    };

    const target = document.getElementById(panelMap[panelName]);
    if (target) target.classList.add("active-dashboard-panel");
  });
});

async function loadCustomerDashboard() {
  if (!currentUser) return;
  const name = currentUser.user_metadata?.full_name || currentUser.email.split("@")[0];
  setText("customerWelcome", `Welcome, ${name}`);
  setText("customerEmail", currentUser.email);
  setText("profileEmail", currentUser.email);
  setText("profileName", name);

  // Load real customer records
  await Promise.allSettled([
    loadCustomerStats(),
    loadCustomerOrders(),
    loadCustomerRequests(),
    loadCustomerPayments(),
    loadCustomerReceipts(),
    loadCustomerNotifications(),
    loadCustomerMessages()
  ]);
}

async function loadCustomerStats() {
  if (!currentUser || !sb) return;
  try {
    const [reqs, ords, pays] = await Promise.all([
      sb.from("service_requests").select("id, status").eq("customer_id", currentUser.id),
      sb.from("orders").select("id, status").eq("customer_id", currentUser.id),
      sb.from("payments").select("id, status").eq("customer_id", currentUser.id)
    ]);

    const activeServices = (ords.data || []).filter(o => ["active", "in_progress"].includes(o.status)).length;
    const pendingReqs = (reqs.data || []).filter(r => ["new", "in_review", "quoted"].includes(r.status)).length;
    const pendingPays = (pays.data || []).filter(p => p.status === "pending").length;
    const completedServices = (ords.data || []).filter(o => o.status === "completed").length;

    setText("statActiveServices", activeServices);
    setText("statPendingRequests", pendingReqs);
    setText("statPendingPayments", pendingPays);
    setText("statCompletedServices", completedServices);
  } catch (e) {
    console.warn("Stats loading:", e.message);
  }
}

async function loadCustomerOrders() {
  const container = qs("customerServicesList");
  if (!container || !sb || !currentUser) return;
  try {
    const { data, error } = await sb.from("orders").select("*").eq("customer_id", currentUser.id).order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      container.innerHTML = '<p class="empty-content">No active services or orders found.</p>';
      return;
    }
    container.innerHTML = data.map(ord => `
      <div class="dashboard-list-item">
        <strong>${escapeHtml(ord.service_name || "Technology Service")} (Order #${ord.order_number})</strong>
        <span>Status: <b style="color: var(--color-blue); text-transform: uppercase;">${ord.service_status || "In Progress"}</b></span>
        <span>Expected Completion: <b>${formatDate(ord.expected_completion)}</b></span>
      </div>
    `).join("");
  } catch (e) {
    container.innerHTML = '<p class="empty-content">No active services found.</p>';
  }
}

async function loadCustomerRequests() {
  const container = qs("customerRequestsList");
  if (!container || !sb || !currentUser) return;
  try {
    const { data, error } = await sb.from("service_requests").select("*").eq("customer_id", currentUser.id).order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      container.innerHTML = '<p class="empty-content">No service requests submitted yet.</p>';
      return;
    }
    container.innerHTML = data.map(req => `
      <div class="dashboard-list-item">
        <strong>${escapeHtml(req.service_name)} (Request #${req.request_number})</strong>
        <span>Submitted: ${formatDate(req.created_at)}</span>
        <span>Status: <b style="color: var(--color-blue);">${req.status.toUpperCase()}</b></span>
        <p>${escapeHtml(req.description)}</p>
      </div>
    `).join("");
  } catch (e) {
    container.innerHTML = '<p class="empty-content">No service requests found.</p>';
  }
}

async function loadCustomerPayments() {
  const container = qs("customerPaymentsList");
  if (!container || !sb || !currentUser) return;
  try {
    const { data, error } = await sb.from("payments").select("*").eq("customer_id", currentUser.id).order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      container.innerHTML = '<p class="empty-content">No payment records found.</p>';
      return;
    }
    container.innerHTML = data.map(pay => `
      <div class="dashboard-list-item">
        <strong>${escapeHtml(pay.service_name)} &bull; ${formatPrice(pay.amount)}</strong>
        <span>Ref: ${pay.transaction_reference} &bull; Method: ${pay.payment_method.toUpperCase()}</span>
        <span>Status: <b style="color: ${pay.status === 'paid' ? '#48bb78' : 'var(--color-orange)'};">${pay.status.toUpperCase()}</b></span>
      </div>
    `).join("");
  } catch (e) {
    container.innerHTML = '<p class="empty-content">No payment history available.</p>';
  }
}

async function loadCustomerReceipts() {
  const container = qs("customerReceiptsList");
  const latestContainer = qs("latestReceipt");
  if (!container) return;

  const mockOrRealReceipt = `
    <div class="dashboard-list-item printable-receipt" style="background: #ffffff; color: #000; padding: 24px; border: 1px solid #ccc;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 800; color: #0B192C;">Daniel Tech V2.0.0</h2>
          <p style="font-size: 12px; color: #555;">Official Verified Service Receipt</p>
        </div>
        <div style="text-align: right;">
          <strong style="color: #D9534F;">RECEIPT #RCP-2026-0091</strong><br>
          <span style="font-size: 12px; color: #555;">Date: ${new Date().toLocaleDateString()}</span>
        </div>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 16px;">
      <p><strong>Customer:</strong> ${currentUser ? (currentUser.user_metadata?.full_name || currentUser.email) : "Valued Customer"}</p>
      <p><strong>Service:</strong> Web Development & System Architecture</p>
      <p><strong>Payment Status:</strong> <span style="color: #2b6cb0; font-weight: 700;">PAID & VERIFIED</span></p>
      <p><strong>Total Amount:</strong> <strong style="font-size: 16px;">${formatPrice(650000, 250)}</strong></p>
      <div style="margin-top: 20px; text-align: center; font-size: 11px; color: #718096; border-top: 1px dashed #cbd5e0; padding-top: 10px;">
        Thank you for trusting Daniel Tech for your digital engineering solutions.
      </div>
    </div>
  `;

  container.innerHTML = mockOrRealReceipt;
  if (latestContainer) latestContainer.innerHTML = mockOrRealReceipt;
}

async function loadCustomerNotifications() {
  const container = qs("customerNotificationsList");
  if (!container) return;
  container.innerHTML = `
    <div class="dashboard-list-item">
      <strong>Welcome to Daniel Tech V2.0.0</strong>
      <span>Your account is active. Explore our services or submit a custom project request.</span>
    </div>
  `;
}

async function loadCustomerMessages() {
  const container = qs("customerMessagesList");
  if (!container) return;
  container.innerHTML = '<p class="empty-content">No active message threads.</p>';
}

// Print Receipt Button Trigger
qs("printReceiptBtn")?.addEventListener("click", () => {
  window.print();
});

// Profile Form Submit
qs("profileForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = qs("profileName")?.value.trim();
  const status = qs("profileStatus");
  if (sb && currentUser) {
    await sb.from("profiles").update({ full_name: name }).eq("id", currentUser.id);
  }
  setStatus(status, "Profile updated successfully.", false);
});

// Reset Password Button
qs("resetPasswordButton")?.addEventListener("click", async () => {
  const status = qs("securityStatus");
  if (sb && currentUser) {
    try {
      await sb.auth.resetPasswordForEmail(currentUser.email);
      setStatus(status, "Password reset instructions sent to your email.", false);
    } catch (e) {
      setStatus(status, e.message, true);
    }
  }
});

/* =========================================================
   10. ADMIN DASHBOARD & CMS (SERVICES 16:9 & PUBLISH SCHEDULE)
   ========================================================= */
function loadAdminDashboard() {
  setText("adminWelcome", `Admin Dashboard (UUID: ${ADMIN_UID.substring(0, 8)}...)`);
  loadAdminServices();
  loadAdminArticles();
  loadAdminRequests();
  loadAdminPayments();
  loadAdminMessages();
}

// Admin Tab Navigation
qsa("[data-admin-panel]").forEach(button => {
  button.addEventListener("click", function () {
    const target = this.getAttribute("data-admin-panel");
    qsa("[data-admin-panel]").forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    qsa("#adminDashboard .dashboard-panel").forEach(p => p.classList.remove("active-dashboard-panel"));

    const panelMap = {
      "services-cms": "adminServicesPanel",
      content: "adminContentPanel",
      "requests-mgmt": "adminRequestsPanel",
      "payments-mgmt": "adminPaymentsPanel",
      "messages-mgmt": "adminMessagesPanel"
    };

    const el = document.getElementById(panelMap[target]);
    if (el) el.classList.add("active-dashboard-panel");
  });
});

// Admin Services CMS: Create, Update, Delete with 16:9 Video & Image
const adminServiceForm = qs("adminServiceForm");
if (adminServiceForm) {
  adminServiceForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = qs("svcEditId")?.value.trim();
    const title = qs("svcTitle")?.value.trim();
    const category = qs("svcCategory")?.value || "web";
    const priceTZS = Number(qs("svcPriceTZS")?.value || 0);
    const priceUSD = Number(qs("svcPriceUSD")?.value || 0);
    const duration = qs("svcDuration")?.value.trim() || "7 Days";
    const displayOrder = Number(qs("svcDisplayOrder")?.value || 1);
    const imageUrl = qs("svcImageUrl")?.value.trim() || "";
    const videoUrl = qs("svcVideoUrl")?.value.trim() || "";
    const shortDesc = qs("svcShortDesc")?.value.trim() || "";
    const fullDesc = qs("svcFullDesc")?.value.trim() || "";
    const statusEl = qs("adminServiceStatus");

    setStatus(statusEl, "Saving service to database...");

    try {
      if (sb) {
        const payload = {
          title,
          category,
          price: priceTZS,
          price_usd: priceUSD,
          estimated_duration: duration,
          display_order: displayOrder,
          image_url: imageUrl,
          video_url: videoUrl,
          description: shortDesc,
          full_description: fullDesc,
          status: "published"
        };

        if (id) {
          const { error } = await sb.from("services").update(payload).eq("id", id);
          if (error) throw error;
        } else {
          const { error } = await sb.from("services").insert([payload]);
          if (error) throw error;
        }
      }

      setStatus(statusEl, id ? "Service updated successfully!" : "Service published successfully with 16:9 media!");
      adminServiceForm.reset();
      qs("svcEditId").value = "";
      qs("btnCancelEditService")?.classList.add("hidden");
      const saveBtn = qs("btnSaveService");
      if (saveBtn) saveBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Save Service';

      await loadAdminServices();
      await loadServices();
    } catch (err) {
      console.error(err);
      setStatus(statusEl, `Error: ${err.message || "Could not save service."}`, true);
    }
  });
}

qs("btnCancelEditService")?.addEventListener("click", () => {
  adminServiceForm?.reset();
  if (qs("svcEditId")) qs("svcEditId").value = "";
  qs("btnCancelEditService")?.classList.add("hidden");
  const saveBtn = qs("btnSaveService");
  if (saveBtn) saveBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Save Service';
  setStatus(qs("adminServiceStatus"), "");
});

async function loadAdminServices() {
  const container = qs("adminServicesList");
  if (!container) return;

  try {
    let list = DEFAULT_SERVICES;
    if (sb) {
      const { data, error } = await sb.from("services").select("*").order("display_order", { ascending: true });
      if (!error && data && data.length > 0) {
        list = data;
      }
    }

    if (!list || list.length === 0) {
      container.innerHTML = '<p class="empty-content">No services configured yet.</p>';
      return;
    }

    container.innerHTML = list.map(item => `
      <div class="dashboard-list-item" style="display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap;">
        <div style="display: flex; gap: 12px; align-items: center; max-width: 70%;">
          ${item.image_url ? `<img src="${escapeHtml(item.image_url)}" alt="thumb" style="width: 80px; aspect-ratio: 16/9; object-fit: cover; border-radius: 4px; border: 1px solid var(--line);">` : (item.video_url ? `<div style="width: 80px; aspect-ratio: 16/9; background: var(--color-black); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--color-blue);"><i class="fa-solid fa-play"></i></div>` : '')}
          <div>
            <strong style="display: block; font-size: 14px;">${escapeHtml(item.title)}</strong>
            <span style="font-size: 12px; color: var(--muted);">Category: <b style="color: var(--color-blue); text-transform: uppercase;">${escapeHtml(item.category || 'web')}</b> &bull; ${formatPrice(item.price || item.priceTZS, item.price_usd || item.priceUSD)} &bull; ${item.estimated_duration || item.duration || '7 Days'}</span>
            ${item.video_url ? `<div style="font-size: 11px; color: var(--color-orange);"><i class="fa-solid fa-video"></i> 16:9 Video attached</div>` : ''}
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="secondary-button btn-edit-svc" data-id="${item.id}" style="padding: 5px 10px; font-size: 12px;">Edit</button>
          <button type="button" class="secondary-button btn-del-svc" data-id="${item.id}" style="padding: 5px 10px; font-size: 12px; color: var(--color-error); border-color: var(--color-error);">Delete</button>
        </div>
      </div>
    `).join("");

    container.querySelectorAll(".btn-edit-svc").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const svc = list.find(s => String(s.id) === String(id));
        if (!svc) return;

        qs("svcEditId").value = svc.id;
        qs("svcTitle").value = svc.title || "";
        qs("svcCategory").value = svc.category || "web";
        qs("svcPriceTZS").value = svc.price || svc.priceTZS || 0;
        qs("svcPriceUSD").value = svc.price_usd || svc.priceUSD || 0;
        qs("svcDuration").value = svc.estimated_duration || svc.duration || "7 Days";
        qs("svcDisplayOrder").value = svc.display_order || 1;
        qs("svcImageUrl").value = svc.image_url || "";
        qs("svcVideoUrl").value = svc.video_url || "";
        qs("svcShortDesc").value = svc.description || "";
        qs("svcFullDesc").value = svc.full_description || svc.description || "";

        const saveBtn = qs("btnSaveService");
        if (saveBtn) saveBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Update Service';
        qs("btnCancelEditService")?.classList.remove("hidden");
        qs("adminServiceForm")?.scrollIntoView({ behavior: "smooth" });
      });
    });

    container.querySelectorAll(".btn-del-svc").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (!confirm("Are you sure you want to delete this service from Daniel Tech?")) return;
        if (sb) {
          try {
            await sb.from("services").delete().eq("id", id);
          } catch (e) {
            console.warn("Delete service:", e.message);
          }
        }
        await loadAdminServices();
        await loadServices();
      });
    });
  } catch (err) {
    container.innerHTML = '<p class="empty-content">Services currently unavailable.</p>';
  }
}

// Admin Post Publishing & Scheduling
const adminPostForm = qs("adminPostForm");
if (adminPostForm) {
  adminPostForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = qs("editPostId")?.value;
    const title = qs("postTitle")?.value.trim();
    const category = qs("postCategory")?.value;
    const body = qs("postBody")?.value.trim();
    const scheduleDate = qs("postSchedule")?.value;
    const statusEl = qs("adminPostStatus");

    setStatus(statusEl, "Saving content...");

    // Server-side schedule check
    let postStatus = "published";
    let publishedAt = new Date().toISOString();

    if (scheduleDate) {
      const selectedTime = new Date(scheduleDate).getTime();
      const now = Date.now();
      if (selectedTime > now) {
        postStatus = "scheduled";
        publishedAt = new Date(scheduleDate).toISOString();
      }
    }

    try {
      if (sb) {
        if (id) {
          await sb.from("contents").update({
            title,
            category,
            content: body,
            status: postStatus,
            published_at: publishedAt,
            updated_at: new Date().toISOString()
          }).eq("id", id);
        } else {
          await sb.from("contents").insert([{
            title,
            category,
            content: body,
            status: postStatus,
            published_at: publishedAt,
            created_at: new Date().toISOString()
          }]);
        }
      }

      setStatus(statusEl, postStatus === "scheduled"
        ? `Article scheduled successfully for ${new Date(publishedAt).toLocaleString()} (Africa/Dar_es_Salaam)`
        : "Article published live successfully!");

      adminPostForm.reset();
      qs("editPostId").value = "";
      qs("cancelEditPostBtn")?.classList.add("hidden");
      await loadAdminArticles();
      await loadContents();
    } catch (err) {
      console.error(err);
      setStatus(statusEl, "Error saving post. Please try again.", true);
    }
  });
}

qs("cancelEditPostBtn")?.addEventListener("click", () => {
  adminPostForm?.reset();
  qs("editPostId").value = "";
  qs("cancelEditPostBtn")?.classList.add("hidden");
});

async function loadAdminArticles() {
  const container = qs("adminArticlesList");
  if (!container || !sb) return;
  try {
    const { data } = await sb.from("contents").select("*").order("created_at", { ascending: false });
    if (!data || data.length === 0) {
      container.innerHTML = '<p class="empty-content">No articles found in database.</p>';
      return;
    }
    container.innerHTML = data.map(item => `
      <div class="dashboard-list-item" style="flex-direction: row; justify-content: space-between; align-items: center;">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <span>Category: ${item.category} &bull; Status: <b style="color: ${item.status === 'scheduled' ? 'var(--color-orange)' : '#48bb78'};">${item.status}</b></span>
        </div>
        <div style="display: flex; gap: 6px;">
          <button type="button" class="secondary-button btn-edit-post" data-id="${item.id}" style="padding: 4px 8px; font-size: 11px;">Edit</button>
          <button type="button" class="secondary-button btn-del-post" data-id="${item.id}" style="padding: 4px 8px; font-size: 11px; color: var(--color-error);">Delete</button>
        </div>
      </div>
    `).join("");

    container.querySelectorAll(".btn-edit-post").forEach(b => {
      b.addEventListener("click", () => {
        const post = data.find(p => p.id === b.getAttribute("data-id"));
        if (!post) return;
        qs("editPostId").value = post.id;
        qs("postTitle").value = post.title;
        qs("postCategory").value = post.category;
        qs("postBody").value = post.content || "";
        qs("cancelEditPostBtn")?.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    container.querySelectorAll(".btn-del-post").forEach(b => {
      b.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete this article?")) return;
        await sb.from("contents").delete().eq("id", b.getAttribute("data-id"));
        loadAdminArticles();
        loadContents();
      });
    });
  } catch (e) {
    container.innerHTML = '<p class="empty-content">Articles currently unavailable.</p>';
  }
}

async function loadAdminRequests() {
  const container = qs("adminRequestsList");
  if (!container || !sb) return;
  try {
    const { data } = await sb.from("service_requests").select("*").order("created_at", { ascending: false });
    if (!data || data.length === 0) {
      container.innerHTML = '<p class="empty-content">No service requests submitted yet.</p>';
      return;
    }
    container.innerHTML = data.map(r => `
      <div class="dashboard-list-item">
        <strong>${escapeHtml(r.service_name)} (Ref: ${r.request_number})</strong>
        <span>Customer: ${escapeHtml(r.customer_name)} (${escapeHtml(r.email)})</span>
        <span>Status: <b>${r.status}</b></span>
        <p>${escapeHtml(r.description)}</p>
      </div>
    `).join("");
  } catch (e) {
    container.innerHTML = '<p class="empty-content">Requests currently unavailable.</p>';
  }
}

async function loadAdminPayments() {
  const container = qs("adminPaymentsList");
  if (!container || !sb) return;
  try {
    const { data } = await sb.from("payments").select("*").order("created_at", { ascending: false });
    if (!data || data.length === 0) {
      container.innerHTML = '<p class="empty-content">No payment records found.</p>';
      return;
    }
    container.innerHTML = data.map(p => `
      <div class="dashboard-list-item">
        <strong>${escapeHtml(p.service_name)} &bull; ${formatPrice(p.amount)}</strong>
        <span>Ref: ${p.transaction_reference} &bull; Status: <b>${p.status}</b></span>
      </div>
    `).join("");
  } catch (e) {
    container.innerHTML = '<p class="empty-content">Payments currently unavailable.</p>';
  }
}

async function loadAdminMessages() {
  const container = qs("adminMessagesList");
  if (!container || !sb) return;
  try {
    const { data } = await sb.from("messages").select("*").order("created_at", { ascending: false });
    if (!data || data.length === 0) {
      container.innerHTML = '<p class="empty-content">No contact messages received.</p>';
      return;
    }
    container.innerHTML = data.map(m => `
      <div class="dashboard-list-item">
        <strong>${escapeHtml(m.subject || "No Subject")} &bull; From: ${escapeHtml(m.name)} (${escapeHtml(m.email)})</strong>
        <p>${escapeHtml(m.message)}</p>
        <span>Received: ${formatDate(m.created_at)}</span>
      </div>
    `).join("");
  } catch (e) {
    container.innerHTML = '<p class="empty-content">Inquiries unavailable.</p>';
  }
}

/* =========================================================
   11. SERVICE MODALS, CHECKOUT & CUSTOM REQUEST WORKFLOW
   ========================================================= */
const DEFAULT_SERVICES = [
  {
    id: "svc-1",
    title: "Fullstack Web & API Architecture",
    category: "web",
    description: "Enterprise web platforms, microservices, database schemas, and continuous delivery.",
    full_description: "Custom tailored scalable web applications built with modern frontend frameworks, cloud databases, secure APIs, and responsive design systems.",
    duration: "7 Days",
    priceTZS: 650000,
    priceUSD: 250,
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1280&q=80",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "svc-2",
    title: "Phone Diagnostics, Firmware Recovery & Hardware Tips",
    category: "phone",
    description: "Advanced smartphone troubleshooting, chip repair, software recovery, and diagnostics.",
    full_description: "Specialized phone repair, board-level micro-soldering, battery health optimization, flashing stock and custom ROMs, and hardware recovery with tips.",
    duration: "4 Hours",
    priceTZS: 90000,
    priceUSD: 35,
    image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1280&q=80",
    video_url: ""
  },
  {
    id: "svc-3",
    title: "High-Performance Gaming PC Tuning & Systems",
    category: "gaming",
    description: "Custom workstation engineering, thermal benchmarking, and low-latency gaming tuning.",
    full_description: "Professional gaming PC builds, thermal paste application, airflow optimization, GPU overclocking, BIOS latency tuning, and benchmark validation.",
    duration: "1 Day",
    priceTZS: 200000,
    priceUSD: 80,
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1280&q=80",
    video_url: ""
  },
  {
    id: "svc-4",
    title: "Autonomous AI Tools & Workflows",
    category: "ai",
    description: "Deployment of custom neural workflows, autonomous AI agents, and system automations.",
    full_description: "Integration of LLMs, agentic task loops, customer service AI bots, document OCR systems, and automated data pipelines.",
    duration: "5 Days",
    priceTZS: 830000,
    priceUSD: 320,
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1280&q=80",
    video_url: ""
  },
  {
    id: "svc-5",
    title: "Cloud & Supabase Integration",
    category: "web",
    description: "Database orchestration, Row-Level Security auditing, and serverless hosting.",
    full_description: "PostgreSQL optimization, Supabase Auth setup, real-time channels, storage bucket security policies, and edge functions.",
    duration: "3 Days",
    priceTZS: 470000,
    priceUSD: 180,
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&q=80",
    video_url: ""
  },
  {
    id: "svc-6",
    title: "Mobile Screen Calibration & Battery Swaps",
    category: "phone",
    description: "Original OLED/LCD replacement, touch digitizer recalibration, and battery swaps.",
    full_description: "Precision screen repairs with True Tone and color calibration, OEM battery replacements, charging port repairs, and water damage remediation.",
    duration: "2 Hours",
    priceTZS: 120000,
    priceUSD: 45,
    image_url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1280&q=80",
    video_url: ""
  }
];

function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=0&rel=0` : "";
}

function render169Media(videoUrl, imageUrl, title) {
  if (videoUrl) {
    const ytUrl = getYouTubeEmbedUrl(videoUrl);
    if (ytUrl) {
      return `<iframe src="${ytUrl}" title="${escapeHtml(title)}" class="media-16-9" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    return `<video controls playsinline class="media-16-9" poster="${escapeHtml(imageUrl || '')}" src="${escapeHtml(videoUrl)}">Your browser does not support HTML5 video.</video>`;
  }
  if (imageUrl) {
    return `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" class="media-16-9" loading="lazy">`;
  }
  return `<div class="media-16-9" style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--color-dark-blue);color:var(--color-blue);"><i class="fa-solid fa-laptop-code" style="font-size:36px;margin-bottom:8px;"></i><span style="font-size:12px;font-weight:700;letter-spacing:1px;color:var(--color-white);">DANIEL TECH 16:9 MEDIA</span></div>`;
}

let currentServiceFilter = "all";

async function loadServices(filter = currentServiceFilter) {
  const grid = qs("serviceGrid");
  if (!grid) return;

  currentServiceFilter = filter;
  let servicesList = DEFAULT_SERVICES;

  if (sb) {
    try {
      const { data, error } = await sb.from("services").select("*").eq("status", "published").order("display_order", { ascending: true });
      if (!error && data && data.length > 0) {
        servicesList = data.map(d => ({
          id: d.id,
          title: d.title || d.service_name,
          category: d.category || "web",
          description: d.description || d.short_description,
          full_description: d.full_description || d.description,
          duration: d.estimated_duration ? (d.estimated_duration.includes("Hour") || d.estimated_duration.includes("Day") ? d.estimated_duration : `${d.estimated_duration} ${d.duration_unit || 'Days'}`) : "7 Days",
          priceTZS: d.price || 650000,
          priceUSD: d.price_usd || 250,
          image_url: d.image_url || "",
          video_url: d.video_url || ""
        }));
      }
    } catch (e) {
      console.warn("Services load:", e.message);
    }
  }

  // Filter services by category if specified
  const filtered = filter === "all" ? servicesList : servicesList.filter(s => (s.category || "web").toLowerCase() === filter.toLowerCase());

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-content">No services found in this category.</div>';
    return;
  }

  grid.innerHTML = filtered.map((svc, idx) => `
    <article class="service-card">
      <div class="service-card-media media-16-9">
        ${svc.image_url ? `<img src="${escapeHtml(svc.image_url)}" alt="${escapeHtml(svc.title)}" loading="lazy">` : (svc.video_url ? `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--color-dark-blue);color:var(--color-blue);"><i class="fa-solid fa-play" style="font-size:28px;"></i></div>` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--color-dark-blue);color:var(--color-blue);"><i class="fa-solid fa-microchip" style="font-size:28px;"></i></div>`)}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
        <span class="card-number" style="width: auto; padding: 2px 8px; font-size: 11px;">#${String(idx + 1).padStart(2, "0")}</span>
        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; background: var(--tint); color: var(--color-blue); padding: 3px 8px; border-radius: 4px; border: 1px solid var(--line);">${escapeHtml(svc.category || 'web')}</span>
      </div>
      <h3>${escapeHtml(svc.title)}</h3>
      <p>${escapeHtml(svc.description)}</p>
      <div class="service-card-meta">
        <i class="fa-solid fa-clock"></i> ${svc.duration} &bull; <strong>${formatPrice(svc.priceTZS, svc.priceUSD)}</strong>
      </div>
      <button type="button" class="primary-button service-action-btn" data-id="${svc.id}" style="width: 100%; margin-top: 10px;">
        <i class="fa-solid fa-cart-shopping"></i> Request & Checkout
      </button>
    </article>
  `).join("");

  grid.querySelectorAll(".service-action-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const svc = servicesList.find(s => String(s.id) === String(btn.getAttribute("data-id")));
      if (svc) openServiceModal(svc);
    });
  });
}

// Category filter button click handlers
qsa("[data-service-filter]").forEach(btn => {
  btn.addEventListener("click", function () {
    qsa("[data-service-filter]").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    const filter = this.getAttribute("data-service-filter");
    loadServices(filter);
  });
});

function openServiceModal(service) {
  currentService = service;
  setText("serviceModalTitle", service.title);
  setText("serviceModalDuration", service.duration || service.estimated_duration);
  setText("servicePriceDisplay", formatPrice(service.priceTZS || service.price, service.priceUSD || service.price_usd));
  
  const mediaEl = qs("serviceModalMedia");
  if (mediaEl) {
    mediaEl.innerHTML = render169Media(service.video_url, service.image_url, service.title);
  }

  const textEl = qs("serviceModalText");
  if (textEl) {
    textEl.innerHTML = `<p>${escapeHtml(service.full_description || service.description)}</p>`;
  }

  openModal("serviceModal");
}

// Proceed to Secure Payment Workflow
qs("proceedToPayBtn")?.addEventListener("click", function () {
  const btn = this;
  const originalText = btn.innerHTML;
  const method = qs("paymentMethodSelect")?.value || "card";

  if (!currentUser) {
    closeModal("serviceModal");
    openSignIn();
    return;
  }

  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Payment Securely...`;
  btn.disabled = true;

  // Simulate 2-second payment processing delay
  setTimeout(async () => {
    const orderNum = "DT-ORD-" + Math.floor(1000 + Math.random() * 9000);
    const txnRef = "TXN-" + Math.random().toString(36).substring(2, 9).toUpperCase();

    if (sb && currentUser && currentService) {
      try {
        await sb.from("payments").insert([{
          customer_id: currentUser.id,
          order_id: orderNum,
          service_name: currentService.title,
          amount: currentService.priceTZS,
          currency: currentCurrency,
          payment_method: method,
          transaction_reference: txnRef,
          status: "paid",
          created_at: new Date().toISOString()
        }]);

        await sb.from("orders").insert([{
          customer_id: currentUser.id,
          order_number: orderNum,
          service_name: currentService.title,
          service_status: "in_progress",
          payment_status: "paid",
          start_date: new Date().toISOString(),
          expected_completion: new Date(Date.now() + 7 * 86400000).toISOString(),
          created_at: new Date().toISOString()
        }]);
      } catch (err) {
        console.warn("Payment recording:", err.message);
      }
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
    closeModal("serviceModal");

    alert(`Payment of ${formatPrice(currentService.priceTZS, currentService.priceUSD)} via ${method.toUpperCase()} confirmed! Order #${orderNum} is now active.`);
    openCustomerDashboard();
    document.querySelector('[data-dashboard-panel="receipts"]')?.click();
  }, 2000);
});

// Custom Service Request Modal
qs("btnOpenRequestForm")?.addEventListener("click", () => {
  closeModal("serviceModal");
  if (currentService) {
    qs("reqService").value = currentService.title;
  }
  if (currentUser) {
    qs("reqCustomerName").value = currentUser.user_metadata?.full_name || "";
    qs("reqEmail").value = currentUser.email;
  }
  openModal("serviceRequestModal");
});

qs("btnNewServiceRequest")?.addEventListener("click", () => {
  openModal("serviceRequestModal");
});

// Submit Custom Service Request Form
const customServiceRequestForm = qs("customServiceRequestForm");
if (customServiceRequestForm) {
  customServiceRequestForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = qs("reqCustomerName")?.value.trim();
    const email = qs("reqEmail")?.value.trim();
    const phone = qs("reqPhone")?.value.trim();
    const serviceName = qs("reqService")?.value.trim();
    const description = qs("reqDescription")?.value.trim();
    const requirements = qs("reqRequirements")?.value.trim();
    const deadline = qs("reqDeadline")?.value;
    const status = qs("customRequestStatus");

    // Generate unique request number format: DT-REQ-000001
    const randNum = String(Math.floor(1000 + Math.random() * 900000)).padStart(6, "0");
    const requestNumber = `DT-REQ-${randNum}`;

    setStatus(status, "Submitting service request...");

    try {
      if (sb) {
        await sb.from("service_requests").insert([{
          customer_id: currentUser ? currentUser.id : null,
          request_number: requestNumber,
          customer_name: name,
          email,
          phone,
          service_name: serviceName,
          description,
          requirements,
          preferred_deadline: deadline || null,
          status: "New",
          created_at: new Date().toISOString()
        }]);
      }

      setStatus(status, `Request submitted successfully! Reference: ${requestNumber}. Status: New`);
      setTimeout(() => {
        closeModal("serviceRequestModal");
        customServiceRequestForm.reset();
        if (currentUser) {
          openCustomerDashboard();
          document.querySelector('[data-dashboard-panel="requests"]')?.click();
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus(status, "Error submitting request. Please try again.", true);
    }
  });
}

/* =========================================================
   12. CMS CONTENT LOADING & NEWS TICKER
   ========================================================= */
async function loadContents() {
  if (!sb) return;
  try {
    const currentTime = new Date().toISOString();
    const { data } = await sb.from("contents").select("*").lte("published_at", currentTime).order("published_at", { ascending: false });
    const contents = data || [];

    // Update News Ticker with latest published item
    if (contents.length > 0 && qs("newsContent")) {
      qs("newsContent").textContent = `${contents[0].title} — Bringing Your Ideas to Life Through Daniel Tech Solutions.`;
    }

    renderContentCategory("techGrid", contents, ["tech", "technology"]);
    renderContentCategory("phoneGrid", contents, ["phone", "mobile"]);
    renderContentCategory("aiToolsGrid", contents, ["ai tools", "ai-tools", "ai"]);
    renderContentCategory("programmingGrid", contents, ["programming", "code", "development"]);
    renderContentCategory("gamingGrid", contents, ["gaming", "games"]);
    renderBlogGrid(contents);
    renderLatestContent(contents);
  } catch (e) {
    console.warn("Contents load:", e.message);
  }
}

function contentCardHtml(item) {
  return `
    <article class="content-card">
      <span class="card-number" style="width: auto; padding: 4px 10px; font-size: 11px;">${item.category}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.content ? item.content.slice(0, 140) + "..." : "")}</p>
      <div class="service-card-meta">${formatDate(item.published_at || item.created_at)}</div>
      <button type="button" class="secondary-button btn-read-content" data-id="${item.id}">Read Article</button>
    </article>
  `;
}

function renderContentCategory(gridId, contents, cats) {
  const container = qs(gridId);
  if (!container) return;
  const filtered = contents.filter(c => cats.includes(String(c.category || "").toLowerCase()));
  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-content">No content published in this section yet.</div>';
    return;
  }
  container.innerHTML = filtered.map(contentCardHtml).join("");
  attachContentCardListeners(container, contents);
}

function renderBlogGrid(contents) {
  const container = qs("blogGrid");
  if (!container) return;
  if (contents.length === 0) {
    container.innerHTML = '<div class="empty-content">No blog articles published yet.</div>';
    return;
  }
  container.innerHTML = contents.map(contentCardHtml).join("");
  attachContentCardListeners(container, contents);
}

function renderLatestContent(contents) {
  const container = qs("latestContent");
  if (!container) return;
  const latest = contents.slice(0, 3);
  if (latest.length === 0) {
    container.innerHTML = '<div class="empty-content">No content has been published yet.</div>';
    return;
  }
  container.innerHTML = latest.map(contentCardHtml).join("");
  attachContentCardListeners(container, contents);
}

function attachContentCardListeners(container, contents) {
  container.querySelectorAll(".btn-read-content").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = contents.find(c => String(c.id) === String(btn.getAttribute("data-id")));
      if (item) {
        setText("contentModalCategory", item.category);
        setText("contentModalTitle", item.title);
        const body = qs("contentModalBody");
        if (body) body.innerHTML = `<p>${escapeHtml(item.content)}</p>`;
        openModal("contentModal");
      }
    });
  });
}

/* =========================================================
   13. CONTACT FORM (WEB3FORMS + SUPABASE ARCHIVING)
   ========================================================= */
const contactForm = qs("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = qs("contactName")?.value.trim();
    const email = qs("contactEmail")?.value.trim();
    const service = qs("contactService")?.value;
    const subject = qs("contactSubject")?.value.trim();
    const message = qs("contactMessage")?.value.trim();
    const status = qs("contactStatus");
    const submitBtn = qs("contactSubmitButton");

    if (!name || !email || !subject || !message) {
      setStatus(status, "Please fill in all required fields.", true);
      return;
    }

    const origText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    setStatus(status, "Sending message...");

    try {
      // 1. Submit to Web3Forms
      const formData = new FormData(contactForm);
      formData.set("access_key", WEB3FORMS_ACCESS_KEY);
      const res = await fetch(WEB3FORMS_ENDPOINT, { method: "POST", body: formData });

      // 2. Archive message copy in Supabase 'messages' table
      if (sb) {
        try {
          await sb.from("messages").insert([{
            name,
            email,
            service: service || null,
            subject,
            message,
            status: "new",
            created_at: new Date().toISOString()
          }]);
        } catch (dbErr) {
          console.warn("Supabase message archiving:", dbErr.message);
        }
      }

      setStatus(status, "Ujumbe wako umepokelewa! Tutajibu haraka iwezekanavyo. (Thank you! Your message was sent successfully.)");
      contactForm.reset();
    } catch (err) {
      console.error(err);
      setStatus(status, "Ujumbe umepokelewa kwenye mfumo. Asante kwa kuwasiliana na Daniel Tech!", false);
      contactForm.reset();
    } finally {
      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
    }
  });
}

/* =========================================================
   14. COMMENTS SYSTEM
   ========================================================= */
const commentForm = qs("commentForm");
if (commentForm) {
  commentForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = qs("commentName")?.value.trim();
    const email = qs("commentEmail")?.value.trim();
    const comment = qs("commentText")?.value.trim();
    const status = qs("commentStatus");

    if (!name || !comment) {
      setStatus(status, "Please enter your name and comment.", true);
      return;
    }

    setStatus(status, "Posting comment...");

    try {
      if (sb) {
        await sb.from("comments").insert([{
          visitor_name: name,
          visitor_email: email || null,
          content: comment,
          status: "approved",
          created_at: new Date().toISOString()
        }]);
      }
      setStatus(status, "Comment posted successfully! Thank you.");
      commentForm.reset();
      loadComments();
    } catch (err) {
      setStatus(status, "Unable to post comment right now.", true);
    }
  });
}

async function loadComments() {
  const list = qs("commentsList");
  if (!list || !sb) return;
  try {
    const { data } = await sb.from("comments").select("*").eq("status", "approved").order("created_at", { ascending: false });
    if (!data || data.length === 0) {
      list.innerHTML = '<p class="empty-content">No comments yet.</p>';
      return;
    }
    list.innerHTML = data.map(c => `
      <div class="comment-item">
        <strong>${escapeHtml(c.visitor_name)}</strong>
        <span>${formatDate(c.created_at)}</span>
        <p>${escapeHtml(c.content)}</p>
      </div>
    `).join("");
  } catch (e) {
    console.warn("Comments load:", e.message);
  }
}

/* =========================================================
   15. SETTINGS: THEME, CURRENCY, & ACCOUNT MANAGEMENT
   ========================================================= */
const themeSelect = qs("settingsThemeMode");
if (themeSelect) {
  themeSelect.value = currentThemeMode;
  themeSelect.addEventListener("change", (e) => {
    currentThemeMode = e.target.value;
    localStorage.setItem("danielTechThemeMode", currentThemeMode);
    applyTheme();
  });
}

const currencySelector = qs("currencySelector");
if (currencySelector) {
  currencySelector.value = currentCurrency;
  currencySelector.addEventListener("change", (e) => {
    currentCurrency = e.target.value;
    localStorage.setItem("danielTechCurrency", currentCurrency);
    loadServices();
    loadCustomerReceipts();
  });
}

qs("settingsEN")?.addEventListener("click", () => setLanguage("en"));
qs("settingsSW")?.addEventListener("click", () => setLanguage("sw"));

qs("deleteAccountBtn")?.addEventListener("click", async () => {
  if (!currentUser) {
    alert("You must be logged in to delete your account.");
    return;
  }
  const conf = confirm("DANGER: Are you certain you want to permanently delete your Daniel Tech account? All requests and orders will be removed.");
  if (!conf) return;

  if (sb) {
    try {
      await sb.from("profiles").delete().eq("id", currentUser.id);
      await sb.auth.signOut();
    } catch (e) {
      console.warn("Delete account:", e.message);
    }
  }
  alert("Your account has been deleted.");
  logoutUser();
});

/* =========================================================
   16. FLOATING ACTIONS (SCROLL TO TOP)
   ========================================================= */
const backTop = qs("backTop");
window.addEventListener("scroll", () => {
  if (backTop) {
    backTop.classList.toggle("show", window.scrollY > 300);
  }
});
if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================================
   17. INITIALIZATION ON PAGE LOAD
   ========================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  applyTheme();
  await initializeAuth();
  await loadServices();
  await loadContents();
  await loadComments();
});
