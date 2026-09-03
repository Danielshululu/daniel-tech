/* =========================================================
   DANIEL TECH — MAIN JAVASCRIPT
   Supabase-backed. Matches index.html element IDs/classes exactly.
========================================================= */

/* ---------------------------------------------------------
   0. SUPABASE CONFIG
--------------------------------------------------------- */

const SUPABASE_URL = "https://bodprzntcloioncwhpvr.sb.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";
const ADMIN_UID = "05fef3eb-16a3-4554-9d9b-de7d2b29144b";
const STORAGE_BUCKET = "daniel-files";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

let currentSession = null;
let isAdmin = false;

/* ---------------------------------------------------------
   1. SMALL HELPERS
--------------------------------------------------------- */

function qs(id) {
    return document.getElementById(id);
}

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
    return String(text)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || ("item-" + Date.now());
}

function setStatus(el, message, isError) {
    if (!el) return;
    el.textContent = message || "";
    el.style.color = isError ? "#e33b89" : "";
}

/* ---------------------------------------------------------
   2. NAVIGATION / PAGES
--------------------------------------------------------- */

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

function closeMobileMenu() {
    if (mainNav) mainNav.classList.remove("active");
}

if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
        mainNav.classList.toggle("active");
    });
}

/* ---------------------------------------------------------
   3. DARK MODE
--------------------------------------------------------- */

const darkModeButton = qs("darkModeButton");
const settingsDarkMode = qs("settingsDarkMode");

function applyDarkMode(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    if (settingsDarkMode) settingsDarkMode.checked = isDark;
    localStorage.setItem("danielTechTheme", isDark ? "dark" : "light");
}

function toggleDarkMode() {
    applyDarkMode(!document.body.classList.contains("dark-mode"));
}

if (darkModeButton) darkModeButton.addEventListener("click", toggleDarkMode);
if (settingsDarkMode) {
    settingsDarkMode.addEventListener("change", () => {
        applyDarkMode(settingsDarkMode.checked);
    });
}

applyDarkMode(localStorage.getItem("danielTechTheme") === "dark");

/* ---------------------------------------------------------
   4. SETTINGS PANEL
--------------------------------------------------------- */

const settingsButton = qs("settingsButton");
const settingsPanel = qs("settingsPanel");
const closeSettingsButton = qs("closeSettings");
const overlay = qs("overlay");

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

/* ---------------------------------------------------------
   5. MODALS (generic open/close)
--------------------------------------------------------- */

function openModal(modalId) {
    const modal = qs(modalId);
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeModal(modalId) {
    const modal = qs(modalId);
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function closeAllModals() {
    document.querySelectorAll(".modal.active").forEach((modal) => {
        modal.classList.remove("active");
    });
    document.body.style.overflow = "";
}

document.querySelectorAll(".modal-close").forEach((button) => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.closeModal;
        if (modalId) {
            closeModal(modalId);
        } else {
            const modal = button.closest(".modal");
            if (modal) modal.classList.remove("active");
        }
    });
});

document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSettingsPanel();
        closeAllModals();
    }
});

const aboutButton = qs("aboutButton");
if (aboutButton) {
    aboutButton.addEventListener("click", () => {
        closeSettingsPanel();
        openModal("aboutModal");
    });
}

/* ---------------------------------------------------------
   6. SERVICES (public)
--------------------------------------------------------- */

// Fallback text used only if the services table can't be reached / is empty,
// so the page never looks broken to a visitor.
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
        const { data, error } = await sb
            .from("services")
            .select("*")
            .eq("status", "published")
            .order("display_order", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
            servicesData = data;
            renderServiceGrid(data);
        }
    } catch (err) {
        console.error("loadServices failed, keeping default cards:", err);
    }
}

function renderServiceGrid(services) {
    const grid = document.querySelector("#services .service-grid");
    if (!grid) return;

    grid.innerHTML = services
        .map(
            (service, index) => `
        <article class="service-card">
            <div class="card-number">${String(index + 1).padStart(2, "0")}</div>
            <h3>${escapeHtml(service.title)}</h3>
            <p>${escapeHtml(service.description)}</p>
            <button type="button" class="view-button service-view-button" data-service="${service.id}">
                View Service
            </button>
        </article>
    `
        )
        .join("");
}

// Event delegation: works for both the static default cards and DB-rendered ones.
document.querySelector("#services .service-grid")?.addEventListener("click", (event) => {
    const button = event.target.closest(".service-view-button");
    if (!button) return;

    const key = button.dataset.service;
    const fromDb = servicesData.find((s) => String(s.id) === String(key));

    const title = fromDb ? fromDb.title : button.closest(".service-card").querySelector("h3").textContent.trim();
    const text = fromDb
        ? fromDb.full_description || fromDb.description
        : fallbackServiceText[key] || button.closest(".service-card").querySelector("p").textContent.trim();

    qs("serviceModalTitle").textContent = title;
    qs("serviceModalText").textContent = text;
    openModal("serviceModal");
});

