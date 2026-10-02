/* =========================================================
   DANIEL TECH - MAIN JAVASCRIPT (Supabase-backed)
   Theme is handled automatically by the script in index.html (06:00-17:59 light, 18:00-05:59 dark).
========================================================= */

/* 0. SUPABASE CONFIG */
const SUPABASE_URL = "https://bodprzntcloioncwhpvr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";
const ADMIN_UID = "05fef3eb-16a3-4554-9d9b-de7d2b29144b";
const STORAGE_BUCKET = "daniel-files";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
let currentSession = null;
let isAdmin = false;

/* 1. HELPERS */
function qs(id) { return document.getElementById(id); }
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
}
function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString();
}
function slugify(text) {
    return String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || ("item-" + Date.now());
}
function setStatus(el, message, isError) {
    if (!el) return;
    el.textContent = message || "";
    el.style.color = isError ? "var(--color-error)" : "";
}
function setText(id, value) { const el = qs(id); if (el) el.textContent = value; }

/* 2. NAVIGATION / PAGES */
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("[data-page]");
const mainNav = qs("mainNav");
const menuButton = qs("menuButton");

function showPage(pageName) {
    pages.forEach((page) => page.classList.remove("active-page"));
    const target = qs(pageName);
    if (target) target.classList.add("active-page");
    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.dataset.page === pageName) link.classList.add("active");
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMobileMenu();
}
navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        const page = this.dataset.page;
        if (page) showPage(page);
    });
});
function closeMobileMenu() { if (mainNav) mainNav.classList.remove("active"); }
if (menuButton && mainNav) menuButton.addEventListener("click", () => mainNav.classList.toggle("active"));

/* 3. SETTINGS (opens the Settings page; the page itself is built in section 24) */
const settingsButton = qs("settingsButton");
const settingsPanel = qs("settingsPanel");
const closeSettingsButton = qs("closeSettings");
const overlay = qs("overlay");
function openSettings() { showPage("settings"); }
function closeSettingsPanel() {
    if (settingsPanel) settingsPanel.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
}
if (settingsButton) settingsButton.addEventListener("click", openSettings);
if (closeSettingsButton) closeSettingsButton.addEventListener("click", closeSettingsPanel);
if (overlay) overlay.addEventListener("click", closeSettingsPanel);

/* 4. MODALS */
function openModal(modalId) {
    const modal = qs(modalId);
    if (modal) { modal.classList.add("active"); document.body.style.overflow = "hidden"; }
}
function closeModal(modalId) {
    const modal = qs(modalId);
    if (modal) { modal.classList.remove("active"); document.body.style.overflow = ""; }
}
function closeAllModals() {
    document.querySelectorAll(".modal.active").forEach((m) => m.classList.remove("active"));
    document.body.style.overflow = "";
}
document.querySelectorAll(".modal-close").forEach((button) => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.closeModal;
        if (modalId) closeModal(modalId);
        else { const modal = button.closest(".modal"); if (modal) modal.classList.remove("active"); }
    });
});
document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) { modal.classList.remove("active"); document.body.style.overflow = ""; }
    });
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeSettingsPanel(); closeAllModals(); }
});
const aboutButton = qs("aboutButton");
if (aboutButton) aboutButton.addEventListener("click", () => { closeSettingsPanel(); openModal("aboutModal"); });

/* 5. SERVICES (public) */
const fallbackServiceText = {
    web: "We provide modern responsive website development and digital web solutions.",
    graphics: "Creative graphics, digital branding and visual content solutions.",
    security: "Technology awareness, security guidance and digital safety information.",
    computer: "Computer troubleshooting, software installation and general technology support.",
    software: "Software guidance, applications and digital technology solutions.",
    ai: "Information and solutions involving modern artificial intelligence tools.",
};
let servicesData = [];
async function loadServices() {
    try {
        const { data, error } = await sb.from("services").select("*").eq("status", "published").order("display_order", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) { servicesData = data; renderServiceGrid(data); }
    } catch (err) { console.error("loadServices failed, keeping default cards:", err); }
}
function renderServiceGrid(services) {
    const grid = document.querySelector("#services .service-grid");
    if (!grid) return;
    grid.innerHTML = services.map((service, index) => `
        <article class="service-card">
            <div class="card-number">${String(index + 1).padStart(2, "0")}</div>
            <h3>${escapeHtml(service.title)}</h3>
            <p>${escapeHtml(service.description)}</p>
            <button type="button" class="view-button service-view-button" data-service="${service.id}">View Service</button>
        </article>`).join("");
}
document.querySelector("#services .service-grid")?.addEventListener("click", (event) => {
    const button = event.target.closest(".service-view-button");
    if (!button) return;
    const key = button.dataset.service;
    const fromDb = servicesData.find((s) => String(s.id) === String(key));
    const title = fromDb ? fromDb.title : button.closest(".service-card").querySelector("h3").textContent.trim();
    const text = fromDb ? fromDb.full_description || fromDb.description
        : fallbackServiceText[key] || button.closest(".service-card").querySelector("p").textContent.trim();
    qs("serviceModalTitle").textContent = title;
    qs("serviceModalText").textContent = text;
    openModal("serviceModal");
});

/* 6. FEATURES (public) */
const fallbackFeatureText = {
    "computer-tips": "Useful computer tricks, maintenance information and troubleshooting guides.",
    "phone-tips": "Smartphone settings, tricks and useful mobile technology information.",
    "ai-tools": "Useful artificial intelligence tools and practical ways to use them.",
    gaming: "Gaming technology, performance settings and useful gaming information.",
    programming: "Programming knowledge, coding tips and development resources.",
    "software-tips": "Software guides, applications and useful technology tutorials.",
};
let featuresData = [];
async function loadFeatures() {
    try {
        const { data, error } = await sb.from("features").select("*").eq("status", "published").order("display_order", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) { featuresData = data; renderFeatureGrid(data); }
    } catch (err) { console.error("loadFeatures failed, keeping default cards:", err); }
}
function renderFeatureGrid(features) {
    const grid = document.querySelector("#features .feature-grid");
    if (!grid) return;
    grid.innerHTML = features.map((feature, index) => `
        <article class="feature-card">
            <div class="feature-number">${String(index + 1).padStart(2, "0")}</div>
            <h3>${escapeHtml(feature.title)}</h3>
            <p>${escapeHtml(feature.description)}</p>
            <button type="button" class="view-button feature-view-button" data-feature="${feature.id}">Explore</button>
        </article>`).join("");
}
document.querySelector("#features .feature-grid")?.addEventListener("click", (event) => {
    const button = event.target.closest(".feature-view-button");
    if (!button) return;
    const key = button.dataset.feature;
    const fromDb = featuresData.find((f) => String(f.id) === String(key));
    const title = fromDb ? fromDb.title : button.closest(".feature-card").querySelector("h3").textContent.trim();
    const text = fromDb ? fromDb.full_description || fromDb.description
        : fallbackFeatureText[key] || button.closest(".feature-card").querySelector("p").textContent.trim();
    qs("featureModalTitle").textContent = title;
    qs("featureModalText").textContent = text;
    openModal("featureModal");
});

