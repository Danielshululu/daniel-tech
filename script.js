/* =========================================================
   DANIEL TECH V2.0 - PUBLIC JAVASCRIPT
========================================================= */

// 1. SUPABASE CONFIGURATION
const SUPABASE_URL = "https://bodprzntcloioncwhpvr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// 2. PAGE NAVIGATION & MENUS
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("[data-page]");
const mainNav = document.getElementById("mainNav");
const menuButton = document.getElementById("menuButton");

function showPage(pageName) {
    pages.forEach(page => page.classList.remove("active-page"));
    const target = document.getElementById(pageName);
    if (target) target.classList.add("active-page");

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.dataset.page === pageName) link.classList.add("active");
    });
    
    if (mainNav.classList.contains("active")) {
        mainNav.classList.remove("active");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        showPage(this.dataset.page);
    });
});

if (menuButton) {
    menuButton.addEventListener("click", () => {
        mainNav.classList.toggle("active");
    });
}

// 3. SETTINGS PANEL (Restored & Working)
const settingsButton = document.getElementById("settingsButton");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettingsButton = document.getElementById("closeSettings");
const overlay = document.getElementById("overlay");

function openSettings() {
    settingsPanel.classList.add("active");
    overlay.classList.add("active");
}
function closeSettingsPanel() {
    settingsPanel.classList.remove("active");
    overlay.classList.remove("active");
}

if (settingsButton) settingsButton.addEventListener("click", openSettings);
if (closeSettingsButton) closeSettingsButton.addEventListener("click", closeSettingsPanel);
if (overlay) overlay.addEventListener("click", closeSettingsPanel);

// 4. BILINGUAL SYSTEM (Kiswahili / English)
let currentLang = "en"; 
const langToggle = document.getElementById("langToggle");

function updateLanguage() {
    const elements = document.querySelectorAll("[data-en][data-sw]");
    elements.forEach(el => {
        if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            // Placeholder logic (if needed, though currently omitted to keep structure simple)
        } else {
            el.textContent = currentLang === "en" ? el.dataset.en : el.dataset.sw;
        }
    });
    
    langToggle.textContent = currentLang === "en" ? "SW" : "EN";
    document.documentElement.lang = currentLang;
}

if (langToggle) {
    langToggle.addEventListener("click", () => {
        currentLang = currentLang === "en" ? "sw" : "en";
        updateLanguage();
    });
}

// 5. MODALS & SHOW PASSWORD
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.nextElementSibling;
    if (input.type === "password") {
        input.type = "text";
        toggleBtn.textContent = currentLang === "en" ? "Hide" : "Ficha";
    } else {
        input.type = "password";
        toggleBtn.textContent = currentLang === "en" ? "Show" : "Onyesha";
    }
}

// 6. CUSTOMER AUTHENTICATION (Sign Up / Log In)
let isSignUpMode = false;
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authSubmit = document.getElementById("authSubmit");
const authSwitchLink = document.getElementById("authSwitchLink");
const authStatus = document.getElementById("authStatus");

function switchAuthMode() {
    isSignUpMode = !isSignUpMode;
    authStatus.textContent = "";
    if (isSignUpMode) {
        authTitle.textContent = currentLang === "en" ? "Sign Up" : "Jisajili";
        authSubmit.textContent = currentLang === "en" ? "Sign Up" : "Jisajili";
        authSwitchLink.textContent = currentLang === "en" ? "Log In" : "Ingia";
        authSwitchLink.previousElementSibling.textContent = currentLang === "en" ? "Already have an account?" : "Una akaunti tayari?";
    } else {
        authTitle.textContent = currentLang === "en" ? "Log In" : "Ingia";
        authSubmit.textContent = currentLang === "en" ? "Log In" : "Ingia";
        authSwitchLink.textContent = currentLang === "en" ? "Sign Up" : "Jisajili";
        authSwitchLink.previousElementSibling.textContent = currentLang === "en" ? "Don't have an account?" : "Huna akaunti?";
    }
}

if (authForm) {
    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("authEmail").value;
        const password = document.getElementById("authPassword").value;

        authStatus.textContent = currentLang === "en" ? "Processing..." : "Inachakata...";
        authStatus.style.color = "var(--text-muted)";

        try {
            let result;
            if (isSignUpMode) {
                result = await sb.auth.signUp({ email, password });
                if (result.error) throw result.error;
                authStatus.textContent = currentLang === "en" ? "Success! Check your email to verify." : "Imefanikiwa! Angalia barua pepe yako kudhibitisha.";
            } else {
                result = await sb.auth.signInWithPassword({ email, password });
                if (result.error) throw result.error;
                closeModal("loginModal");
                checkUserSession();
            }
        } catch (err) {
            authStatus.textContent = err.message;
            authStatus.style.color = "#ef4444";
        }
    });
}

// 7. SESSION MANAGEMENT
const authBtn = document.getElementById("authBtn");
const customerDashBtn = document.getElementById("customerDashBtn");
const logoutBtn = document.getElementById("logoutBtn");

async function checkUserSession() {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
        if(authBtn) authBtn.style.display = "none";
        if(customerDashBtn) customerDashBtn.style.display = "inline-block";
        if(logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        if(authBtn) authBtn.style.display = "inline-block";
        if(customerDashBtn) customerDashBtn.style.display = "none";
        if(logoutBtn) logoutBtn.style.display = "none";
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await sb.auth.signOut();
        checkUserSession();
    });
}

// 8. INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    const yearEl = document.getElementById("footerYear");
    if(yearEl) yearEl.textContent = new Date().getFullYear();
    
    checkUserSession();
    updateLanguage();
});
