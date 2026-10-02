/* =========================================================
   DANIEL TECH V2.0.0
   MAIN JAVASCRIPT (PRO CMS & PAYMENT EXTENSION)
   ========================================================= */
"use strict";

/* =========================================================
   1. SUPABASE IMPORT + CONFIGURATION
   ========================================================= */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bodprzntcloioncwhpvr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";
const ADMIN_UID = "05fef3eb-16a3-4554-9d9b-de7d2b29144b";
const STORAGE_BUCKET = "daniel-files";
const WEB3FORMS_ACCESS_KEY = "81e3fd5d-7a13-47cc-821a-f963ab6bf7c7";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
let currentSession = null;
let currentUser = null;
let isAdmin = false;
let currentService = null;

/* =========================================================
   2. HELPERS
   ========================================================= */
function qs(selector) {
    if (!selector) return null;
    if (/^[a-zA-Z]/.test(selector)) {
        return document.getElementById(selector);
    }
    return document.querySelector(selector);
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

function showElement(element) { if (element) element.hidden = false; }
function hideElement(element) { if (element) element.hidden = true; }

/* =========================================================
   3. THEME
   ========================================================= */
function updateTheme() {
    const hour = new Date().getHours();
    document.documentElement.classList.toggle("dark-mode", hour >= 18 || hour < 6);
}
updateTheme();
setInterval(updateTheme, 30000);

/* =========================================================
   4. PAGE NAVIGATION
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
   5. HAMBURGER DRAWER
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
   6. MODALS
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
   7. LANGUAGE
   ========================================================= */
function setLanguage(language) {
    localStorage.setItem("danielTechLanguage", language);
    qsa(".language-button").forEach(button => button.classList.remove("active"));
    if (language === "sw") {
        const sw = qs("languageSW");
        if (sw) sw.classList.add("active");
    } else {
        const en = qs("languageEN");
        if (en) en.classList.add("active");
    }
}
const savedLanguage = localStorage.getItem("danielTechLanguage") || "en";
setLanguage(savedLanguage);

const languageEN = qs("languageEN");
const languageSW = qs("languageSW");
if (languageEN) languageEN.addEventListener("click", () => setLanguage("en"));
if (languageSW) languageSW.addEventListener("click", () => setLanguage("sw"));

/* =========================================================
   8. AUTH MODAL
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

/* =========================================================
   9. AUTH SUBMISSIONS
   ========================================================= */
if (signUpForm) {
    signUpForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = qs("signUpName")?.value.trim();
        const email = qs("signUpEmail")?.value.trim();
        const password = qs("signUpPassword")?.value;
        const status = qs("signUpStatus");
        
        if (!name || !email || !password) { setStatus(status, "Please complete all fields.", true); return; }
        setStatus(status, "Creating your account...");
        
        try {
            const { data, error } = await sb.auth.signUp({ email, password, options: { data: { full_name: name } } });
            if (error) throw error;
            if (data.user) setStatus(status, "Account created successfully. Check your email if verification is required.");
        } catch (error) {
            console.error("Sign up error:", error);
            setStatus(status, error.message || "Unable to create account.", true);
        }
    });
}