/* 7. BLOG / NEWS (public) */
let publishedContents = [];
async function loadPublicContents() {
    try {
        const { data, error } = await sb.from("contents").select("*").eq("status", "published")
            .order("display_order", { ascending: true }).order("created_at", { ascending: false });
        if (error) throw error;
        publishedContents = data || [];
    } catch (err) { console.error("loadPublicContents failed:", err); publishedContents = []; }
    renderBlogGrid();
    renderLatestContent();
}
function contentCardMarkup(item, forHome) {
    let mediaBlock = "";
    if (item.thumbnail_url) {
        mediaBlock = `<div class="blog-card-media"><img src="${escapeHtml(item.thumbnail_url)}" alt="${escapeHtml(item.title)}" loading="lazy"></div>`;
    } else if (item.category === "video" && item.media_url) {
        mediaBlock = `<div class="blog-card-media"><video src="${escapeHtml(item.media_url)}" controls></video></div>`;
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}#article-${item.id}`;
    return `
        <article class="blog-card" id="article-${item.id}">
            ${mediaBlock}
            <div class="blog-card-body">
                <div class="blog-category">${escapeHtml(item.category || "news")}</div>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description || (item.content ? item.content.slice(0, 140) : ""))}</p>
                <span class="blog-date">${formatDate(item.published_at || item.created_at)}</span>
                ${item.file_url ? `<div class="content-file"><a href="${escapeHtml(item.file_url)}" target="_blank" rel="noopener noreferrer">Open File</a></div>` : ""}
                ${!forHome ? shareButtonsMarkup(item.id, shareUrl, item.title) : ""}
            </div>
        </article>`;
}
function shareButtonsMarkup(id, url, title) {
    const u = encodeURIComponent(url), t = encodeURIComponent(title);
    return `
        <div class="share-buttons" data-share-url="${escapeHtml(url)}">
            <a class="view-button" target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?text=${t}%20${u}">WhatsApp</a>
            <a class="view-button" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/sharer/sharer.php?u=${u}">Facebook</a>
            <a class="view-button" target="_blank" rel="noopener noreferrer" href="https://twitter.com/intent/tweet?text=${t}&url=${u}">X</a>
            <button type="button" class="view-button copy-link-button" data-url="${escapeHtml(url)}">Copy Link</button>
        </div>`;
}
function renderBlogGrid() {
    const blogGrid = qs("blogGrid");
    if (!blogGrid) return;
    if (publishedContents.length === 0) { blogGrid.innerHTML = `<div class="empty-content">No blog content has been published yet.</div>`; return; }
    blogGrid.innerHTML = publishedContents.map((item) => contentCardMarkup(item, false)).join("");
}
function renderLatestContent() {
    const latest = qs("latestContent");
    if (!latest) return;
    if (publishedContents.length === 0) { latest.innerHTML = `<div class="empty-content">No content has been published yet.</div>`; return; }
    latest.innerHTML = publishedContents.slice(0, 3).map((item) => contentCardMarkup(item, true)).join("");
}
document.addEventListener("click", (event) => {
    const shareBtn = event.target.closest(".copy-link-button");
    if (!shareBtn) return;
    const url = shareBtn.dataset.url;
    navigator.clipboard.writeText(url).then(() => {
        const original = shareBtn.textContent;
        shareBtn.textContent = "Copied";
        setTimeout(() => (shareBtn.textContent = original), 1500);
    }).catch(() => { alert("Could not copy the link automatically. Link: " + url); });
});

/* 8. LOCAL COMMENTS (browser only) */
let comments = [];
try { comments = JSON.parse(localStorage.getItem("danielTechComments")) || []; } catch (e) { comments = []; }
const commentForm = qs("commentForm");
const commentsList = qs("commentsList");
function renderComments() {
    if (!commentsList) return;
    if (comments.length === 0) { commentsList.innerHTML = `<p class="empty-content">No comments yet.</p>`; return; }
    commentsList.innerHTML = comments.map((c) => `
        <div class="comment-item"><strong>${escapeHtml(c.name)}</strong><p>${escapeHtml(c.text)}</p></div>`).join("");
}
if (commentForm) {
    commentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = qs("commentName").value.trim();
        const text = qs("commentText").value.trim();
        if (!name || !text) return;
        comments.push({ name, text });
        localStorage.setItem("danielTechComments", JSON.stringify(comments));
        commentForm.reset();
        renderComments();
    });
}
renderComments();

/* 9. CONTACT FORM -> messages table */
const contactForm = qs("contactForm");
const contactStatus = qs("contactStatus");
if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = qs("contactName").value.trim();
        const email = qs("contactEmail").value.trim();
        const subject = qs("contactSubject").value.trim();
        const message = qs("contactMessage").value.trim();
        setStatus(contactStatus, "Sending your message...", false);
        try {
            const { error } = await sb.from("messages").insert([{ name, email, subject, message, status: "unread" }]);
            if (error) throw error;
            setStatus(contactStatus, "Your message has been received. We will respond as soon as possible.", false);
            contactForm.reset();
        } catch (err) {
            console.error("contact submit failed:", err);
            setStatus(contactStatus, "Sorry, your message could not be sent. Please try again.", true);
        }
    });
}

