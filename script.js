/* =========================================================
   DANIEL TECH V2.0 - PUBLIC JAVASCRIPT (NO ADMIN CODE)
========================================================= */

// 1. SUPABASE CONFIGURATION (Secure Public Keys Only)
const SUPABASE_URL = "https://bodprzntcloioncwhpvr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// 2. PAGE NAVIGATION
const navLinks = document.querySelectorAll("[data-page]");
const pages = document.querySelectorAll(".page");
const mainNav = document.getElementById("mainNav");
const menuButton = document.getElementById("menuButton");

function showPage(pageName) {
    pages.forEach(p => p.classList.remove("active-page"));
    document.getElementById(pageName)?.classList.add("active-page");
    
    navLinks.forEach(link => {
        link.classList.remove("active");
        if(link.dataset.page === pageName) link.classList.add("active");
    });
    if(mainNav.classList.contains("active")) mainNav.classList.remove("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        showPage(link.dataset.page);
    });
});

menuButton.addEventListener("click", () => mainNav.classList.toggle("active"));

// 3. BILINGUAL SYSTEM (ENGLISH / SWAHILI)
let currentLang = "en"; 
const langToggle = document.getElementById("langToggle");

function updateLanguage() {
    const elements = document.querySelectorAll("[data-en][data-sw]");
    elements.forEach(el => {
        if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            // Placeholder text isn't directly controlled by data attributes here for simplicity,
            // but for normal text content:
        } else {
            el.textContent = currentLang === "en" ? el.dataset.en : el.dataset.sw;
        }
    });
    
    langToggle.textContent = currentLang === "en" ? "SW" : "EN";
    document.documentElement.lang = currentLang;
}

langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "sw" : "en";
    updateLanguage();
});

// 4. MODALS & SHOW PASSWORD
function openModal(id) { document.getElementById(id).classList.add("active"); }
function closeModal(id) { document.getElementById(id).classList.remove("active"); }

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

// 5. CUSTOMER AUTHENTICATION (Sign Up / Log In)
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

authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value;
    const password = document.getElementById("authPassword").value;

    authStatus.textContent = currentLang === "en" ? "Processing..." : "Tafadhali subiri...";
    authStatus.style.color = "var(--text-light)";

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
        authStatus.style.color = "#e33b89"; // Error color
    }
});

// 6. SESSION MANAGEMENT
const authBtn = document.getElementById("authBtn");
const customerDashBtn = document.getElementById("customerDashBtn");
const logoutBtn = document.getElementById("logoutBtn");

async function checkUserSession() {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
        // User is logged in
        authBtn.style.display = "none";
        customerDashBtn.style.display = "inline-block";
        logoutBtn.style.display = "inline-block";
    } else {
        // User is logged out
        authBtn.style.display = "inline-block";
        customerDashBtn.style.display = "none";
        logoutBtn.style.display = "none";
    }
}

logoutBtn.addEventListener("click", async () => {
    await sb.auth.signOut();
    checkUserSession();
});

// 7. FOOTER YEAR
document.getElementById("footerYear").textContent = new Date().getFullYear();

// Initialize
checkUserSession();
updateLanguage();