if (signInForm) {
    signInForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = qs("signInEmail")?.value.trim();
        const password = qs("signInPassword")?.value;
        const status = qs("signInStatus");
        
        if (!email || !password) { setStatus(status, "Please enter your email and password.", true); return; }
        setStatus(status, "Signing in...");
        
        try {
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

/* =========================================================
   10. SESSION HANDLING (ADMIN ROUTING INCLUDED)
   ========================================================= */
async function handleAuthenticatedUser() {
    if (!currentUser) return;
    isAdmin = currentUser.id === ADMIN_UID;
    closeAllModals();

    if (isAdmin) {
        console.log("Authenticated admin:", currentUser.id);
        await updateAuthUI();
        openAdminDashboard(); 
        return;
    }
    
    await updateAuthUI();
    await loadCustomerDashboard();
    openCustomerDashboard();
}

async function initializeAuth() {
    try {
        const { data, error } = await sb.auth.getSession();
        if (error) throw error;
        currentSession = data.session || null;
        currentUser = data.session?.user || null;
        if (currentUser) {
            isAdmin = currentUser.id === ADMIN_UID;
            await updateAuthUI();
            if (!isAdmin) { await loadCustomerDashboard(); }
            else { openAdminDashboard(); }
        }
    } catch (error) {
        console.error("Auth initialization error:", error);
    }

    sb.auth.onAuthStateChange(async function (event, session) {
        currentSession = session || null;
        currentUser = session?.user || null;
        isAdmin = currentUser?.id === ADMIN_UID;
        await updateAuthUI();
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

async function updateAuthUI() {
    const drawerSignOut = qs("drawerSignOut");
    if (currentUser) {
        if (signInButton) signInButton.textContent = isAdmin ? "Admin" : "Dashboard";
        if (signUpButton) signUpButton.textContent = isAdmin ? "Admin" : "Account";
        if (drawerSignOut) drawerSignOut.hidden = false;
    } else {
        if (signInButton) signInButton.textContent = "Sign In";
        if (signUpButton) signUpButton.textContent = "Sign Up";
        if (drawerSignOut) drawerSignOut.hidden = true;
    }
}

async function logoutUser() {
    try {
        const { error } = await sb.auth.signOut();
        if (error) throw error;
        currentSession = null;
        currentUser = null;
        isAdmin = false;
        closeCustomerDashboard();
        closeAdminDashboard();
        await updateAuthUI();
        showPage("home");
    } catch (error) {
        console.error("Logout error:", error);
    }
}

const customerLogout = qs("customerLogout");
const drawerSignOut = qs("drawerSignOut");
const adminLogoutBtn = qs("adminLogoutBtn");

if (customerLogout) customerLogout.addEventListener("click", logoutUser);
if (drawerSignOut) drawerSignOut.addEventListener("click", logoutUser);
if (adminLogoutBtn) adminLogoutBtn.addEventListener("click", logoutUser);

/* =========================================================
   11. DASHBOARDS LOGIC (ADMIN & CUSTOMER)
   ========================================================= */
const customerDashboard = qs("customerDashboard");
const adminDashboard = qs("adminDashboard");

function openCustomerDashboard() {
    if (!currentUser) { openSignIn(); return; }
    if (customerDashboard) customerDashboard.hidden = false;
    closeAdminDashboard();
    pages.forEach(page => page.classList.remove("active-page"));
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
    pages.forEach(page => page.classList.remove("active-page"));
    document.body.classList.add("dashboard-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeAdminDashboard() {
    if (adminDashboard) adminDashboard.hidden = true;
}

qsa("[data-dashboard-panel]").forEach(button => {
    button.addEventListener("click", function () {
        const panel = this.getAttribute("data-dashboard-panel");
        showDashboardPanel(panel);
    });
});

function showDashboardPanel(panelName) {
    qsa(".dashboard-nav").forEach(button => {
        button.classList.toggle("active", button.getAttribute("data-dashboard-panel") === panelName);
    });
    qsa(".dashboard-panel").forEach(panel => {
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
    
    if (panelName === "requests") loadCustomerRequests();
    if (panelName === "services") loadCustomerOrders();
    if (panelName === "messages") loadCustomerMessages();
    if (panelName === "payments") loadCustomerPayments();
    if (panelName === "receipts") loadCustomerReceipts();
    if (panelName === "notifications") loadCustomerNotifications();
    if (panelName === "profile") loadCustomerProfile();
}

/* =========================================================
   12. ADMIN PUBLISH & SCHEDULE LOGIC (PRO)
   ========================================================= */
const adminPostForm = qs("adminPostForm");
if (adminPostForm) {
    adminPostForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const title = qs("postTitle").value;
        const category = qs("postCategory").value;
        const body = qs("postBody").value;
        const scheduleDate = qs("postSchedule").value;
        const statusEl = qs("adminPostStatus");
        
        setStatus(statusEl, "Processing Post...");

        let postStatus = "published";
        let publishedAt = new Date().toISOString();

        if (scheduleDate) {
            const selectedTime = new Date(scheduleDate).getTime();
            const currentTime = new Date().getTime();
            if (selectedTime > currentTime) {
                postStatus = "scheduled";
                publishedAt = new Date(scheduleDate).toISOString();
            }
        }

        try {
            const { error } = await sb.from("contents").insert([{
                title: title,
                category: category,
                content: body,
                status: postStatus,
                published_at: publishedAt
            }]);

            if (error) throw error;
            setStatus(statusEl, `Post successfully ${postStatus === 'scheduled' ? 'scheduled for ' + scheduleDate : 'published'}!`, false);
            adminPostForm.reset();
        } catch (error) {
            console.error(error);
            setStatus(statusEl, "Error saving post. Please try again.", true);
        }
    });
}

/* =========================================================
   13. SERVICE MODAL, PAYMENT FLOW & PRINTING (PRO)
   ========================================================= */
function openServiceModal(service) {
    currentService = service;
    setText("serviceModalTitle", service.title);
    
    const text = qs("serviceModalText");
    if (text) {
        text.innerHTML = `<p>${escapeHtml(service.full_description || service.description || "")}</p>`;
    }

    const priceDisplay = qs("servicePriceDisplay");
    if (priceDisplay) {
        priceDisplay.textContent = service.price ? `TZS ${service.price.toLocaleString()}` : "Custom Quote";
    }

    openModal("serviceModal");
}

const proceedToPayBtn = qs("proceedToPayBtn");
if (proceedToPayBtn) {
    proceedToPayBtn.addEventListener("click", function() {
        const method = qs("paymentMethodSelect")?.value;
        const btn = this;
        const originalText = btn.textContent;
        
        if (!currentUser) {
            closeModal("serviceModal");
            openSignIn(); 
            return;
        }

        btn.textContent = "Processing " + method.toUpperCase() + " Securely...";
        btn.disabled = true;

        setTimeout(() => {
            alert(`Redirecting to ${method.toUpperCase()} secure payment gateway...`);
            btn.textContent = originalText;
            btn.disabled = false;
            closeModal("serviceModal");
            showPage("customer-dashboard");
        }, 2000);
    });
}

const printReceiptBtn = qs("printReceiptBtn");
if (printReceiptBtn) {
    printReceiptBtn.addEventListener("click", function() {
        window.print();
    });
}

/* =========================================================
   14. LOAD SERVICES AND CONTENT
   ========================================================= */
async function loadServices() {
    const grid = qs("serviceGrid");
    if (!grid) return;
    grid.innerHTML = '<div class="empty-content">Loading services...</div>';
    try {
        const { data, error } = await sb.from("services").select("*").eq("status", "published").order("display_order", { ascending: true });
        if (error) throw error;
        if (!data || data.length === 0) {
            grid.innerHTML = '<div class="empty-content">No services are currently available.</div>';
            return;
        }
        grid.innerHTML = data.map((service, index) => `
            <article class="service-card">
                <div class="card-number">${String(index + 1).padStart(2, "0")}</div>
                <h3>${escapeHtml(service.title)}</h3>
                <p>${escapeHtml(service.description || "")}</p>
                <button type="button" class="view-button service-view-button" data-service-id="${escapeHtml(service.id)}">View Service</button>
            </article>
        `).join("");
        
        qsa(".service-view-button").forEach(button => {
            button.addEventListener("click", function () {
                const id = this.getAttribute("data-service-id");
                const service = data.find(item => String(item.id) === String(id));
                if (service) openServiceModal(service);
            });
        });
    } catch (error) {
        console.error("Services error:", error);
        grid.innerHTML = '<div class="empty-content">Unable to load services right now.</div>';
    }
}

function contentCategoryValue(content) {
    return String(content.section || content.category || "").trim().toLowerCase();
}

function contentCardMarkup(content) {
    const title = escapeHtml(content.title || "Untitled");
    const description = escapeHtml(content.description || content.meta_description || content.body_html?.replace(/<[^>]*>/g, "").slice(0, 160) || "");
    const image = content.featured_image || content.thumbnail_url || content.og_image_url || "";
    return `
        <article class="content-card">
            ${image ? `<img src="${escapeHtml(image)}" alt="${title}" loading="lazy">` : ""}
            <div class="content-card-body">
                <span class="content-category">${escapeHtml(content.section || content.category || "Technology")}</span>
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="content-card-meta">${formatDate(content.published_at || content.created_at)}</div>
                <button type="button" class="view-button content-view-button" data-content-id="${escapeHtml(content.id)}">Read More</button>
            </div>
        </article>
    `;
}

async function loadContents() {
    try {
        // Updated to load posts where published_at is past (handles scheduling)
        const currentTime = new Date().toISOString();
        const { data, error } = await sb.from("contents").select("*").lte("published_at", currentTime).order("published_at", { ascending: false });
        if (error) throw error;
        const contents = data || [];
        
        renderContentCategory("techGrid", contents, ["tech", "technology"]);
        renderContentCategory("phoneGrid", contents, ["phone", "mobile"]);
        renderContentCategory("aiToolsGrid", contents, ["ai", "ai tools", "ai-tools"]);
        renderContentCategory("programmingGrid", contents, ["programming", "programming tutorials"]);
        renderContentCategory("gamingGrid", contents, ["gaming", "games", "game"]);
        renderBlog(contents);
        renderLatest(contents);
        
        qsa(".content-view-button").forEach(button => {
            button.addEventListener("click", function () {
                const id = this.getAttribute("data-content-id");
                const content = contents.find(item => String(item.id) === String(id));
                if (content) openContentModal(content);
            });
        });
    } catch (error) {
        console.error("Content loading error:", error);
    }
}

function renderContentCategory(elementId, contents, categories) {
    const container = qs(elementId);
    if (!container) return;
    const filtered = contents.filter(content => categories.includes(contentCategoryValue(content)));
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-content">No content has been published yet.</div>';
        return;
    }
    container.innerHTML = filtered.map(contentCardMarkup).join("");
}

function renderBlog(contents) {
    const container = qs("blogGrid");
    if (!container) return;
    if (!contents.length) {
        container.innerHTML = '<div class="empty-content">No blog content has been published yet.</div>';
        return;
    }
    container.innerHTML = contents.map(contentCardMarkup).join("");
}

function renderLatest(contents) {
    const container = qs("latestContent");
    if (!container) return;
    const latest = contents.slice(0, 3);
    if (!latest.length) {
        container.innerHTML = '<div class="empty-content">No content has been published yet.</div>';
        return;
    }
    container.innerHTML = latest.map(contentCardMarkup).join("");
}

function openContentModal(content) {
    setText("contentModalCategory", content.section || content.category || "CONTENT");
    setText("contentModalTitle", content.title || "Article");
    const body = qs("contentModalBody");
    if (body) {
        if (content.body_html) body.innerHTML = content.body_html;
        else if (content.content) body.innerHTML = `<p>${escapeHtml(content.content)}</p>`;
        else body.innerHTML = "<p>No content available.</p>";
    }
    openModal("contentModal");
}

/* =========================================================
   15. CONTACT & COMMENTS
   ========================================================= */
const contactForm = qs("contactForm");
const contactStatus = qs("contactStatus");
const contactSubmitButton = qs("contactSubmitButton");

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = qs("contactName")?.value.trim();
        const email = qs("contactEmail")?.value.trim();
        const service = qs("contactService")?.value.trim();
        const subject = qs("contactSubject")?.value.trim();
        const message = qs("contactMessage")?.value.trim();
        
        if (!name || !email || !subject || !message) { setStatus(contactStatus, "Please complete all required fields.", true); return; }
        
        const originalText = contactSubmitButton ? contactSubmitButton.textContent : "Send Message";
        if (contactSubmitButton) { contactSubmitButton.textContent = "Sending..."; contactSubmitButton.disabled = true; }
        setStatus(contactStatus, "Sending your message...");
        
        try {
            const web3Data = new FormData(contactForm);
            web3Data.set("access_key", WEB3FORMS_ACCESS_KEY);
            const response = await fetch(WEB3FORMS_ENDPOINT, { method: "POST", body: web3Data });
            
            let result = {};
            try { result = await response.json(); } catch (e) { }
            if (!response.ok || result.success === false) throw new Error("Web3Forms could not send the message.");
            
            try {
                await sb.from("messages").insert([{ name, email, subject, message, service: service || null, status: "unread" }]);
            } catch (storageError) { console.warn("Supabase message storage failed:", storageError); }
            
            setStatus(contactStatus, "Your message has been sent successfully. We will respond as soon as possible.");
            contactForm.reset();
        } catch (error) {
            console.error("Contact form error:", error);
            setStatus(contactStatus, error.message || "Sorry, your message could not be sent. Please try again.", true);
        } finally {
            if (contactSubmitButton) { contactSubmitButton.textContent = originalText; contactSubmitButton.disabled = false; }
        }
    });
}

async function loadComments() {
    const list = qs("commentsList");
    if (!list) return;
    try {
        const { data, error } = await sb.from("comments").select("*").eq("status", "approved").order("created_at", { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) { list.innerHTML = '<p class="empty-content">No comments yet.</p>'; return; }
        list.innerHTML = data.map(comment => `
            <div class="comment-item">
                <strong>${escapeHtml(comment.visitor_name)}</strong>
                <span>${formatDate(comment.created_at)}</span>
                <p>${escapeHtml(comment.content)}</p>
            </div>
        `).join("");
    } catch (error) {
        console.error("Comments loading error:", error);
        list.innerHTML = '<p class="empty-content">Comments are currently unavailable.</p>';
    }
}

const commentForm = qs("commentForm");
if (commentForm) {
    commentForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = qs("commentName")?.value.trim();
        const email = qs("commentEmail")?.value.trim();
        const comment = qs("commentText")?.value.trim();
        const status = qs("commentStatus");
        
        if (!name || !comment) { setStatus(status, "Please enter your name and comment.", true); return; }
        setStatus(status, "Posting comment...");
        try {
            const { error } = await sb.from("comments").insert([{ visitor_name: name, visitor_email: email || null, content: comment, status: "pending" }]);
            if (error) throw error;
            setStatus(status, "Your comment has been submitted for review.");
            commentForm.reset();
        } catch (error) {
            console.error("Comment error:", error);
            setStatus(status, "Unable to post your comment right now.", true);
        }
    });
}

/* =========================================================
   16. CUSTOMER DASHBOARD DATA LOADING
   ========================================================= */
async function loadCustomerDashboard() {
    if (!currentUser) return;
    setText("customerWelcome", `Welcome, ${currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "Customer"}`);
    setText("customerEmail", currentUser.email);
    setText("profileEmail", currentUser.email);
    await Promise.allSettled([
        loadCustomerStats(), loadCustomerOrders(), loadCustomerRequests(),
        loadCustomerPayments(), loadCustomerReceipts(), loadCustomerNotifications(),
        loadCustomerMessages(), loadCustomerProfile()
    ]);
}

async function loadCustomerStats() {
    if (!currentUser) return;
    try {
        const requestsPromise = sb.from("service_requests").select("id,status").eq("user_id", currentUser.id);
        const ordersPromise = sb.from("orders").select("id,status").eq("user_id", currentUser.id);
        const paymentsPromise = sb.from("payments").select("id,status").eq("user_id", currentUser.id);
        
        const [requestsResult, ordersResult, paymentsResult] = await Promise.all([requestsPromise, ordersPromise, paymentsPromise]);
        
        const pendingRequests = (requestsResult.data || []).filter(item => !["Completed", "Closed"].includes(item.status)).length;
        const activeServices = (ordersResult.data || []).filter(item => ["pending", "processing", "in_progress", "active"].includes(String(item.status).toLowerCase())).length;
        const completedServices = (ordersResult.data || []).filter(item => String(item.status).toLowerCase() === "completed").length;
        const pendingPayments = (paymentsResult.data || []).filter(item => String(item.status).toLowerCase() === "pending").length;
        
        setText("statActiveServices", activeServices);
        setText("statPendingRequests", pendingRequests);
        setText("statPendingPayments", pendingPayments);
        setText("statCompletedServices", completedServices);
    } catch (error) { console.error("Customer stats error:", error); }
}

async function loadCustomerOrders() {
    if (!currentUser) return;
    const list = qs("customerServicesList");
    if (!list) return;
    try {
        const { data, error } = await sb.from("orders").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) { list.innerHTML = '<p class="empty-content">No services found.</p>'; return; }
        list.innerHTML = data.map(order => `
            <div class="dashboard-list-item">
                <strong>${escapeHtml(order.service_title || "Service")}</strong>
                <span>Order: ${escapeHtml(order.order_number || "-")}</span>
                <span>Status: ${escapeHtml(order.status || "-")}</span>
                <span>${escapeHtml(order.currency || "")} ${escapeHtml(order.amount ?? "")}</span>
            </div>
        `).join("");
    } catch (error) { list.innerHTML = '<p class="empty-content">Unable to load services.</p>'; }
}