/* 10. HOME / ABOUT / FOOTER content from Supabase */
async function loadSiteSettingsPublic() {
    try {
        const { data, error } = await sb.from("site_settings").select("*");
        if (error) throw error;
        const s = {};
        (data || []).forEach((row) => (s[row.setting_key] = row.setting_value));
        if (s.hero_subtitle) { const l = document.querySelector(".hero-label"); if (l) l.textContent = s.hero_subtitle; }
        if (s.hero_title) { const sp = document.querySelector(".hero h1 span"); if (sp) sp.textContent = s.hero_title; }
        if (s.hero_description) { const d = document.querySelector(".hero-description"); if (d) d.textContent = s.hero_description; }
        if (qs("footerText") && s.footer_text) qs("footerText").textContent = s.footer_text;
        if (qs("footerEmail") && s.footer_email) qs("footerEmail").textContent = s.footer_email;
        if (qs("footerPhone") && s.footer_phone) qs("footerPhone").textContent = s.footer_phone;
        if (qs("footerAddress") && s.footer_address) qs("footerAddress").textContent = s.footer_address;
    } catch (err) { console.error("loadSiteSettingsPublic failed:", err); }
}
async function loadAboutPublic() {
    try {
        const { data, error } = await sb.from("about_sections").select("*").eq("status", "published");
        if (error) throw error;
        const main = (data || []).find((s) => s.section_key === "main");
        if (main) {
            const c = document.querySelector("#aboutModal .modal-content");
            if (c) {
                const h = c.querySelector("h2"), p = c.querySelectorAll("p");
                if (h && main.title) h.textContent = main.title;
                if (p[1] && main.content) p[1].textContent = main.content;
            }
        }
    } catch (err) { console.error("loadAboutPublic failed:", err); }
}
async function loadSocialLinksPublic() {
    const container = qs("footerSocialLinks");
    if (!container) return;
    try {
        const { data, error } = await sb.from("social_links").select("*").eq("status", "published").order("display_order", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
            container.innerHTML = data.map((l) =>
                `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.platform)}</a>`).join("");
        }
    } catch (err) { console.error("loadSocialLinksPublic failed:", err); }
}

/* 11. ADMIN AUTH (works only if the admin markup exists in the page) */
const adminButton = qs("adminButton");
const adminLoginForm = qs("adminLoginForm");
const loginMessage = qs("loginMessage");
if (adminButton) adminButton.addEventListener("click", () => { closeSettingsPanel(); openModal("adminLoginModal"); });
if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = qs("adminUsername").value.trim();
        const password = qs("adminPassword").value;
        setStatus(loginMessage, "Signing in...", false);
        try {
            const { data, error } = await sb.auth.signInWithPassword({ email, password });
            if (error) throw error;
            const user = data.user;
            if (!user || user.id !== ADMIN_UID) {
                await sb.auth.signOut();
                setStatus(loginMessage, "This account is not authorized as admin.", true);
                return;
            }
            currentSession = data.session; isAdmin = true;
            closeModal("adminLoginModal");
            adminLoginForm.reset();
            setStatus(loginMessage, "", false);
            openModal("dashboardModal");
            await refreshDashboard();
        } catch (err) {
            console.error("admin login failed:", err);
            setStatus(loginMessage, "Invalid admin details. Please try again.", true);
        }
    });
}
async function ensureAdminSession() {
    const { data, error } = await sb.auth.getSession();
    if (error || !data.session || data.session.user.id !== ADMIN_UID) { isAdmin = false; currentSession = null; return false; }
    currentSession = data.session; isAdmin = true;
    return true;
}
async function requireAdmin() {
    const ok = await ensureAdminSession();
    if (!ok) {
        closeModal("dashboardModal"); isAdmin = false;
        alert("Your admin session has expired. Please log in again.");
        openModal("adminLoginModal");
    }
    return ok;
}
const logoutButton = qs("logoutButton");
if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        try { await sb.auth.signOut(); } catch (err) { console.error("logout failed:", err); }
        isAdmin = false; currentSession = null;
        closeModal("dashboardModal");
    });
}
(async function restoreAdminSession() { await ensureAdminSession(); })();

/* 12. ADMIN DASHBOARD - TABS */
const dashboardTabs = document.querySelectorAll(".dashboard-tab");
const dashboardPanels = document.querySelectorAll(".admin-panel");
function showDashboardPanel(panelName) {
    dashboardPanels.forEach((p) => p.classList.remove("active-panel"));
    dashboardTabs.forEach((t) => t.classList.remove("active"));
    const panel = document.querySelector(`.admin-panel[data-panel="${panelName}"]`);
    const tab = document.querySelector(`.dashboard-tab[data-panel="${panelName}"]`);
    if (panel) panel.classList.add("active-panel");
    if (tab) tab.classList.add("active");
}
dashboardTabs.forEach((tab) => tab.addEventListener("click", () => showDashboardPanel(tab.dataset.panel)));
async function refreshDashboard() {
    if (!(await requireAdmin())) return;
    showDashboardPanel("overview");
    await Promise.all([loadDashboardStats(), renderAdminContents(), renderAdminServices(), renderAdminFeatures(),
        renderAdminMessages(), loadHomeEditorValues(), loadAboutEditorValues(), loadFooterEditorValues()]);
}

/* 13. DASHBOARD - STATS */
async function loadDashboardStats() {
    try {
        const [sv, ft, ct, pb, ms] = await Promise.all([
            sb.from("services").select("id", { count: "exact", head: true }),
            sb.from("features").select("id", { count: "exact", head: true }),
            sb.from("contents").select("id", { count: "exact", head: true }),
            sb.from("contents").select("id", { count: "exact", head: true }).eq("status", "published"),
            sb.from("messages").select("id", { count: "exact", head: true }),
        ]);
        setText("statServices", sv.count ?? 0); setText("statFeatures", ft.count ?? 0);
        setText("statContents", ct.count ?? 0); setText("statPublished", pb.count ?? 0); setText("statMessages", ms.count ?? 0);
    } catch (err) { console.error("loadDashboardStats failed:", err); }
}

/* 14. DASHBOARD - NEWS / BLOG */
const contentTitle = qs("contentTitle"), contentCategory = qs("contentCategory"), contentText = qs("contentText");
const contentFile = qs("contentFile"), contentFeatured = qs("contentFeatured"), contentStatusSelect = qs("contentStatusSelect");
const saveContentButton = qs("saveContentButton"), contentStatus = qs("contentStatus");
let editingContentId = null;