/* ---------------------------------------------------------
   7. FEATURES (public)
--------------------------------------------------------- */

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
        const { data, error } = await sb
            .from("features")
            .select("*")
            .eq("status", "published")
            .order("display_order", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
            featuresData = data;
            renderFeatureGrid(data);
        }
    } catch (err) {
        console.error("loadFeatures failed, keeping default cards:", err);
    }
}

function renderFeatureGrid(features) {
    const grid = document.querySelector("#features .feature-grid");
    if (!grid) return;

    grid.innerHTML = features
        .map(
            (feature, index) => `
        <article class="feature-card">
            <div class="feature-number">${String(index + 1).padStart(2, "0")}</div>
            <h3>${escapeHtml(feature.title)}</h3>
            <p>${escapeHtml(feature.description)}</p>
            <button type="button" class="view-button feature-view-button" data-feature="${feature.id}">
                Explore
            </button>
        </article>
    `
        )
        .join("");
}

document.querySelector("#features .feature-grid")?.addEventListener("click", (event) => {
    const button = event.target.closest(".feature-view-button");
    if (!button) return;

    const key = button.dataset.feature;
    const fromDb = featuresData.find((f) => String(f.id) === String(key));

    const title = fromDb ? fromDb.title : button.closest(".feature-card").querySelector("h3").textContent.trim();
    const text = fromDb
        ? fromDb.full_description || fromDb.description
        : fallbackFeatureText[key] || button.closest(".feature-card").querySelector("p").textContent.trim();

    qs("featureModalTitle").textContent = title;
    qs("featureModalText").textContent = text;
    openModal("featureModal");
});

/* ---------------------------------------------------------
   8. BLOG / NEWS (public)
--------------------------------------------------------- */

let publishedContents = [];