async function loadCustomerRequests() {
    if (!currentUser) return;
    const list = qs("customerRequestsList");
    if (!list) return;
    try {
        const { data, error } = await sb.from("service_requests").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) { list.innerHTML = '<p class="empty-content">No requests found.</p>'; return; }
        list.innerHTML = data.map(request => `
            <div class="dashboard-list-item">
                <strong>${escapeHtml(request.service_type || "Service Request")}</strong>
                <span>Request: ${escapeHtml(request.request_number || "-")}</span>
                <span>Status: ${escapeHtml(request.status || "-")}</span>
                <span>${formatDate(request.created_at)}</span>
            </div>
        `).join("");
    } catch (error) { list.innerHTML = '<p class="empty-content">Unable to load requests.</p>'; }
}

async function loadCustomerPayments() {
    if (!currentUser) return;
    const list = qs("customerPaymentsList");
    if (!list) return;
    try {
        const { data, error } = await sb.from("payments").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) { list.innerHTML = '<p class="empty-content">No payment records found.</p>'; return; }
        list.innerHTML = data.map(payment => `
            <div class="dashboard-list-item">
                <strong>${escapeHtml(payment.payment_id || "Payment")}</strong>
                <span>Amount: ${escapeHtml(payment.currency || "")} ${escapeHtml(payment.amount ?? "")}</span>
                <span>Method: ${escapeHtml(payment.payment_method || "-")}</span>
                <span>Status: ${escapeHtml(payment.status || "-")}</span>
                <span>${formatDate(payment.payment_date || payment.created_at)}</span>
            </div>
        `).join("");
    } catch (error) { list.innerHTML = '<p class="empty-content">Unable to load payments.</p>'; }
}