async function uploadFile(file, folder) {
    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await sb.storage.from(STORAGE_BUCKET).upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    const { data } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
}
if (saveContentButton) {
    saveContentButton.addEventListener("click", async () => {
        if (!(await requireAdmin())) return;
        const title = contentTitle.value.trim(), category = contentCategory.value, text = contentText.value.trim();
        const status = contentStatusSelect ? contentStatusSelect.value : "published";
        const featured = contentFeatured ? contentFeatured.checked : false;
        if (!title || !text) { alert("Please enter title and content."); return; }
        setStatus(contentStatus, "Saving...", false);
        saveContentButton.disabled = true;
        try {
            let fileUrl = null;
            const file = contentFile && contentFile.files[0];
            if (file) { setStatus(contentStatus, "Uploading file...", false); fileUrl = await uploadFile(file, "content"); }
            const payload = { title, category, content: text, description: text.slice(0, 160), status, featured, updated_at: new Date().toISOString() };
            if (fileUrl) {
                payload.file_url = fileUrl;
                if (category === "video") payload.media_url = fileUrl; else payload.thumbnail_url = fileUrl;
            }
            if (status === "published") payload.published_at = new Date().toISOString();
            if (editingContentId) {
                const { error } = await sb.from("contents").update(payload).eq("id", editingContentId);
                if (error) throw error;
            } else {
                payload.slug = slugify(title);
                const { error } = await sb.from("contents").insert([payload]);
                if (error) throw error;
            }
            setStatus(contentStatus, "Content saved successfully.", false);
            resetContentForm();
            await Promise.all([renderAdminContents(), loadPublicContents(), loadDashboardStats()]);
        } catch (err) {
            console.error("save content failed:", err);
            setStatus(contentStatus, "Could not save content. Please try again.", true);
        } finally { saveContentButton.disabled = false; }
    });
}
function resetContentForm() {
    editingContentId = null;
    if (contentTitle) contentTitle.value = "";
    if (contentText) contentText.value = "";
    if (contentFile) contentFile.value = "";
    if (contentFeatured) contentFeatured.checked = false;
    if (saveContentButton) saveContentButton.textContent = "Publish Content";
}
["addNewsButton", "addTipButton", "addVideoButton", "addPdfButton"].forEach((id) => {
    const map = { addNewsButton: "news", addTipButton: "tip", addVideoButton: "video", addPdfButton: "pdf" };
    const btn = qs(id);
    if (btn) btn.addEventListener("click", () => {
        resetContentForm();
        if (contentCategory) contentCategory.value = map[id];
        if (contentTitle) contentTitle.focus();
    });
});
async function renderAdminContents() {
    const list = qs("adminContentList");
    if (!list) return;
    try {
        const { data, error } = await sb.from("contents").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) { list.innerHTML = `<p class="empty-content">No content has been added yet.</p>`; return; }
        list.innerHTML = data.map((item) => `
            <div class="admin-content-item">
                <div><h4>${escapeHtml(item.title)}</h4>
                <p>${escapeHtml(item.category)} — ${escapeHtml(item.status)}${item.featured ? " — Featured" : ""}</p></div>
                <div>
                    <button class="view-button edit-content-button" data-id="${item.id}">Edit</button>
                    <button class="view-button toggle-status-button" data-id="${item.id}" data-status="${item.status}">${item.status === "published" ? "Unpublish" : "Publish"}</button>
                    <button class="delete-content-button" data-id="${item.id}">Delete</button>
                </div>
            </div>`).join("");
        list.querySelectorAll(".edit-content-button").forEach((b) => b.addEventListener("click", () => editContent(Number(b.dataset.id), data)));
        list.querySelectorAll(".toggle-status-button").forEach((b) => b.addEventListener("click", () => toggleContentStatus(Number(b.dataset.id), b.dataset.status)));
        list.querySelectorAll(".delete-content-button").forEach((b) => b.addEventListener("click", () => deleteContent(Number(b.dataset.id))));
    } catch (err) { console.error("renderAdminContents failed:", err); list.innerHTML = `<p class="empty-content">Could not load content.</p>`; }
}
function editContent(id, data) {
    const item = data.find((c) => c.id === id);
    if (!item) return;
    editingContentId = id;
    contentTitle.value = item.title || "";
    contentCategory.value = item.category || "news";
    contentText.value = item.content || "";
    if (contentFeatured) contentFeatured.checked = !!item.featured;
    if (contentStatusSelect) contentStatusSelect.value = item.status || "published";
    if (saveContentButton) saveContentButton.textContent = "Update Content";
    contentTitle.scrollIntoView({ behavior: "smooth", block: "center" });
}
async function toggleContentStatus(id, currentStatus) {
    if (!(await requireAdmin())) return;
    const newStatus = currentStatus === "published" ? "draft" : "published";
    const payload = { status: newStatus, updated_at: new Date().toISOString() };
    if (newStatus === "published") payload.published_at = new Date().toISOString();
    try {
        const { error } = await sb.from("contents").update(payload).eq("id", id);
        if (error) throw error;
        await Promise.all([renderAdminContents(), loadPublicContents(), loadDashboardStats()]);
    } catch (err) { console.error("toggleContentStatus failed:", err); alert("Could not update the content status."); }
}
async function deleteContent(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    if (!(await requireAdmin())) return;
    try {
        const { error } = await sb.from("contents").delete().eq("id", id);
        if (error) throw error;
        await Promise.all([renderAdminContents(), loadPublicContents(), loadDashboardStats()]);
    } catch (err) { console.error("deleteContent failed:", err); alert("Could not delete this item."); }
}