async function loadPublicContents() {
    const blogGrid = qs("blogGrid");
    const latestContent = qs("latestContent");

    try {
        const { data, error } = await sb
            .from("contents")
            .select("*")
            .eq("status", "published")
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: false });

        if (error) throw error;

        publishedContents = data || [];
    } catch (err) {
        console.error("loadPublicContents failed:", err);
        publishedContents = [];
    }

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
                ${
                    item.file_url
                        ? `<div class="content-file"><a href="${escapeHtml(item.file_url)}" target="_blank" rel="noopener noreferrer">Open File</a></div>`
                        : ""
                }
                ${!forHome ? shareButtonsMarkup(item.id, shareUrl, item.title) : ""}
            </div>
        </article>
    `;
}

function shareButtonsMarkup(id, url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    return `
        <div class="share-buttons" data-share-url="${escapeHtml(url)}">
            <a class="view-button" target="_blank" rel="noopener noreferrer"
               href="https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}">WhatsApp</a>
            <a class="view-button" target="_blank" rel="noopener noreferrer"
               href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}">Facebook</a>
            <a class="view-button" target="_blank" rel="noopener noreferrer"
               href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}">X</a>
            <button type="button" class="view-button copy-link-button" data-url="${escapeHtml(url)}">Copy Link</button>
        </div>
    `;
}

function renderBlogGrid() {
    const blogGrid = qs("blogGrid");
    if (!blogGrid) return;

    if (publishedContents.length === 0) {
        blogGrid.innerHTML = `<div class="empty-content">No blog content has been published yet.</div>`;
        return;
    }

    blogGrid.innerHTML = publishedContents.map((item) => contentCardMarkup(item, false)).join("");
}

function renderLatestContent() {
    const latestContent = qs("latestContent");
    if (!latestContent) return;

    if (publishedContents.length === 0) {
        latestContent.innerHTML = `<div class="empty-content">No content has been published yet.</div>`;
        return;
    }

    latestContent.innerHTML = publishedContents.slice(0, 3).map((item) => contentCardMarkup(item, true)).join("");
}

document.addEventListener("click", (event) => {
    const shareBtn = event.target.closest(".copy-link-button");
    if (!shareBtn) return;

    const url = shareBtn.dataset.url;
    navigator.clipboard
        .writeText(url)
        .then(() => {
            const original = shareBtn.textContent;
            shareBtn.textContent = "Copied";
            setTimeout(() => (shareBtn.textContent = original), 1500);
        })
        .catch(() => {
            alert("Could not copy the link automatically. Link: " + url);
        });
});

/* ---------------------------------------------------------
   9. LOCAL COMMENTS (kept as-is; not part of the Supabase spec)
--------------------------------------------------------- */

let comments = JSON.parse(localStorage.getItem("danielTechComments")) || [];

const commentForm = qs("commentForm");
const commentsList = qs("commentsList");

function renderComments() {
    if (!commentsList) return;

    if (comments.length === 0) {
        commentsList.innerHTML = `<p class="empty-content">No comments yet.</p>`;
        return;
    }

    commentsList.innerHTML = comments
        .map(
            (comment) => `
        <div class="comment-item">
            <strong>${escapeHtml(comment.name)}</strong>
            <p>${escapeHtml(comment.text)}</p>
        </div>
    `
        )
        .join("");
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

/* ---------------------------------------------------------
   10. CONTACT FORM -> messages table
--------------------------------------------------------- */

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
            const { error } = await sb.from("messages").insert([
                { name, email, subject, message, status: "unread" },
            ]);

            if (error) throw error;

            setStatus(contactStatus, "Your message has been received. We will respond as soon as possible.", false);
            contactForm.reset();
        } catch (err) {
            console.error("contact submit failed:", err);
            setStatus(contactStatus, "Sorry, your message could not be sent. Please try again.", true);
        }
    });
}

/* ---------------------------------------------------------
   11. HOME / ABOUT / FOOTER — public content from site_settings & about_sections
--------------------------------------------------------- */

async function loadSiteSettingsPublic() {
    try {
        const { data, error } = await sb.from("site_settings").select("*");
        if (error) throw error;

        const settings = {};
        (data || []).forEach((row) => (settings[row.setting_key] = row.setting_value));

        if (settings.hero_subtitle) {
            const label = document.querySelector(".hero-label");
            if (label) label.textContent = settings.hero_subtitle;
        }
        if (settings.hero_title) {
            const span = document.querySelector(".hero h1 span");
            if (span) span.textContent = settings.hero_title;
        }
        if (settings.hero_description) {
            const desc = document.querySelector(".hero-description");
            if (desc) desc.textContent = settings.hero_description;
        }

        const footerTextEl = qs("footerText");
        const footerEmailEl = qs("footerEmail");
        const footerPhoneEl = qs("footerPhone");
        const footerAddressEl = qs("footerAddress");

        if (footerTextEl && settings.footer_text) footerTextEl.textContent = settings.footer_text;
        if (footerEmailEl && settings.footer_email) footerEmailEl.textContent = settings.footer_email;
        if (footerPhoneEl && settings.footer_phone) footerPhoneEl.textContent = settings.footer_phone;
        if (footerAddressEl && settings.footer_address) footerAddressEl.textContent = settings.footer_address;
    } catch (err) {
        console.error("loadSiteSettingsPublic failed:", err);
    }
}

async function loadAboutPublic() {
    try {
        const { data, error } = await sb
            .from("about_sections")
            .select("*")
            .eq("status", "published");

        if (error) throw error;

        const main = (data || []).find((s) => s.section_key === "main");
        if (main) {
            const aboutContent = document.querySelector("#aboutModal .modal-content");
            if (aboutContent) {
                const heading = aboutContent.querySelector("h2");
                const paragraphs = aboutContent.querySelectorAll("p");
                if (heading && main.title) heading.textContent = main.title;
                if (paragraphs[0] && main.content) paragraphs[0].textContent = main.content;
            }
        }
    } catch (err) {
        console.error("loadAboutPublic failed:", err);
    }
}

async function loadSocialLinksPublic() {
    const container = qs("footerSocialLinks");
    if (!container) return;

    try {
        const { data, error } = await sb
            .from("social_links")
            .select("*")
            .eq("status", "published")
            .order("display_order", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
            container.innerHTML = data
                .map(
                    (link) =>
                        `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.platform)}</a>`
                )
                .join("");
        }
    } catch (err) {
        console.error("loadSocialLinksPublic failed:", err);
    }
}

/* ---------------------------------------------------------
   12. ADMIN AUTH
--------------------------------------------------------- */

const adminButton = qs("adminButton");
const adminLoginModal = qs("adminLoginModal");
const dashboardModal = qs("dashboardModal");
const adminLoginForm = qs("adminLoginForm");
const loginMessage = qs("loginMessage");

if (adminButton) {
    adminButton.addEventListener("click", () => {
        closeSettingsPanel();
        openModal("adminLoginModal");
    });
}

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

            currentSession = data.session;
            isAdmin = true;

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

    if (error || !data.session) {
        isAdmin = false;
        currentSession = null;
        return false;
    }

    if (data.session.user.id !== ADMIN_UID) {
        isAdmin = false;
        currentSession = null;
        return false;
    }

    currentSession = data.session;
    isAdmin = true;
    return true;
}

async function requireAdmin() {
    const ok = await ensureAdminSession();
    if (!ok) {
        closeModal("dashboardModal");
        isAdmin = false;
        alert("Your admin session has expired. Please log in again.");
        openModal("adminLoginModal");
    }
    return ok;
}

const logoutButton = qs("logoutButton");
if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        try {
            await sb.auth.signOut();
        } catch (err) {
            console.error("logout failed:", err);
        }
        isAdmin = false;
        currentSession = null;
        closeModal("dashboardModal");
    });
}

// Restore session on page load (e.g. after a refresh while logged in).
(async function restoreAdminSession() {
    const ok = await ensureAdminSession();
    if (ok) {
        // Session restored silently; dashboard only opens when admin clicks Admin.
    }
})();

/* ---------------------------------------------------------
   13. ADMIN DASHBOARD — TAB SWITCHING
--------------------------------------------------------- */

const dashboardTabs = document.querySelectorAll(".dashboard-tab");
const dashboardPanels = document.querySelectorAll(".admin-panel");

function showDashboardPanel(panelName) {
    dashboardPanels.forEach((panel) => panel.classList.remove("active-panel"));
    dashboardTabs.forEach((tab) => tab.classList.remove("active"));

    const panel = document.querySelector(`.admin-panel[data-panel="${panelName}"]`);
    const tab = document.querySelector(`.dashboard-tab[data-panel="${panelName}"]`);

    if (panel) panel.classList.add("active-panel");
    if (tab) tab.classList.add("active");
}

dashboardTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        showDashboardPanel(tab.dataset.panel);
    });
});

async function refreshDashboard() {
    if (!(await requireAdmin())) return;

    showDashboardPanel("overview");

    await Promise.all([
        loadDashboardStats(),
        renderAdminContents(),
        renderAdminServices(),
        renderAdminFeatures(),
        renderAdminMessages(),
        loadHomeEditorValues(),
        loadAboutEditorValues(),
        loadFooterEditorValues(),
    ]);
}

/* ---------------------------------------------------------
   14. DASHBOARD — OVERVIEW STATS
--------------------------------------------------------- */

async function loadDashboardStats() {
    try {
        const [servicesCount, featuresCount, contentsCount, publishedCount, messagesCount] = await Promise.all([
            sb.from("services").select("id", { count: "exact", head: true }),
            sb.from("features").select("id", { count: "exact", head: true }),
            sb.from("contents").select("id", { count: "exact", head: true }),
            sb.from("contents").select("id", { count: "exact", head: true }).eq("status", "published"),
            sb.from("messages").select("id", { count: "exact", head: true }),
        ]);

        setText("statServices", servicesCount.count ?? 0);
        setText("statFeatures", featuresCount.count ?? 0);
        setText("statContents", contentsCount.count ?? 0);
        setText("statPublished", publishedCount.count ?? 0);
        setText("statMessages", messagesCount.count ?? 0);
    } catch (err) {
        console.error("loadDashboardStats failed:", err);
    }
}

function setText(id, value) {
    const el = qs(id);
    if (el) el.textContent = value;
}

/* ---------------------------------------------------------
   15. DASHBOARD — NEWS / BLOG (contents table)
--------------------------------------------------------- */

const contentTitle = qs("contentTitle");
const contentCategory = qs("contentCategory");
const contentText = qs("contentText");
const contentFile = qs("contentFile");
const contentFeatured = qs("contentFeatured");
const contentStatusSelect = qs("contentStatusSelect");
const saveContentButton = qs("saveContentButton");
const contentStatus = qs("contentStatus");

let editingContentId = null;

async function uploadFile(file, folder) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await sb.storage.from(STORAGE_BUCKET).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
    });

    if (error) throw error;

    const { data } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
}

if (saveContentButton) {
    saveContentButton.addEventListener("click", async () => {
        if (!(await requireAdmin())) return;

        const title = contentTitle.value.trim();
        const category = contentCategory.value;
        const text = contentText.value.trim();
        const status = contentStatusSelect ? contentStatusSelect.value : "published";
        const featured = contentFeatured ? contentFeatured.checked : false;

        if (!title || !text) {
            alert("Please enter title and content.");
            return;
        }

        setStatus(contentStatus, "Saving...", false);
        saveContentButton.disabled = true;

        try {
            let fileUrl = null;
            const file = contentFile && contentFile.files[0];

            if (file) {
                setStatus(contentStatus, "Uploading file...", false);
                fileUrl = await uploadFile(file, "content");
            }

            const payload = {
                title,
                category,
                content: text,
                description: text.slice(0, 160),
                status,
                featured,
                updated_at: new Date().toISOString(),
            };

            if (fileUrl) {
                payload.file_url = fileUrl;
                if (category === "video") payload.media_url = fileUrl;
                if (category !== "video") payload.thumbnail_url = fileUrl;
            }

            if (status === "published") {
                payload.published_at = new Date().toISOString();
            }

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
        } finally {
            saveContentButton.disabled = false;
        }
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
    if (btn) {
        btn.addEventListener("click", () => {
            resetContentForm();
            if (contentCategory) contentCategory.value = map[id];
            if (contentTitle) contentTitle.focus();
        });
    }
});

async function renderAdminContents() {
    const list = qs("adminContentList");
    if (!list) return;

    try {
        const { data, error } = await sb
            .from("contents")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            list.innerHTML = `<p class="empty-content">No content has been added yet.</p>`;
            return;
        }

        list.innerHTML = data
            .map(
                (item) => `
            <div class="admin-content-item">
                <div>
                    <h4>${escapeHtml(item.title)}</h4>
                    <p>${escapeHtml(item.category)} — ${escapeHtml(item.status)}${item.featured ? " — Featured" : ""}</p>
                </div>
                <div>
                    <button class="view-button edit-content-button" data-id="${item.id}">Edit</button>
                    <button class="view-button toggle-status-button" data-id="${item.id}" data-status="${item.status}">
                        ${item.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button class="delete-content-button" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `
            )
            .join("");

        list.querySelectorAll(".edit-content-button").forEach((btn) => {
            btn.addEventListener("click", () => editContent(Number(btn.dataset.id), data));
        });

        list.querySelectorAll(".toggle-status-button").forEach((btn) => {
            btn.addEventListener("click", () => toggleContentStatus(Number(btn.dataset.id), btn.dataset.status));
        });

        list.querySelectorAll(".delete-content-button").forEach((btn) => {
            btn.addEventListener("click", () => deleteContent(Number(btn.dataset.id)));
        });
    } catch (err) {
        console.error("renderAdminContents failed:", err);
        list.innerHTML = `<p class="empty-content">Could not load content.</p>`;
    }
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
    } catch (err) {
        console.error("toggleContentStatus failed:", err);
        alert("Could not update the content status.");
    }
}

async function deleteContent(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    if (!(await requireAdmin())) return;

    try {
        const { error } = await sb.from("contents").delete().eq("id", id);
        if (error) throw error;
        await Promise.all([renderAdminContents(), loadPublicContents(), loadDashboardStats()]);
    } catch (err) {
        console.error("deleteContent failed:", err);
        alert("Could not delete this item.");
    }
}

/* ---------------------------------------------------------
   16. DASHBOARD — SERVICES CRUD
--------------------------------------------------------- */

const serviceEditorTitle = qs("serviceEditorTitle");
const serviceEditorDescription = qs("serviceEditorDescription");
const serviceEditorFullDescription = qs("serviceEditorFullDescription");
const serviceEditorOrder = qs("serviceEditorOrder");
const serviceEditorStatus = qs("serviceEditorStatus");
const saveServiceButton = qs("saveServiceButton");
const cancelServiceEditButton = qs("cancelServiceEditButton");
const serviceEditorStatusMsg = qs("serviceEditorStatusMsg");

let editingServiceId = null;

if (saveServiceButton) {
    saveServiceButton.addEventListener("click", async () => {
        if (!(await requireAdmin())) return;

        const title = serviceEditorTitle.value.trim();
        const description = serviceEditorDescription.value.trim();

        if (!title || !description) {
            alert("Please enter a title and short description.");
            return;
        }

        const payload = {
            title,
            description,
            full_description: serviceEditorFullDescription.value.trim(),
            display_order: Number(serviceEditorOrder.value) || 0,
            status: serviceEditorStatus.value,
            updated_at: new Date().toISOString(),
        };

        setStatus(serviceEditorStatusMsg, "Saving...", false);

        try {
            if (editingServiceId) {
                const { error } = await sb.from("services").update(payload).eq("id", editingServiceId);
                if (error) throw error;
            } else {
                const { error } = await sb.from("services").insert([payload]);
                if (error) throw error;
            }

            setStatus(serviceEditorStatusMsg, "Service saved.", false);
            resetServiceForm();
            await Promise.all([renderAdminServices(), loadServices(), loadDashboardStats()]);
        } catch (err) {
            console.error("save service failed:", err);
            setStatus(serviceEditorStatusMsg, "Could not save the service.", true);
        }
    });
}

if (cancelServiceEditButton) {
    cancelServiceEditButton.addEventListener("click", resetServiceForm);
}

function resetServiceForm() {
    editingServiceId = null;
    if (serviceEditorTitle) serviceEditorTitle.value = "";
    if (serviceEditorDescription) serviceEditorDescription.value = "";
    if (serviceEditorFullDescription) serviceEditorFullDescription.value = "";
    if (serviceEditorOrder) serviceEditorOrder.value = "0";
    if (serviceEditorStatus) serviceEditorStatus.value = "published";
    if (saveServiceButton) saveServiceButton.textContent = "Add Service";
}

async function renderAdminServices() {
    const list = qs("adminServiceList");
    if (!list) return;

    try {
        const { data, error } = await sb.from("services").select("*").order("display_order", { ascending: true });
        if (error) throw error;

        if (!data || data.length === 0) {
            list.innerHTML = `<p class="empty-content">No services in the database yet. Add one below.</p>`;
            return;
        }

        list.innerHTML = data
            .map(
                (item) => `
            <div class="admin-content-item">
                <div>
                    <h4>${escapeHtml(item.title)}</h4>
                    <p>Order ${item.display_order} — ${escapeHtml(item.status)}</p>
                </div>
                <div>
                    <button class="view-button edit-service-button" data-id="${item.id}">Edit</button>
                    <button class="delete-content-button" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `
            )
            .join("");

        list.querySelectorAll(".edit-service-button").forEach((btn) => {
            btn.addEventListener("click", () => {
                const item = data.find((s) => s.id === Number(btn.dataset.id));
                if (!item) return;
                editingServiceId = item.id;
                serviceEditorTitle.value = item.title || "";
                serviceEditorDescription.value = item.description || "";
                serviceEditorFullDescription.value = item.full_description || "";
                serviceEditorOrder.value = item.display_order || 0;
                serviceEditorStatus.value = item.status || "published";
                saveServiceButton.textContent = "Update Service";
                serviceEditorTitle.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        });

        list.querySelectorAll(".delete-content-button").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (!confirm("Are you sure you want to delete this service?")) return;
                if (!(await requireAdmin())) return;

                try {
                    const { error } = await sb.from("services").delete().eq("id", Number(btn.dataset.id));
                    if (error) throw error;
                    await Promise.all([renderAdminServices(), loadServices(), loadDashboardStats()]);
                } catch (err) {
                    console.error("delete service failed:", err);
                    alert("Could not delete this service.");
                }
            });
        });
    } catch (err) {
        console.error("renderAdminServices failed:", err);
        list.innerHTML = `<p class="empty-content">Could not load services.</p>`;
    }
}

/* ---------------------------------------------------------
   17. DASHBOARD — FEATURES CRUD
--------------------------------------------------------- */

const featureEditorTitle = qs("featureEditorTitle");
const featureEditorDescription = qs("featureEditorDescription");
const featureEditorFullDescription = qs("featureEditorFullDescription");
const featureEditorOrder = qs("featureEditorOrder");
const featureEditorStatus = qs("featureEditorStatus");
const saveFeatureButton = qs("saveFeatureButton");
const cancelFeatureEditButton = qs("cancelFeatureEditButton");
const featureEditorStatusMsg = qs("featureEditorStatusMsg");

let editingFeatureId = null;

if (saveFeatureButton) {
    saveFeatureButton.addEventListener("click", async () => {
        if (!(await requireAdmin())) return;

        const title = featureEditorTitle.value.trim();
        const description = featureEditorDescription.value.trim();

        if (!title || !description) {
            alert("Please enter a title and short description.");
            return;
        }

        const payload = {
            title,
            description,
            full_description: featureEditorFullDescription.value.trim(),
            display_order: Number(featureEditorOrder.value) || 0,
            status: featureEditorStatus.value,
            updated_at: new Date().toISOString(),
        };

        setStatus(featureEditorStatusMsg, "Saving...", false);

        try {
            if (editingFeatureId) {
                const { error } = await sb.from("features").update(payload).eq("id", editingFeatureId);
                if (error) throw error;
            } else {
                const { error } = await sb.from("features").insert([payload]);
                if (error) throw error;
            }

            setStatus(featureEditorStatusMsg, "Feature saved.", false);
            resetFeatureForm();
            await Promise.all([renderAdminFeatures(), loadFeatures(), loadDashboardStats()]);
        } catch (err) {
            console.error("save feature failed:", err);
            setStatus(featureEditorStatusMsg, "Could not save the feature.", true);
        }
    });
}

if (cancelFeatureEditButton) {
    cancelFeatureEditButton.addEventListener("click", resetFeatureForm);
}

function resetFeatureForm() {
    editingFeatureId = null;
    if (featureEditorTitle) featureEditorTitle.value = "";
    if (featureEditorDescription) featureEditorDescription.value = "";
    if (featureEditorFullDescription) featureEditorFullDescription.value = "";
    if (featureEditorOrder) featureEditorOrder.value = "0";
    if (featureEditorStatus) featureEditorStatus.value = "published";
    if (saveFeatureButton) saveFeatureButton.textContent = "Add Feature";
}

async function renderAdminFeatures() {
    const list = qs("adminFeatureList");
    if (!list) return;

    try {
        const { data, error } = await sb.from("features").select("*").order("display_order", { ascending: true });
        if (error) throw error;

        if (!data || data.length === 0) {
            list.innerHTML = `<p class="empty-content">No features in the database yet. Add one below.</p>`;
            return;
        }

        list.innerHTML = data
            .map(
                (item) => `
            <div class="admin-content-item">
                <div>
                    <h4>${escapeHtml(item.title)}</h4>
                    <p>Order ${item.display_order} — ${escapeHtml(item.status)}</p>
                </div>
                <div>
                    <button class="view-button edit-feature-button" data-id="${item.id}">Edit</button>
                    <button class="delete-content-button" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `
            )
            .join("");

        list.querySelectorAll(".edit-feature-button").forEach((btn) => {
            btn.addEventListener("click", () => {
                const item = data.find((f) => f.id === Number(btn.dataset.id));
                if (!item) return;
                editingFeatureId = item.id;
                featureEditorTitle.value = item.title || "";
                featureEditorDescription.value = item.description || "";
                featureEditorFullDescription.value = item.full_description || "";
                featureEditorOrder.value = item.display_order || 0;
                featureEditorStatus.value = item.status || "published";
                saveFeatureButton.textContent = "Update Feature";
                featureEditorTitle.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        });

        list.querySelectorAll(".delete-content-button").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (!confirm("Are you sure you want to delete this feature?")) return;
                if (!(await requireAdmin())) return;

                try {
                    const { error } = await sb.from("features").delete().eq("id", Number(btn.dataset.id));
                    if (error) throw error;
                    await Promise.all([renderAdminFeatures(), loadFeatures(), loadDashboardStats()]);
                } catch (err) {
                    console.error("delete feature failed:", err);
                    alert("Could not delete this feature.");
                }
            });
        });
    } catch (err) {
        console.error("renderAdminFeatures failed:", err);
        list.innerHTML = `<p class="empty-content">Could not load features.</p>`;
    }
}

/* ---------------------------------------------------------
   18. DASHBOARD — MESSAGES
--------------------------------------------------------- */

async function renderAdminMessages() {
    const list = qs("adminMessagesList");
    if (!list) return;

    try {
        const { data, error } = await sb.from("messages").select("*").order("created_at", { ascending: false });
        if (error) throw error;

        if (!data || data.length === 0) {
            list.innerHTML = `<p class="empty-content">No messages yet.</p>`;
            return;
        }

        list.innerHTML = data
            .map(
                (msg) => `
            <div class="admin-message-item">
                <h4>${escapeHtml(msg.subject || "No subject")}</h4>
                <p><strong>From:</strong> ${escapeHtml(msg.name)} (${escapeHtml(msg.email)})</p>
                <p>${escapeHtml(msg.message)}</p>
                <small>${formatDate(msg.created_at)} — ${escapeHtml(msg.status)}</small>
                <div>
                    <button class="view-button toggle-message-status-button" data-id="${msg.id}" data-status="${msg.status}">
                        Mark as ${msg.status === "unread" ? "read" : "unread"}
                    </button>
                    <button class="delete-message-button" data-id="${msg.id}">Delete</button>
                </div>
            </div>
        `
            )
            .join("");

        list.querySelectorAll(".toggle-message-status-button").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (!(await requireAdmin())) return;
                const newStatus = btn.dataset.status === "unread" ? "read" : "unread";
                try {
                    const { error } = await sb
                        .from("messages")
                        .update({ status: newStatus })
                        .eq("id", Number(btn.dataset.id));
                    if (error) throw error;
                    await renderAdminMessages();
                } catch (err) {
                    console.error("toggle message status failed:", err);
                }
            });
        });

        list.querySelectorAll(".delete-message-button").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (!confirm("Are you sure you want to delete this message?")) return;
                if (!(await requireAdmin())) return;

                try {
                    const { error } = await sb.from("messages").delete().eq("id", Number(btn.dataset.id));
                    if (error) throw error;
                    await Promise.all([renderAdminMessages(), loadDashboardStats()]);
                } catch (err) {
                    console.error("delete message failed:", err);
                }
            });
        });
    } catch (err) {
        console.error("renderAdminMessages failed:", err);
        list.innerHTML = `<p class="empty-content">Could not load messages.</p>`;
    }
}

const refreshMessagesButton = qs("refreshMessagesButton");
if (refreshMessagesButton) {
    refreshMessagesButton.addEventListener("click", renderAdminMessages);
}

/* ---------------------------------------------------------
   19. DASHBOARD — HOME PAGE EDITOR (site_settings)
--------------------------------------------------------- */

const homeEditorFields = {
    hero_title: "homeHeroTitle",
    hero_subtitle: "homeHeroSubtitle",
    hero_description: "homeHeroDescription",
    hero_button_text: "homeHeroButtonText",
    hero_button_link: "homeHeroButtonLink",
    welcome_title: "homeWelcomeTitle",
    welcome_text: "homeWelcomeText",
    cta_title: "homeCtaTitle",
    cta_text: "homeCtaText",
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
    } catch (err) {
        console.error("loadHomeEditorValues failed:", err);
    }
}

const saveHomeButton = qs("saveHomeButton");
const homeEditorStatus = qs("homeEditorStatus");

if (saveHomeButton) {
    saveHomeButton.addEventListener("click", async () => {
        if (!(await requireAdmin())) return;

        setStatus(homeEditorStatus, "Saving...", false);

        try {
            const rows = Object.entries(homeEditorFields).map(([key, fieldId]) => ({
                setting_key: key,
                setting_value: qs(fieldId) ? qs(fieldId).value : "",
                updated_at: new Date().toISOString(),
            }));

            const { error } = await sb.from("site_settings").upsert(rows, { onConflict: "setting_key" });
            if (error) throw error;

            setStatus(homeEditorStatus, "Home page updated.", false);
            await loadSiteSettingsPublic();
        } catch (err) {
            console.error("save home settings failed:", err);
            setStatus(homeEditorStatus, "Could not save changes.", true);
        }
    });
}

/* ---------------------------------------------------------
   20. DASHBOARD — ABOUT EDITOR
--------------------------------------------------------- */

async function loadAboutEditorValues() {
    try {
        const { data, error } = await sb.from("about_sections").select("*");
        if (error) throw error;

        const main = (data || []).find((s) => s.section_key === "main");
        const mission = (data || []).find((s) => s.section_key === "mission");
        const vision = (data || []).find((s) => s.section_key === "vision");

        if (main && qs("aboutTitle")) qs("aboutTitle").value = main.title || "";
        if (main && qs("aboutDescription")) qs("aboutDescription").value = main.content || "";
        if (mission && qs("aboutMission")) qs("aboutMission").value = mission.content || "";
        if (vision && qs("aboutVision")) qs("aboutVision").value = vision.content || "";
    } catch (err) {
        console.error("loadAboutEditorValues failed:", err);
    }
}

const saveAboutButton = qs("saveAboutButton");
const aboutEditorStatus = qs("aboutEditorStatus");

if (saveAboutButton) {
    saveAboutButton.addEventListener("click", async () => {
        if (!(await requireAdmin())) return;

        setStatus(aboutEditorStatus, "Saving...", false);

        try {
            const rows = [
                {
                    section_key: "main",
                    title: qs("aboutTitle").value.trim(),
                    content: qs("aboutDescription").value.trim(),
                    updated_at: new Date().toISOString(),
                },
                {
                    section_key: "mission",
                    title: "Mission",
                    content: qs("aboutMission").value.trim(),
                    updated_at: new Date().toISOString(),
                },
                {
                    section_key: "vision",
                    title: "Vision",
                    content: qs("aboutVision").value.trim(),
                    updated_at: new Date().toISOString(),
                },
            ];

            const { error } = await sb.from("about_sections").upsert(rows, { onConflict: "section_key" });
            if (error) throw error;

            setStatus(aboutEditorStatus, "About section updated.", false);
            await loadAboutPublic();
        } catch (err) {
            console.error("save about failed:", err);
            setStatus(aboutEditorStatus, "Could not save changes.", true);
        }
    });
}

/* ---------------------------------------------------------
   21. DASHBOARD — FOOTER EDITOR
--------------------------------------------------------- */

async function loadFooterEditorValues() {
    try {
        const { data, error } = await sb.from("site_settings").select("*");
        if (error) throw error;

        const settings = {};
        (data || []).forEach((row) => (settings[row.setting_key] = row.setting_value));

        if (qs("footerTextInput")) qs("footerTextInput").value = settings.footer_text || "";
        if (qs("footerEmailInput")) qs("footerEmailInput").value = settings.footer_email || "";
        if (qs("footerPhoneInput")) qs("footerPhoneInput").value = settings.footer_phone || "";
        if (qs("footerAddressInput")) qs("footerAddressInput").value = settings.footer_address || "";
    } catch (err) {
        console.error("loadFooterEditorValues failed:", err);
    }
}

const saveFooterButton = qs("saveFooterButton");
const footerEditorStatus = qs("footerEditorStatus");

if (saveFooterButton) {
    saveFooterButton.addEventListener("click", async () => {
        if (!(await requireAdmin())) return;

        setStatus(footerEditorStatus, "Saving...", false);

        try {
            const rows = [
                { setting_key: "footer_text", setting_value: qs("footerTextInput").value.trim() },
                { setting_key: "footer_email", setting_value: qs("footerEmailInput").value.trim() },
                { setting_key: "footer_phone", setting_value: qs("footerPhoneInput").value.trim() },
                { setting_key: "footer_address", setting_value: qs("footerAddressInput").value.trim() },
            ].map((row) => ({ ...row, updated_at: new Date().toISOString() }));

            const { error } = await sb.from("site_settings").upsert(rows, { onConflict: "setting_key" });
            if (error) throw error;

            setStatus(footerEditorStatus, "Footer updated.", false);
            await loadSiteSettingsPublic();
        } catch (err) {
            console.error("save footer failed:", err);
            setStatus(footerEditorStatus, "Could not save changes.", true);
        }
    });
}

/* ---------------------------------------------------------
   22. BACK TO TOP
--------------------------------------------------------- */

const backTop = qs("backTop");

if (backTop) {
    window.addEventListener("scroll", () => {
        backTop.classList.toggle("show", window.scrollY > 400);
    });

    backTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ---------------------------------------------------------
   23. INIT
--------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    showPage("home");
    loadServices();
    loadFeatures();
    loadPublicContents();
    loadSiteSettingsPublic();
    loadAboutPublic();
    loadSocialLinksPublic();
});