async function loadCustomerReceipts() {
    if (!currentUser) return;
    const list = qs("customerReceiptsList");
    const latest = qs("latestReceipt");
    try {
        const { data, error } = await sb.from("receipts").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) {
            if (list) list.innerHTML = '<p class="empty-content print-hidden">No receipts found.</p>';
            if (latest) latest.innerHTML = '<p class="empty-content print-hidden">No receipt available.</p>';
            return;
        }
        const receiptMarkup = receipt => `
            <div class="dashboard-list-item">
                <strong>Receipt: ${escapeHtml(receipt.receipt_number || "-")}</strong>
                <span>Service: ${escapeHtml(receipt.service_title || "-")}</span>
                <span>Amount: ${escapeHtml(receipt.currency || "")} ${escapeHtml(receipt.amount ?? "")}</span>
                <span>Status: ${escapeHtml(receipt.status || "-")}</span>
                <span>${formatDate(receipt.payment_date || receipt.created_at)}</span>
            </div>
        `;
        if (list) list.innerHTML = data.map(receiptMarkup).join("");
        if (latest) latest.innerHTML = receiptMarkup(data[0]);
    } catch (error) { console.error("Customer receipts error:", error); }
}

async function loadCustomerNotifications() {
    if (!currentUser) return;
    const list = qs("customerNotificationsList");
    const overview = qs("overviewNotifications");
    try {
        const { data, error } = await sb.from("notifications").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) {
            if (list) list.innerHTML = '<p class="empty-content">No notifications found.</p>';
            if (overview) overview.innerHTML = '<p class="empty-content">No new notifications.</p>';
            return;
        }
        if (list) list.innerHTML = data.map(n => `<div class="dashboard-list-item"><strong>${escapeHtml(n.title)}</strong><p>${escapeHtml(n.message)}</p><span>${formatDate(n.created_at)}</span></div>`).join("");
        if (overview) overview.innerHTML = data.slice(0, 3).map(n => `<div class="dashboard-list-item"><strong>${escapeHtml(n.title)}</strong><p>${escapeHtml(n.message)}</p></div>`).join("");
    } catch (error) { console.error("Notifications error:", error); }
}