/* 15-16. DASHBOARD - SERVICES + FEATURES CRUD (one shared implementation) */
function setupCrud(cfg) {
    const f = {};
    ["Title", "Description", "FullDescription", "Order", "Status"].forEach((n) => (f[n] = qs(cfg.prefix + "Editor" + n)));
    const saveBtn = qs("save" + cfg.name + "Button"), cancelBtn = qs("cancel" + cfg.name + "EditButton"), msg = qs(cfg.prefix + "EditorStatusMsg");
    let editingId = null;
    function reset() {
        editingId = null;
        if (f.Title) f.Title.value = ""; if (f.Description) f.Description.value = "";
        if (f.FullDescription) f.FullDescription.value = ""; if (f.Order) f.Order.value = "0";
        if (f.Status) f.Status.value = "published";
        if (saveBtn) saveBtn.textContent = "Add " + cfg.name;
    }
    async function render() {
        const list = qs(cfg.listId);
        if (!list) return;
        try {
            const { data, error } = await sb.from(cfg.table).select("*").order("display_order", { ascending: true });
            if (error) throw error;
            if (!data || data.length === 0) { list.innerHTML = `<p class="empty-content">No ${cfg.table} in the database yet. Add one below.</p>`; return; }
            list.innerHTML = data.map((item) => `
                <div class="admin-content-item">
                    <div><h4>${escapeHtml(item.title)}</h4><p>Order ${item.display_order} — ${escapeHtml(item.status)}</p></div>
                    <div>
                        <button class="view-button crud-edit" data-id="${item.id}">Edit</button>
                        <button class="delete-content-button crud-delete" data-id="${item.id}">Delete</button>
                    </div>
                </div>`).join("");
            list.querySelectorAll(".crud-edit").forEach((b) => b.addEventListener("click", () => {
                const item = data.find((s) => s.id === Number(b.dataset.id));
                if (!item) return;
                editingId = item.id;
                f.Title.value = item.title || ""; f.Description.value = item.description || "";
                f.FullDescription.value = item.full_description || ""; f.Order.value = item.display_order || 0;
                f.Status.value = item.status || "published";
                saveBtn.textContent = "Update " + cfg.name;
                f.Title.scrollIntoView({ behavior: "smooth", block: "center" });
            }));
            list.querySelectorAll(".crud-delete").forEach((b) => b.addEventListener("click", async () => {
                if (!confirm("Are you sure you want to delete this " + cfg.label + "?")) return;
                if (!(await requireAdmin())) return;
                try {
                    const { error } = await sb.from(cfg.table).delete().eq("id", Number(b.dataset.id));
                    if (error) throw error;
                    await Promise.all([render(), cfg.reloadPublic(), loadDashboardStats()]);
                } catch (err) { console.error("delete " + cfg.label + " failed:", err); alert("Could not delete this " + cfg.label + "."); }
            }));
        } catch (err) { console.error("render " + cfg.table + " failed:", err); list.innerHTML = `<p class="empty-content">Could not load ${cfg.table}.</p>`; }
    }
    if (saveBtn) saveBtn.addEventListener("click", async () => {
        if (!(await requireAdmin())) return;
        const title = f.Title.value.trim(), description = f.Description.value.trim();
        if (!title || !description) { alert("Please enter a title and short description."); return; }
        const payload = { title, description, full_description: f.FullDescription.value.trim(),
            display_order: Number(f.Order.value) || 0, status: f.Status.value, updated_at: new Date().toISOString() };
        setStatus(msg, "Saving...", false);
        try {
            if (editingId) { const { error } = await sb.from(cfg.table).update(payload).eq("id", editingId); if (error) throw error; }
            else { const { error } = await sb.from(cfg.table).insert([payload]); if (error) throw error; }
            setStatus(msg, cfg.name + " saved.", false);
            reset();
            await Promise.all([render(), cfg.reloadPublic(), loadDashboardStats()]);
        } catch (err) { console.error("save " + cfg.label + " failed:", err); setStatus(msg, "Could not save the " + cfg.label + ".", true); }
    });
    if (cancelBtn) cancelBtn.addEventListener("click", reset);
    return render;
}
const renderAdminServices = setupCrud({ name: "Service", label: "service", table: "services", prefix: "service", listId: "adminServiceList", reloadPublic: loadServices });
const renderAdminFeatures = setupCrud({ name: "Feature", label: "feature", table: "features", prefix: "feature", listId: "adminFeatureList", reloadPublic: loadFeatures });

/* 17. DASHBOARD - MESSAGES */
async function renderAdminMessages() {
    const list = qs("adminMessagesList");
    if (!list) return;
    try {
        const { data, error } = await sb.from("messages").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) { list.innerHTML = `<p class="empty-content">No messages yet.</p>`; return; }
        list.innerHTML = data.map((msg) => `
            <div class="admin-message-item">
                <h4>${escapeHtml(msg.subject || "No subject")}</h4>
                <p><strong>From:</strong> ${escapeHtml(msg.name)} (${escapeHtml(msg.email)})</p>
                <p>${escapeHtml(msg.message)}</p>
                <small>${formatDate(msg.created_at)} — ${escapeHtml(msg.status)}</small>
                <div>
                    <button class="view-button toggle-message-status-button" data-id="${msg.id}" data-status="${msg.status}">Mark as ${msg.status === "unread" ? "read" : "unread"}</button>
                    <button class="delete-message-button" data-id="${msg.id}">Delete</button>
                </div>
            </div>`).join("");
        list.querySelectorAll(".toggle-message-status-button").forEach((btn) => btn.addEventListener("click", async () => {
            if (!(await requireAdmin())) return;
            const newStatus = btn.dataset.status === "unread" ? "read" : "unread";
            try {
                const { error } = await sb.from("messages").update({ status: newStatus }).eq("id", Number(btn.dataset.id));
                if (error) throw error;
                await renderAdminMessages();
            } catch (err) { console.error("toggle message status failed:", err); }
        }));
        list.querySelectorAll(".delete-message-button").forEach((btn) => btn.addEventListener("click", async () => {
            if (!confirm("Are you sure you want to delete this message?")) return;
            if (!(await requireAdmin())) return;
            try {
                const { error } = await sb.from("messages").delete().eq("id", Number(btn.dataset.id));
                if (error) throw error;
                await Promise.all([renderAdminMessages(), loadDashboardStats()]);
            } catch (err) { console.error("delete message failed:", err); }
        }));
    } catch (err) { console.error("renderAdminMessages failed:", err); list.innerHTML = `<p class="empty-content">Could not load messages.</p>`; }
}
const refreshMessagesButton = qs("refreshMessagesButton");
if (refreshMessagesButton) refreshMessagesButton.addEventListener("click", renderAdminMessages);