async function loadCustomerMessages() {
    if (!currentUser) return;
    const list = qs("customerMessagesList");
    if (!list) return;
    try {
        const { data, error } = await sb.from("messages").select("*").eq("email", currentUser.email).order("created_at", { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) { list.innerHTML = '<p class="empty-content">No messages found.</p>'; return; }
        list.innerHTML = data.map(m => `<div class="dashboard-list-item"><strong>${escapeHtml(m.subject)}</strong><p>${escapeHtml(m.message)}</p><span>Status: ${escapeHtml(m.status)}</span><span>${formatDate(m.created_at)}</span></div>`).join("");
    } catch (error) { list.innerHTML = '<p class="empty-content">Unable to load messages.</p>'; }
}

async function loadCustomerProfile() {
    if (!currentUser) return;
    try {
        const { data, error } = await sb.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();
        if (error) throw error;
        setText("profileEmail", currentUser.email);
        const nameInput = qs("profileName");
        if (nameInput) nameInput.value = data?.full_name || currentUser.user_metadata?.full_name || "";
    } catch (error) { console.error("Profile loading error:", error); }
}

const profileForm = qs("profileForm");
if (profileForm) {
    profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (!currentUser) return;
        const name = qs("profileName")?.value.trim();
        const status = qs("profileStatus");
        if (!name) { setStatus(status, "Please enter your name.", true); return; }
        setStatus(status, "Saving profile...");
        try {
            const { error } = await sb.from("profiles").update({ full_name: name, updated_at: new Date().toISOString() }).eq("id", currentUser.id);
            if (error) throw error;
            setStatus(status, "Profile updated successfully.");
            setText("customerWelcome", `Welcome, ${name}`);
        } catch (error) { setStatus(status, "Unable to update profile.", true); }
    });
}