/* 18. DASHBOARD - HOME PAGE EDITOR */
const homeEditorFields = {
    hero_title: "homeHeroTitle", hero_subtitle: "homeHeroSubtitle", hero_description: "homeHeroDescription",
    hero_button_text: "homeHeroButtonText", hero_button_link: "homeHeroButtonLink",
    welcome_title: "homeWelcomeTitle", welcome_text: "homeWelcomeText", cta_title: "homeCtaTitle", cta_text: "homeCtaText",
};
async function loadHomeEditorValues() {
    try {
        const { data, error } = await sb.from("site_settings").select("*");
        if (error) throw error;
        (data || []).forEach((row) => {
            const fieldId = homeEditorFields[row.setting_key];
            const el = fieldId && qs(fieldId);
            if (el) el.value = row.setting_value || "";
        });
    } catch (err) { console.error("loadHomeEditorValues failed:", err); }
}
const saveHomeButton = qs("saveHomeButton"), homeEditorStatus = qs("homeEditorStatus");
if (saveHomeButton) saveHomeButton.addEventListener("click", async () => {
    if (!(await requireAdmin())) return;
    setStatus(homeEditorStatus, "Saving...", false);
    try {
        const rows = Object.entries(homeEditorFields).map(([key, fieldId]) => ({
            setting_key: key, setting_value: qs(fieldId) ? qs(fieldId).value : "", updated_at: new Date().toISOString() }));
        const { error } = await sb.from("site_settings").upsert(rows, { onConflict: "setting_key" });
        if (error) throw error;
        setStatus(homeEditorStatus, "Home page updated.", false);
        await loadSiteSettingsPublic();
    } catch (err) { console.error("save home settings failed:", err); setStatus(homeEditorStatus, "Could not save changes.", true); }
});

/* 19. DASHBOARD - ABOUT EDITOR */
async function loadAboutEditorValues() {
    try {
        const { data, error } = await sb.from("about_sections").select("*");
        if (error) throw error;
        const get = (k) => (data || []).find((s) => s.section_key === k);
        const main = get("main"), mission = get("mission"), vision = get("vision");
        if (main && qs("aboutTitle")) qs("aboutTitle").value = main.title || "";
        if (main && qs("aboutDescription")) qs("aboutDescription").value = main.content || "";
        if (mission && qs("aboutMission")) qs("aboutMission").value = mission.content || "";
        if (vision && qs("aboutVision")) qs("aboutVision").value = vision.content || "";
    } catch (err) { console.error("loadAboutEditorValues failed:", err); }
}
const saveAboutButton = qs("saveAboutButton"), aboutEditorStatus = qs("aboutEditorStatus");
if (saveAboutButton) saveAboutButton.addEventListener("click", async () => {
    if (!(await requireAdmin())) return;
    setStatus(aboutEditorStatus, "Saving...", false);
    try {
        const now = new Date().toISOString();
        const rows = [
            { section_key: "main", title: qs("aboutTitle").value.trim(), content: qs("aboutDescription").value.trim(), updated_at: now },
            { section_key: "mission", title: "Mission", content: qs("aboutMission").value.trim(), updated_at: now },
            { section_key: "vision", title: "Vision", content: qs("aboutVision").value.trim(), updated_at: now },
        ];
        const { error } = await sb.from("about_sections").upsert(rows, { onConflict: "section_key" });
        if (error) throw error;
        setStatus(aboutEditorStatus, "About section updated.", false);
        await loadAboutPublic();
    } catch (err) { console.error("save about failed:", err); setStatus(aboutEditorStatus, "Could not save changes.", true); }
});

/* 20. DASHBOARD - FOOTER EDITOR */
async function loadFooterEditorValues() {
    try {
        const { data, error } = await sb.from("site_settings").select("*");
        if (error) throw error;
        const s = {};
        (data || []).forEach((row) => (s[row.setting_key] = row.setting_value));
        if (qs("footerTextInput")) qs("footerTextInput").value = s.footer_text || "";
        if (qs("footerEmailInput")) qs("footerEmailInput").value = s.footer_email || "";
        if (qs("footerPhoneInput")) qs("footerPhoneInput").value = s.footer_phone || "";
        if (qs("footerAddressInput")) qs("footerAddressInput").value = s.footer_address || "";
    } catch (err) { console.error("loadFooterEditorValues failed:", err); }
}
const saveFooterButton = qs("saveFooterButton"), footerEditorStatus = qs("footerEditorStatus");
if (saveFooterButton) saveFooterButton.addEventListener("click", async () => {
    if (!(await requireAdmin())) return;
    setStatus(footerEditorStatus, "Saving...", false);
    try {
        const rows = [
            { setting_key: "footer_text", setting_value: qs("footerTextInput").value.trim() },
            { setting_key: "footer_email", setting_value: qs("footerEmailInput").value.trim() },
            { setting_key: "footer_phone", setting_value: qs("footerPhoneInput").value.trim() },
            { setting_key: "footer_address", setting_value: qs("footerAddressInput").value.trim() },
        ].map((r) => ({ ...r, updated_at: new Date().toISOString() }));
        const { error } = await sb.from("site_settings").upsert(rows, { onConflict: "setting_key" });
        if (error) throw error;
        setStatus(footerEditorStatus, "Footer updated.", false);
        await loadSiteSettingsPublic();
    } catch (err) { console.error("save footer failed:", err); setStatus(footerEditorStatus, "Could not save changes.", true); }
});