const resetPasswordButton = qs("resetPasswordButton");
if (resetPasswordButton) {
    resetPasswordButton.addEventListener("click", async function () {
        if (!currentUser?.email) return;
        const status = qs("securityStatus");
        setStatus(status, "Sending password reset email...");
        try {
            const { error } = await sb.auth.resetPasswordForEmail(currentUser.email);
            if (error) throw error;
            setStatus(status, "Password reset instructions have been sent to your email.");
        } catch (error) { setStatus(status, "Unable to send password reset email.", true); }
    });
}

/* =========================================================
   17. SITE SETTINGS & PUBLIC DATA
   ========================================================= */
async function loadSiteSettingsPublic() {
    try {
        const { data, error } = await sb.from("site_settings").select("*");
        if (error) throw error;
        if (!data) return;
        const settings = {};
        data.forEach(row => { settings[row.setting_key] = row.setting_value; });
        
        if (settings.hero_title) { const hero = qs(".hero h1"); if (hero) hero.innerHTML = escapeHtml(settings.hero_title); }
        if (settings.hero_description) { const hd = qs(".hero-description"); if (hd) hd.textContent = settings.hero_description; }
        if (settings.footer_text) setText("footerText", settings.footer_text);
        if (settings.footer_email) { setText("footerEmail", settings.footer_email); setText("contactEmailDisplay", settings.footer_email); }
        if (settings.footer_phone) setText("footerPhone", settings.footer_phone);
        if (settings.footer_address) setText("footerAddress", settings.footer_address);
    } catch (error) { console.warn("Site settings unavailable:", error); }
}