/* 21. BACK TO TOP */
const backTop = qs("backTop");
if (backTop) {
    window.addEventListener("scroll", () => backTop.classList.toggle("show", window.scrollY > 400));
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* 22. INIT */
document.addEventListener("DOMContentLoaded", () => {
    showPage("home");
    loadServices(); loadFeatures(); loadPublicContents();
    loadSiteSettingsPublic(); loadAboutPublic(); loadSocialLinksPublic();
});

/* =========================================================
   24. VERSION + SETTINGS PAGE (paste at the very bottom of script.js)
   Change the version here ONLY. Every place on the site reads it.
========================================================= */
window.DANIEL_TECH_VERSION = Object.freeze({
    version: "2.0.0",
    released: "2026-10-02",
    developer: "Daniel Shululu"
});

(function () {
  "use strict";
  var V = window.DANIEL_TECH_VERSION || {};
  var version = typeof V.version === "string" && /^\d+\.\d+\.\d+$/.test(V.version) ? V.version : "";
  var released = typeof V.released === "string" ? V.released : "";
  var developer = V.developer || "Daniel Shululu";

  var T = {
    en: {
      title: "Settings", sub: "Website preferences and information.",
      general: "General", name: "Website name", ver: "Website version", dev: "Developer",
      type: "Website type", typeV: "Technology & Digital Solutions", status: "Website status", online: "Online",
      lang: "Current language", langName: "English", theme: "Current theme", light: "Light Mode", dark: "Dark Mode",
      updated: "Last updated", language: "Language", appearance: "Appearance",
      appearanceNote: "The theme changes automatically using your device time: Light Mode 06:00 to 17:59, Dark Mode 18:00 to 05:59.",
      info: "Website Information", infoText: "Daniel Tech is a technology platform for digital solutions, computer services, programming, AI tools and technology education.",
      versionCard: "Version", history: "Version History", current: "Current Version", prev: "Previous Release",
      h2: ["Automatic time-based Light and Dark theme", "Services and Features managed from the database", "Blog and News publishing with share links", "Private admin dashboard for content, messages and site text", "Central version system"],
      h1: ["Original Daniel Tech website", "Technology articles", "Computer tips", "Phone tips", "AI tools", "Programming", "Gaming"],
      about: "About Daniel Tech", devSec: "Developer Information", project: "Project", role: "Role", roleV: "Developer / Creator",
      legal: "Privacy", privacy: "Privacy Policy", cookies: "Cookie Policy", terms: "Terms & Conditions", termsShort: "Terms",
      unavailable: "Not available", footTag: "Technology \u2022 AI \u2022 Gaming \u2022 Programming \u2022 Digital Solutions", by: "Developed by",
      pPriv: ["When you use the contact form, your name, email, subject and message are stored so Daniel Tech can reply to you.", "Comments you post on the Blog page are saved only in your own browser.", "Daniel Tech does not sell your information."],
      pCook: ["Daniel Tech stores your language choice in your browser (local storage) and your comments on the Blog page.", "The theme is calculated from your device time and is not stored.", "Administrators who sign in also use a session managed by the authentication service."],
      pTerms: ["Content on Daniel Tech is provided for information and education.", "Do not misuse the website, its forms or its services.", "Daniel Tech may update content, services and these terms at any time."]
    },
    sw: {
      title: "Mipangilio", sub: "Mapendeleo na taarifa za tovuti.",
      general: "Taarifa za Jumla", name: "Jina la tovuti", ver: "Toleo la tovuti", dev: "Msanidi",
      type: "Aina ya tovuti", typeV: "Teknolojia na Suluhisho za Kidijitali", status: "Hali ya tovuti", online: "Inafanya kazi",
      lang: "Lugha ya sasa", langName: "Kiswahili", theme: "Mwonekano wa sasa", light: "Mwonekano wa Mchana (Light Mode)", dark: "Mwonekano wa Usiku (Dark Mode)",
      updated: "Imesasishwa mwisho", language: "Lugha", appearance: "Mwonekano",
      appearanceNote: "Mwonekano hubadilika wenyewe kulingana na saa ya kifaa chako: Light Mode saa 12:00 asubuhi hadi 11:59 jioni, Dark Mode saa 12:00 jioni hadi 11:59 usiku wa manane na alfajiri.",
      info: "Kuhusu Tovuti", infoText: "Daniel Tech ni jukwaa la teknolojia linalotoa suluhisho za kidijitali, huduma za kompyuta, programming, zana za AI na elimu ya teknolojia.",
      versionCard: "Toleo", history: "Historia ya Matoleo", current: "Toleo la Sasa", prev: "Toleo la Awali",
      h2: ["Mwonekano wa Light na Dark unaobadilika wenyewe kwa muda", "Huduma na Vipengele vinavyodhibitiwa kutoka kwenye database", "Machapisho ya Blog na Habari yenye viungo vya kushiriki", "Dashboard binafsi ya admin kwa maudhui, ujumbe na maandishi ya tovuti", "Mfumo mmoja wa toleo"],
      h1: ["Tovuti ya awali ya Daniel Tech", "Makala za teknolojia", "Vidokezo vya kompyuta", "Vidokezo vya simu", "Zana za AI", "Programming", "Michezo ya video (Gaming)"],
      about: "Kuhusu Daniel Tech", devSec: "Taarifa za Msanidi", project: "Mradi", role: "Nafasi", roleV: "Msanidi / Muundaji",
      legal: "Faragha", privacy: "Sera ya Faragha", cookies: "Sera ya Cookies", terms: "Masharti na Vigezo", termsShort: "Masharti",
      unavailable: "Haipatikani", footTag: "Teknolojia \u2022 AI \u2022 Gaming \u2022 Programming \u2022 Suluhisho za Kidijitali", by: "Imetengenezwa na",
      pPriv: ["Ukitumia fomu ya mawasiliano, jina, barua pepe, mada na ujumbe wako huhifadhiwa ili Daniel Tech ikujibu.", "Maoni unayoandika kwenye ukurasa wa Blog huhifadhiwa kwenye kivinjari chako tu.", "Daniel Tech haiuzi taarifa zako."],
      pCook: ["Daniel Tech huhifadhi lugha uliyochagua kwenye kivinjari chako (local storage) pamoja na maoni yako ya Blog.", "Mwonekano huhesabiwa kutoka saa ya kifaa chako na haihifadhiwi.", "Wasimamizi wanaoingia hutumia pia session inayodhibitiwa na huduma ya authentication."],
      pTerms: ["Maudhui ya Daniel Tech yametolewa kwa ajili ya taarifa na elimu.", "Usitumie vibaya tovuti, fomu zake wala huduma zake.", "Daniel Tech inaweza kubadilisha maudhui, huduma na masharti haya wakati wowote."]
    }
  };

  var lang = "en";
  try { lang = localStorage.getItem("danielTechLang") === "sw" ? "sw" : "en"; } catch (e) {}
  function t() { return T[lang]; }
  function isDark() { return document.documentElement.classList.contains("dark-mode"); }
  function verText() { return version || t().unavailable; }
  function dateText() {
    var d = new Date(released);
    return isNaN(d.getTime()) ? t().unavailable : d.toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { year: "numeric", month: "long", day: "numeric" });
  }
  function row(l, v) { return '<div class="st-row"><span>' + l + "</span><strong>" + v + "</strong></div>"; }
  function list(a) { return "<ul>" + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }
  function legalLink(p, label) { return '<a class="st-link" href="#" data-legal="' + p + '">' + label + "</a>"; }

  var main = document.querySelector("main");
  if (!main) return;

  function mkPage(id) {
    var s = document.getElementById(id);
    if (!s) { s = document.createElement("section"); s.id = id; s.className = "page"; main.appendChild(s); }
    return s;
  }
  var pSettings = mkPage("settings"), pPrivacy = mkPage("privacy"), pCookies = mkPage("cookies"), pTerms = mkPage("terms");

  function renderSettings() {
    var x = t();
    pSettings.innerHTML =
      '<div class="st-wrap"><div class="st-head"><h2>' + x.title + "</h2><p>" + x.sub + "</p></div><div class=\"st-grid\">" +
      '<div class="st-card"><h3>' + x.general + "</h3>" +
        row(x.name, "Daniel Tech") + row(x.ver, verText()) + row(x.dev, developer) + row(x.type, x.typeV) +
        row(x.status, x.online) + row(x.lang, x.langName) + row(x.theme, isDark() ? x.dark : x.light) + row(x.updated, dateText()) + "</div>" +
      '<div class="st-card"><h3>' + x.versionCard + '</h3><p>Daniel Tech</p><div class="st-version">' + (version ? "Version " + version : x.unavailable) +
        "</div><p>" + x.typeV + "</p><p>" + x.by + " " + developer + "</p></div>" +
      '<div class="st-card"><h3>' + x.language + '</h3><div class="st-langs">' +
        '<button type="button" class="st-btn" data-lang="sw" aria-pressed="' + (lang === "sw") + '">Kiswahili</button>' +
        '<button type="button" class="st-btn" data-lang="en" aria-pressed="' + (lang === "en") + '">English</button></div></div>' +
      '<div class="st-card"><h3>' + x.appearance + "</h3>" + row(x.theme, isDark() ? x.dark : x.light) + "<p>" + x.appearanceNote + "</p></div>" +
      '<div class="st-card wide"><h3>' + x.info + "</h3><p>" + x.infoText + "</p></div>" +
      '<div class="st-card wide st-history"><h3>' + x.history + "</h3>" +
        "<h4>Version 2.x" + '<span class="st-tag">' + x.current + "</span></h4>" + list(x.h2) +
        "<h4>Version 1.x" + '<span class="st-tag">' + x.prev + "</span></h4>" + list(x.h1) + "</div>" +
      '<div class="st-card"><h3>' + x.devSec + "</h3>" + row(x.dev, developer) + row(x.project, "Daniel Tech") + row(x.role, x.roleV) + "</div>" +
      '<div class="st-card"><h3>' + x.legal + '</h3><div class="st-links">' + legalLink("privacy", x.privacy) + legalLink("cookies", x.cookies) + legalLink("terms", x.terms) + "</div></div>" +
      "</div></div>";
  }

  function renderLegal(el, title, paras) {
    el.innerHTML = '<div class="st-legal"><h2>' + title + "</h2>" + paras.map(function (p) { return "<p>" + p + "</p>"; }).join("") + "</div>";
  }

  function renderFooter() {
    var fb = document.querySelector(".footer-bottom");
    if (!fb) return;
    var x = t(), box = document.getElementById("footerExtra");
    if (!box) { box = document.createElement("div"); box.id = "footerExtra"; fb.appendChild(box); }
    box.innerHTML = '<div class="footer-meta">' + x.footTag + "</div>" +
      '<div class="footer-meta">' + (version ? "Daniel Tech v" + version + " \u2022 " : "") + x.by + " " + developer + "</div>" +
      '<div class="footer-legal"><a href="#" data-legal="privacy">' + x.privacy + '</a><a href="#" data-legal="cookies">' + x.cookies + '</a><a href="#" data-legal="terms">' + x.termsShort + "</a></div>";
  }

  function renderAll() {
    var x = t();
    document.documentElement.lang = lang;
    renderSettings();
    renderLegal(pPrivacy, x.privacy, x.pPriv);
    renderLegal(pCookies, x.cookies, x.pCook);
    renderLegal(pTerms, x.terms, x.pTerms);
    renderFooter();
  }

  document.addEventListener("click", function (e) {
    var l = e.target.closest("[data-legal]");
    if (l) { e.preventDefault(); showPage(l.dataset.legal); return; }
    var a = e.target.closest("[data-about]");
    if (a) { openModal("aboutModal"); return; }
    var b = e.target.closest("[data-lang]");
    if (b) {
      lang = b.dataset.lang === "sw" ? "sw" : "en";
      try { localStorage.setItem("danielTechLang", lang); } catch (err) {}
      renderAll();
    }
  });

  /* Settings button now opens the Settings page instead of the side panel. */
  var sb = document.getElementById("settingsButton");
  if (sb) sb.addEventListener("click", function (e) { e.stopImmediatePropagation(); showPage("settings"); }, true);

  /* Keep the displayed theme correct when the time-based theme flips. */
  new MutationObserver(function () { renderSettings(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  /* Admin: System Information tab (only if the dashboard markup exists). */
  function addAdminPanel() {
    var tabs = document.querySelector(".dashboard-tabs"), anyPanel = document.querySelector(".admin-panel");
    if (!tabs || !anyPanel || document.querySelector('.admin-panel[data-panel="system"]')) return;
    var tab = document.createElement("button");
    tab.type = "button"; tab.className = "dashboard-button dashboard-tab"; tab.dataset.panel = "system"; tab.textContent = "System Information";
    tabs.appendChild(tab);
    var host = location.hostname, env = (host === "localhost" || host === "127.0.0.1") ? "Development" : "Production";
    var p = document.createElement("div");
    p.className = "admin-panel"; p.dataset.panel = "system";
    p.innerHTML = '<div class="admin-editor"><h3>System Information</h3>' +
      "<p>Current Version: <strong>" + verText() + "</strong></p><p>Environment: <strong>" + env + "</strong></p>" +
      "<p>Website Status: <strong>Online</strong></p><p>Release date (last deployment): <strong>" + dateText() + "</strong></p>" +
      "<p>Last Updated: <strong>" + dateText() + "</strong></p>" +
      "<p>The version is set in version.js and changes only with a new deployment.</p></div>";
    anyPanel.parentNode.appendChild(p);
    tab.addEventListener("click", function () {
      document.querySelectorAll(".admin-panel").forEach(function (a) { a.classList.remove("active-panel"); });
      document.querySelectorAll(".dashboard-tab").forEach(function (a) { a.classList.remove("active"); });
      p.classList.add("active-panel"); tab.classList.add("active");
    });
  }

  renderAll();
  addAdminPanel();
})();