async function loadAboutPublic() {
    const container = qs("aboutContent");
    if (!container) return;
    try {
        const { data, error } = await sb.from("about_sections").select("*").eq("status", "published").order("display_order", { ascending: true });
        if (error) throw error;
        if (!data || data.length === 0) return;
        container.innerHTML = data.map(section => `<div class="about-section"><h3>${escapeHtml(section.title || "")}</h3><p>${escapeHtml(section.content || "")}</p></div>`).join("");
    } catch (error) { console.warn("About content unavailable:", error); }
}

const backTop = qs("backTop");
function updateBackTop() {
    if (!backTop) return;
    if (window.scrollY > 400) backTop.classList.add("show");
    else backTop.classList.remove("show");
}
window.addEventListener("scroll", updateBackTop);
if (backTop) backTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

/* =========================================================
   18. INITIALIZATION
   ========================================================= */
async function initializeDanielTech() {
    console.log("Daniel Tech V2.0.0 initializing...");
    await initializeAuth();
    await Promise.allSettled([
        loadServices(), loadContents(), loadComments(),
        loadSiteSettingsPublic(), loadAboutPublic()
    ]);
    updateBackTop();
    console.log("Daniel Tech V2.0.0 initialized.");
}
initializeDanielTech();

/* =========================================================
   19. VERSION INFORMATION
   ========================================================= */
window.DANIEL_TECH_VERSION = Object.freeze({ version: "2.0.0", released: "2026-10-02", developer: "Daniel Shululu" });
console.log("Daniel Tech V2.0.0");
