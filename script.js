/* =========================================================
   DANIEL TECH - COMPLETE SCRIPT
   Compatible with current index.html + style.css
========================================================= */

const SUPABASE_URL = "https://bodprzntcloioncwhpvr.supabase.co";
const SUPABASE_KEY = "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";
const ADMIN_UID = "05fef3eb-16a3-4554-9d9b-de7d2b29144b";
const STORAGE_BUCKET = "daniel-files";

const state = {
    session: null,
    contents: [],
    services: [],
    features: [],
    editingId: null,
    editingType: null
};


/* =========================================================
   BASIC HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function show(element) {
    if (element) element.classList.add("active");
}

function hide(element) {
    if (element) element.classList.remove("active");
}

function escapeHTML(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(date) {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return "";

    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function getSessionToken() {
    return state.session?.access_token || "";
}

function getHeaders(requireAuth = false) {
    const headers = {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json"
    };

    const token = getSessionToken();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    } else if (requireAuth) {
        throw new Error("Admin session is missing.");
    }

    return headers;
}


/* =========================================================
   NAVIGATION
========================================================= */

function navigateTo(pageName) {
    const pages = $$(".page");

    pages.forEach((page) => {
        page.classList.remove("active-page");
    });

    const target = document.getElementById(pageName);

    if (target) {
        target.classList.add("active-page");
    }

    $$(".main-nav a").forEach((link) => {
        link.classList.remove("active");
    });

    const activeLink = document.querySelector(
        `.main-nav a[data-page="${pageName}"]`
    );

    if (activeLink) {
        activeLink.classList.add("active");
    }

    const nav = $("#mainNav");

    if (nav) {
        nav.classList.remove("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   NAVIGATION BUTTONS
========================================================= */

document.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page]");

    if (!pageButton) return;

    const pageName = pageButton.getAttribute("data-page");

    if (!pageName) return;

    event.preventDefault();

    navigateTo(pageName);
});


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {
    const menuButton = $("#menuButton");
    const nav = $("#mainNav");

    if (!menuButton || !nav) return;

    menuButton.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}


/* =========================================================
   DARK MODE
========================================================= */

function applyDarkMode(enabled) {
    document.body.classList.toggle("dark-mode", enabled);

    localStorage.setItem(
        "danielTechDarkMode",
        enabled ? "true" : "false"
    );

    const settingsCheckbox = $("#settingsDarkMode");

    if (settingsCheckbox) {
        settingsCheckbox.checked = enabled;
    }
}

function restoreDarkMode() {
    const saved = localStorage.getItem("danielTechDarkMode");

    applyDarkMode(saved === "true");
}

function setupDarkMode() {
    const darkModeButton = $("#darkModeButton");
    const settingsDarkMode = $("#settingsDarkMode");

    if (darkModeButton) {
        darkModeButton.addEventListener("click", () => {
            applyDarkMode(!document.body.classList.contains("dark-mode"));
        });
    }

    if (settingsDarkMode) {
        settingsDarkMode.addEventListener("change", () => {
            applyDarkMode(settingsDarkMode.checked);
        });
    }
}


/* =========================================================
   SETTINGS
========================================================= */

function openSettings() {
    const panel = $("#settingsPanel");
    const overlay = $("#overlay");

    show(panel);
    show(overlay);
}

function closeSettings() {
    const panel = $("#settingsPanel");
    const overlay = $("#overlay");

    hide(panel);
    hide(overlay);
}

function setupSettings() {
    const settingsButton = $("#settingsButton");
    const closeButton = $("#closeSettings");
    const overlay = $("#overlay");

    if (settingsButton) {
        settingsButton.addEventListener("click", openSettings);
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeSettings);
    }

    if (overlay) {
        overlay.addEventListener("click", closeSettings);
    }
}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {
    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("active");

    const anyModalOpen = document.querySelector(".modal.active");

    if (!anyModalOpen) {
        document.body.style.overflow = "";
    }
}

function setupModalClose() {
    $$("[data-close-modal]").forEach((button) => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");

            closeModal(modal);
        });
    });

    $$(".modal").forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;

        $$(".modal.active").forEach((modal) => {
            closeModal(modal);
        });

        closeSettings();
    });
}


/* =========================================================
   ABOUT
========================================================= */

function setupAbout() {
    const aboutButton = $("#aboutButton");

    if (!aboutButton) return;

    aboutButton.addEventListener("click", () => {
        closeSettings();
        openModal("aboutModal");
    });
}


/* =========================================================
   FALLBACK SERVICES
========================================================= */

const defaultServices = {
    web: {
        title: "Web Development",
        description:
            "Modern, responsive and professional websites for businesses, organizations, students and personal projects."
    },

    graphics: {
        title: "Graphics Design",
        description:
            "Professional digital designs for logos, posters, social media graphics, banners and other creative projects."
    },

    security: {
        title: "Cyber Security",
        description:
            "Technology security awareness, digital safety guidance and basic cybersecurity solutions."
    },

    computer: {
        title: "Computer Services",
        description:
            "Computer setup, software installation, troubleshooting, maintenance and general ICT support."
    },

    software: {
        title: "Software Solutions",
        description:
            "Useful software solutions and digital tools designed to make everyday work easier and more productive."
    },

    ai: {
        title: "AI Solutions",
        description:
            "Practical artificial intelligence tools and solutions for learning, productivity, business and digital projects."
    }
};


/* =========================================================
   FALLBACK FEATURES
========================================================= */

const defaultFeatures = {
    "computer-tips": {
        title: "Computer Tips",
        description:
            "Learn useful computer tricks, maintenance tips, shortcuts and productivity techniques."
    },

    "phone-tips": {
        title: "Phone Tips",
        description:
            "Discover useful smartphone settings, troubleshooting methods and practical phone tips."
    },

    "ai-tools": {
        title: "AI Tools",
        description:
            "Discover useful artificial intelligence tools and learn how they can improve productivity and learning."
    },

    gaming: {
        title: "Gaming",
        description:
            "Gaming tips, software information, performance improvements and useful gaming guides."
    },

    programming: {
        title: "Programming",
        description:
            "Programming concepts, coding tutorials, development resources and practical programming knowledge."
    },

    "software-tips": {
        title: "Software Tips",
        description:
            "Guides for installing, configuring and using useful computer software."
    }
};


/* =========================================================
   SERVICE MODAL
========================================================= */

function getService(key) {
    const dbService = state.services.find(
        (item) => item.icon === key
    );

    if (dbService) {
        return {
            title: dbService.title,
            description: dbService.description
        };
    }

    return defaultServices[key];
}

function openService(key) {
    const service = getService(key);

    if (!service) return;

    const title = $("#serviceModalTitle");
    const text = $("#serviceModalText");

    if (title) {
        title.textContent = service.title;
    }

    if (text) {
        text.textContent = service.description;
    }

    openModal("serviceModal");
}

function setupServiceButtons() {
    document.addEventListener("click", (event) => {
        const button = event.target.closest(".service-view-button");

        if (!button) return;

        event.preventDefault();

        const key = button.getAttribute("data-service");

        openService(key);
    });
}


/* =========================================================
   FEATURE MODAL
========================================================= */

function getFeature(key) {
    const dbFeature = state.features.find(
        (item) => item.icon === key
    );

    if (dbFeature) {
        return {
            title: dbFeature.title,
            description: dbFeature.description
        };
    }

    return defaultFeatures[key];
}

function openFeature(key) {
    const feature = getFeature(key);

    if (!feature) return;

    const title = $("#featureModalTitle");
    const text = $("#featureModalText");

    if (title) {
        title.textContent = feature.title;
    }

    if (text) {
        text.textContent = feature.description;
    }

    openModal("featureModal");
}

function setupFeatureButtons() {
    document.addEventListener("click", (event) => {
        const button = event.target.closest(".feature-view-button");

        if (!button) return;

        event.preventDefault();

        const key = button.getAttribute("data-feature");

        openFeature(key);
    });
}


/* =========================================================
   SUPABASE REQUEST HELPER
========================================================= */

async function supabaseFetch(path, options = {}, requireAuth = false) {
    const headers = {
        ...getHeaders(requireAuth),
        ...(options.headers || {})
    };

    const response = await fetch(
        `${SUPABASE_URL}${path}`,
        {
            ...options,
            headers
        }
    );

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const message =
            data?.message ||
            data?.error_description ||
            data?.error ||
            `Request failed with status ${response.status}`;

        throw new Error(message);
    }

    return data;
}


/* =========================================================
   SERVICES FROM SUPABASE
========================================================= */

async function loadServices() {
    try {
        const data = await supabaseFetch(
            "/rest/v1/services?select=*&order=display_order.asc,created_at.asc"
        );

        state.services = Array.isArray(data) ? data : [];

        renderPublicServices();
        renderServiceAdminList();

    } catch (error) {
        console.warn("Services could not be loaded:", error.message);

        state.services = [];

        renderPublicServices();
        renderServiceAdminList(
            "Services table is not available yet. The default services are still displayed."
        );
    }
}


/* =========================================================
   FEATURES FROM SUPABASE
========================================================= */

async function loadFeatures() {
    try {
        const data = await supabaseFetch(
            "/rest/v1/features?select=*&order=display_order.asc,created_at.asc"
        );

        state.features = Array.isArray(data) ? data : [];

        renderPublicFeatures();
        renderFeatureAdminList();

    } catch (error) {
        console.warn("Features could not be loaded:", error.message);

        state.features = [];

        renderPublicFeatures();
        renderFeatureAdminList(
            "Features table is not available yet. The default features are still displayed."
        );
    }
}


/* =========================================================
   PUBLIC SERVICES RENDER
========================================================= */

function renderPublicServices() {
    const grid = $(".service-grid");

    if (!grid) return;

    if (!state.services.length) {
        return;
    }

    const services = [...state.services].sort(
        (a, b) =>
            Number(a.display_order || 0) -
            Number(b.display_order || 0)
    );

    grid.innerHTML = services.map((service, index) => {
        const icon = service.icon || `service-${service.id}`;

        return `
            <article class="service-card">
                <div class="card-number">${index + 1}</div>

                <h3>${escapeHTML(service.title)}</h3>

                <p>
                    ${escapeHTML(service.description)}
                </p>

                <button
                    type="button"
                    class="view-button service-view-button"
                    data-service="${escapeHTML(icon)}"
                >
                    View Service
                </button>
            </article>
        `;
    }).join("");
}


/* =========================================================
   PUBLIC FEATURES RENDER
========================================================= */

function renderPublicFeatures() {
    const grid = $(".feature-grid");

    if (!grid) return;

    if (!state.features.length) {
        return;
    }

    const features = [...state.features].sort(
        (a, b) =>
            Number(a.display_order || 0) -
            Number(b.display_order || 0)
    );

    grid.innerHTML = features.map((feature, index) => {
        const icon = feature.icon || `feature-${feature.id}`;

        return `
            <article class="feature-card">
                <div class="feature-number">${index + 1}</div>

                <h3>${escapeHTML(feature.title)}</h3>

                <p>
                    ${escapeHTML(feature.description)}
                </p>

                <button
                    type="button"
                    class="view-button feature-view-button"
                    data-feature="${escapeHTML(icon)}"
                >
                    Explore
                </button>
            </article>
        `;
    }).join("");
}


/* =========================================================
   CONTENT
========================================================= */

async function loadContents() {
    try {
        const data = await supabaseFetch(
            "/rest/v1/contents?select=*&order=created_at.desc"
        );

        state.contents = Array.isArray(data) ? data : [];

        renderLatestContent();
        renderBlog();
        updateNewsBar();

    } catch (error) {
        console.warn("Content could not be loaded:", error.message);

        state.contents = [];

        renderLatestContent();
        renderBlog();
        updateNewsBar();
    }
}


/* =========================================================
   MEDIA
========================================================= */

function createMedia(content) {
    const url =
        content.file_url ||
        content.media_url ||
        content.url ||
        "";

    if (!url) return "";

    const category = String(
        content.category || ""
    ).toLowerCase();

    const lowerUrl = url.toLowerCase();

    const isImage =
        /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/.test(lowerUrl) ||
        category === "image";

    const isVideo =
        /\.(mp4|webm|ogg|mov)(\?.*)?$/.test(lowerUrl) ||
        category === "video";

    const isAudio =
        /\.(mp3|wav|m4a|aac|ogg)(\?.*)?$/.test(lowerUrl) ||
        category === "audio";

    if (isImage) {
        return `
            <div class="blog-card-media">
                <img
                    src="${escapeHTML(url)}"
                    alt="${escapeHTML(content.title || "Daniel Tech")}"
                    loading="lazy"
                >
            </div>
        `;
    }

    if (isVideo) {
        return `
            <div class="blog-card-media">
                <video controls preload="metadata">
                    <source src="${escapeHTML(url)}">
                    Your browser does not support video playback.
                </video>
            </div>
        `;
    }

    if (isAudio) {
        return `
            <div class="blog-card-media">
                <audio controls>
                    <source src="${escapeHTML(url)}">
                    Your browser does not support audio playback.
                </audio>
            </div>
        `;
    }

    return `
        <div class="content-file">
            <a
                href="${escapeHTML(url)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Open File
            </a>
        </div>
    `;
}


/* =========================================================
   CONTENT TEXT
========================================================= */

function getContentText(content) {
    return (
        content.content ||
        content.description ||
        content.text ||
        ""
    );
}


/* =========================================================
   LATEST CONTENT
========================================================= */

function renderLatestContent() {
    const container = $("#latestContent");

    if (!container) return;

    const latest = state.contents.slice(0, 3);

    if (!latest.length) {
        container.innerHTML = `
            <div class="empty-content">
                No content has been published yet.
            </div>
        `;

        return;
    }

    container.innerHTML = latest.map((content) => {
        const text = getContentText(content);

        return `
            <article class="content-card">

                ${createMedia(content)}

                <span class="blog-category">
                    ${escapeHTML(content.category || "News")}
                </span>

                <h3>
                    ${escapeHTML(content.title || "Daniel Tech")}
                </h3>

                <p>
                    ${escapeHTML(text)}
                </p>

                <span class="blog-date">
                    ${formatDate(content.created_at)}
                </span>

            </article>
        `;
    }).join("");
}


/* =========================================================
   BLOG
========================================================= */

function renderBlog() {
    const container = $("#blogGrid");

    if (!container) return;

    if (!state.contents.length) {
        container.innerHTML = `
            <div class="empty-content">
                No news or articles have been published yet.
            </div>
        `;

        return;
    }

    container.innerHTML = state.contents.map((content) => {
        const text = getContentText(content);

        return `
            <article class="blog-card">

                ${createMedia(content)}

                <div class="blog-card-body">

                    <span class="blog-category">
                        ${escapeHTML(content.category || "News")}
                    </span>

                    <h3>
                        ${escapeHTML(content.title || "Daniel Tech")}
                    </h3>

                    <p>
                        ${escapeHTML(text)}
                    </p>

                    <span class="blog-date">
                        ${formatDate(content.created_at)}
                    </span>

                </div>

            </article>
        `;
    }).join("");
}


/* =========================================================
   NEWS BAR
========================================================= */

function updateNewsBar() {
    const newsContent = $("#newsContent");

    if (!newsContent) return;

    const news = state.contents.filter((item) => {
        const category = String(
            item.category || ""
        ).toLowerCase();

        return category === "news";
    });

    const source = news.length
        ? news
        : state.contents;

    if (!source.length) {
        newsContent.textContent =
            "Welcome to Daniel Tech. Technology, ICT, programming and digital solutions.";
        return;
    }

    newsContent.textContent = source
        .slice(0, 6)
        .map((item) => item.title)
        .filter(Boolean)
        .join("   |   ");
}


/* =========================================================
   COMMENTS
========================================================= */

function loadComments() {
    const list = $("#commentsList");

    if (!list) return;

    let comments = [];

    try {
        comments = JSON.parse(
            localStorage.getItem("danielTechComments") || "[]"
        );
    } catch {
        comments = [];
    }

    if (!comments.length) {
        list.innerHTML = `
            <div class="empty-content">
                No comments yet.
            </div>
        `;

        return;
    }

    list.innerHTML = comments.map((comment) => {
        return `
            <div class="comment-item">
                <strong>
                    ${escapeHTML(comment.name)}
                </strong>

                <p>
                    ${escapeHTML(comment.text)}
                </p>
            </div>
        `;
    }).join("");
}

function setupComments() {
    const form = $("#commentForm");

    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = $("#commentName")?.value.trim();
        const text = $("#commentText")?.value.trim();

        if (!name || !text) {
            alert("Please enter your name and comment.");
            return;
        }

        let comments = [];

        try {
            comments = JSON.parse(
                localStorage.getItem("danielTechComments") || "[]"
            );
        } catch {
            comments = [];
        }

        comments.unshift({
            name,
            text,
            created_at: new Date().toISOString()
        });

        localStorage.setItem(
            "danielTechComments",
            JSON.stringify(comments)
        );

        form.reset();

        loadComments();
    });
}


/* =========================================================
   CONTACT FORM
========================================================= */

function setupContactForm() {
    const form = $("#contactForm");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = $("#contactName")?.value.trim() || "";
        const email = $("#contactEmail")?.value.trim() || "";
        const subject = $("#contactSubject")?.value.trim() || "";
        const message = $("#contactMessage")?.value.trim() || "";
        const status = $("#contactStatus");

        if (!name || !email || !message) {
            if (status) {
                status.textContent =
                    "Please fill in all required fields.";
            }

            return;
        }

        if (status) {
            status.textContent = "Sending message...";
        }

        try {
            await supabaseFetch(
                "/rest/v1/message",
                {
                    method: "POST",
                    headers: {
                        Prefer: "return=minimal"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        subject,
                        message
                    })
                }
            );

            form.reset();

            if (status) {
                status.textContent =
                    "Your message has been sent successfully.";
            }

        } catch (error) {
            console.error(error);

            if (status) {
                status.textContent =
                    "Message could not be sent. Please try again.";
            }
        }
    });
}


/* =========================================================
   ADMIN AUTH
========================================================= */

function isAdmin() {
    return Boolean(
        state.session?.user?.id &&
        state.session.user.id === ADMIN_UID
    );
}


/* =========================================================
   REFRESH ADMIN SESSION
========================================================= */

async function refreshAdminSession() {
    if (!state.session?.refresh_token) {
        return false;
    }

    try {
        const response = await fetch(
            `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
            {
                method: "POST",
                headers: {
                    apikey: SUPABASE_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refresh_token: state.session.refresh_token
                })
            }
        );

        const data = await response.json();

        if (
            !response.ok ||
            !data.access_token ||
            !data.user
        ) {
            state.session = null;

            localStorage.removeItem("danielTechSession");

            return false;
        }

        state.session = {
            access_token: data.access_token,
            refresh_token:
                data.refresh_token ||
                state.session.refresh_token,
            user: data.user
        };

        localStorage.setItem(
            "danielTechSession",
            JSON.stringify(state.session)
        );

        return true;

    } catch (error) {
        console.error(
            "Session refresh failed:",
            error
        );

        return false;
    }
}


/* =========================================================
   RESTORE SESSION
========================================================= */

async function restoreAdminSession() {
    const saved =
        localStorage.getItem("danielTechSession");

    if (!saved) return;

    try {
        state.session = JSON.parse(saved);

        if (!state.session?.refresh_token) {
            state.session = null;
            localStorage.removeItem("danielTechSession");
            return;
        }

        await refreshAdminSession();

    } catch (error) {
        console.error(error);

        state.session = null;

        localStorage.removeItem("danielTechSession");
    }
}


/* =========================================================
   ADMIN LOGIN MODAL
========================================================= */

function setupAdminButton() {
    const adminButton = $("#adminButton");

    if (!adminButton) return;

    adminButton.addEventListener("click", () => {
        closeSettings();

        if (isAdmin()) {
            openDashboard();
        } else {
            openModal("adminLoginModal");
        }
    });
}


/* =========================================================
   LOGIN
========================================================= */

function setupAdminLogin() {
    const form = $("#adminLoginForm");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username =
            $("#adminUsername")?.value.trim() || "";

        const password =
            $("#adminPassword")?.value || "";

        const loginMessage =
            $("#loginMessage");

        if (!username || !password) {
            if (loginMessage) {
                loginMessage.textContent =
                    "Enter username/email and password.";
            }

            return;
        }

        if (loginMessage) {
            loginMessage.textContent =
                "Signing in...";
        }

        try {
            const response = await fetch(
                `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
                {
                    method: "POST",
                    headers: {
                        apikey: SUPABASE_KEY,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error_description ||
                    data?.message ||
                    "Login failed."
                );
            }

            if (!data.user?.id) {
                throw new Error(
                    "User information was not returned."
                );
            }

            if (data.user.id !== ADMIN_UID) {
                throw new Error(
                    "This account is not authorized as Daniel Tech admin."
                );
            }

            state.session = {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                user: data.user
            };

            localStorage.setItem(
                "danielTechSession",
                JSON.stringify(state.session)
            );

            form.reset();

            closeModal($("#adminLoginModal"));

            openDashboard();

        } catch (error) {
            console.error(error);

            if (loginMessage) {
                loginMessage.textContent =
                    error.message ||
                    "Login failed.";
            }
        }
    });
}


/* =========================================================
   DASHBOARD
========================================================= */

function openDashboard() {
    if (!isAdmin()) {
        openModal("adminLoginModal");
        return;
    }

    closeModal($("#adminLoginModal"));

    openModal("dashboardModal");

    renderAdminContent();
    renderServiceAdminList();
    renderFeatureAdminList();

    loadAdminMessages();
}

function setupDashboardButton() {
    const button = $("#adminButton");

    if (!button) return;

    button.addEventListener("dblclick", () => {
        if (isAdmin()) {
            openDashboard();
        }
    });
}


/* =========================================================
   CONTENT EDITOR
========================================================= */

function setupContentButtons() {
    const addNews = $("#addNewsButton");
    const addTip = $("#addTipButton");
    const addVideo = $("#addVideoButton");
    const addPdf = $("#addPdfButton");

    if (addNews) {
        addNews.addEventListener("click", () => {
            prepareEditor("news");
        });
    }

    if (addTip) {
        addTip.addEventListener("click", () => {
            prepareEditor("tip");
        });
    }

    if (addVideo) {
        addVideo.addEventListener("click", () => {
            prepareEditor("video");
        });
    }

    if (addPdf) {
        addPdf.addEventListener("click", () => {
            prepareEditor("pdf");
        });
    }
}

function prepareEditor(category = "news", content = null) {
    const editor = $("#adminEditor");

    const title = $("#contentTitle");
    const categoryInput = $("#contentCategory");
    const text = $("#contentText");
    const file = $("#contentFile");
    const button = $("#saveContentButton");
    const status = $("#contentStatus");

    state.editingId = content?.id || null;

    if (title) {
        title.value = content?.title || "";
    }

    if (categoryInput) {
        categoryInput.value =
            content?.category ||
            category;
    }

    if (text) {
        text.value =
            getContentText(content || {});
    }

    if (file) {
        file.value = "";
    }

    if (button) {
        button.textContent =
            content
                ? "Update Content"
                : "Publish Content";
    }

    if (status) {
        status.textContent = "";
    }

    if (editor) {
        editor.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =========================================================
   FILE UPLOAD
========================================================= */

async function uploadFile(file) {
    if (!file) return "";

    if (!state.session) {
        throw new Error(
            "Admin session is not available."
        );
    }

    const valid = await refreshAdminSession();

    if (!valid) {
        throw new Error(
            "Admin session expired. Please login again."
        );
    }

    const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "_");

    const path =
        `${Date.now()}-${safeName}`;

    const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`,
        {
            method: "POST",
            headers: {
                apikey: SUPABASE_KEY,
                Authorization:
                    `Bearer ${state.session.access_token}`,
                "Content-Type":
                    file.type || "application/octet-stream",
                "x-upsert": "true"
            },
            body: file
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            "File upload failed."
        );
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}


/* =========================================================
   SAVE CONTENT
========================================================= */

function setupSaveContent() {
    const button = $("#saveContentButton");

    if (!button) return;

    button.addEventListener("click", saveContent);
}

async function saveContent() {
    if (!isAdmin()) {
        alert("Please login as admin first.");
        return;
    }

    const title =
        $("#contentTitle")?.value.trim() || "";

    const category =
        $("#contentCategory")?.value.trim() ||
        "news";

    const contentText =
        $("#contentText")?.value.trim() || "";

    const file =
        $("#contentFile")?.files?.[0] || null;

    const status =
        $("#contentStatus");

    if (!title || !contentText) {
        if (status) {
            status.textContent =
                "Title and content are required.";
        }

        return;
    }

    if (status) {
        status.textContent =
            "Saving content...";
    }

    try {
        const valid = await refreshAdminSession();

        if (!valid) {
            throw new Error(
                "Admin session expired. Please login again."
            );
        }

        let fileUrl = "";

        if (file) {
            if (status) {
                status.textContent =
                    "Uploading file...";
            }

            fileUrl = await uploadFile(file);
        }

        const payload = {
            title,
            category,
            content: contentText
        };

        if (fileUrl) {
            payload.file_url = fileUrl;
        }

        if (state.editingId) {
            await supabaseFetch(
                `/rest/v1/contents?id=eq.${encodeURIComponent(
                    state.editingId
                )}`,
                {
                    method: "PATCH",
                    headers: {
                        Prefer: "return=minimal"
                    },
                    body: JSON.stringify(payload)
                },
                true
            );
        } else {
            await supabaseFetch(
                "/rest/v1/contents",
                {
                    method: "POST",
                    headers: {
                        Prefer: "return=minimal"
                    },
                    body: JSON.stringify(payload)
                },
                true
            );
        }

        state.editingId = null;

        if (status) {
            status.textContent =
                "Content saved successfully.";
        }

        $("#contentTitle").value = "";
        $("#contentText").value = "";
        $("#contentFile").value = "";

        await loadContents();
        renderAdminContent();

    } catch (error) {
        console.error(error);

        if (status) {
            status.textContent =
                error.message ||
                "Could not save content.";
        }
    }
}


/* =========================================================
   ADMIN CONTENT LIST
========================================================= */

function renderAdminContent() {
    const container = $("#adminContentList");

    if (!container) return;

    if (!isAdmin()) {
        container.innerHTML = `
            <div class="empty-content">
                Admin login required.
            </div>
        `;

        return;
    }

    if (!state.contents.length) {
        container.innerHTML = `
            <div class="empty-content">
                No published content yet.
            </div>
        `;

        return;
    }

    container.innerHTML = state.contents.map((content) => {
        return `
            <div
                class="admin-content-item"
                data-content-id="${escapeHTML(content.id)}"
            >

                <div>
                    <h4>
                        ${escapeHTML(content.title)}
                    </h4>

                    <p>
                        ${escapeHTML(
                            content.category || "News"
                        )}
                        |
                        ${formatDate(content.created_at)}
                    </p>
                </div>

                <div style="display:flex;gap:8px;flex-wrap:wrap;">

                    <button
                        type="button"
                        class="dashboard-button edit-content-button"
                        data-id="${escapeHTML(content.id)}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-content-button"
                        data-id="${escapeHTML(content.id)}"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;
    }).join("");
}


/* =========================================================
   CONTENT EDIT / DELETE
========================================================= */

function setupContentManagement() {
    document.addEventListener("click", async (event) => {

        const editButton =
            event.target.closest(".edit-content-button");

        if (editButton) {
            const id =
                editButton.getAttribute("data-id");

            const content =
                state.contents.find(
                    (item) =>
                        String(item.id) === String(id)
                );

            if (content) {
                prepareEditor(
                    content.category || "news",
                    content
                );
            }

            return;
        }

        const deleteButton =
            event.target.closest(".delete-content-button");

        if (!deleteButton) return;

        const id =
            deleteButton.getAttribute("data-id");

        if (!isAdmin()) {
            alert("Admin login required.");
            return;
        }

        const confirmed =
            confirm(
                "Are you sure you want to delete this content?"
            );

        if (!confirmed) return;

        try {
            await refreshAdminSession();

            await supabaseFetch(
                `/rest/v1/contents?id=eq.${encodeURIComponent(id)}`,
                {
                    method: "DELETE",
                    headers: {
                        Prefer: "return=minimal"
                    }
                },
                true
            );

            await loadContents();
            renderAdminContent();

        } catch (error) {
            console.error(error);

            alert(
                error.message ||
                "Could not delete content."
            );
        }
    });
}


/* =========================================================
   SERVICE ADMIN PANEL
========================================================= */

function renderServiceAdminList(message = "") {
    const container =
        document.getElementById("serviceAdminList");

    if (!container) return;

    if (message) {
        container.innerHTML = `
            <div class="empty-content">
                ${escapeHTML(message)}
            </div>
        `;

        return;
    }

    if (!state.services.length) {
        container.innerHTML = `
            <div class="empty-content">
                No database services found.
            </div>
        `;

        return;
    }

    container.innerHTML = state.services.map((service) => {
        return `
            <div class="admin-content-item">

                <div>
                    <h4>
                        ${escapeHTML(service.title)}
                    </h4>

                    <p>
                        ${escapeHTML(service.description)}
                    </p>
                </div>

                <div style="display:flex;gap:8px;">

                    <button
                        type="button"
                        class="dashboard-button edit-service-button"
                        data-id="${escapeHTML(service.id)}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-content-button delete-service-button"
                        data-id="${escapeHTML(service.id)}"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;
    }).join("");
}


/* =========================================================
   FEATURE ADMIN PANEL
========================================================= */

function renderFeatureAdminList(message = "") {
    const container =
        document.getElementById("featureAdminList");

    if (!container) return;

    if (message) {
        container.innerHTML = `
            <div class="empty-content">
                ${escapeHTML(message)}
            </div>
        `;

        return;
    }

    if (!state.features.length) {
        container.innerHTML = `
            <div class="empty-content">
                No database features found.
            </div>
        `;

        return;
    }

    container.innerHTML = state.features.map((feature) => {
        return `
            <div class="admin-content-item">

                <div>
                    <h4>
                        ${escapeHTML(feature.title)}
                    </h4>

                    <p>
                        ${escapeHTML(feature.description)}
                    </p>
                </div>

                <div style="display:flex;gap:8px;">

                    <button
                        type="button"
                        class="dashboard-button edit-feature-button"
                        data-id="${escapeHTML(feature.id)}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-content-button delete-feature-button"
                        data-id="${escapeHTML(feature.id)}"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;
    }).join("");
}


/* =========================================================
   CREATE SERVICE/FEATURE ADMIN AREA
========================================================= */

function createManagementPanel() {
    const dashboardBox =
        document.querySelector(
            "#dashboardModal .dashboard-box"
        );

    if (!dashboardBox) return;

    if (document.getElementById("servicesFeaturesManager")) {
        return;
    }

    const logoutButton =
        $("#logoutButton");

    const panel =
        document.createElement("div");

    panel.id =
        "servicesFeaturesManager";

    panel.className =
        "admin-content-area";

    panel.innerHTML = `
        <h3>Services Management</h3>

        <div class="form-row">

            <div class="form-group">
                <label for="serviceTitle">
                    Service Title
                </label>

                <input
                    id="serviceTitle"
                    type="text"
                    placeholder="Service title"
                >
            </div>

            <div class="form-group">
                <label for="serviceIcon">
                    Service Key
                </label>

                <input
                    id="serviceIcon"
                    type="text"
                    placeholder="web"
                >
            </div>

        </div>

        <div class="form-group">
            <label for="serviceDescription">
                Description
            </label>

            <textarea
                id="serviceDescription"
                placeholder="Service description"
            ></textarea>
        </div>

        <div class="form-group">
            <label for="serviceOrder">
                Display Order
            </label>

            <input
                id="serviceOrder"
                type="number"
                value="0"
            >
        </div>

        <button
            type="button"
            class="primary-button"
            id="saveServiceButton"
        >
            Save Service
        </button>

        <div
            class="form-status"
            id="serviceStatus"
        ></div>

        <div
            id="serviceAdminList"
            style="margin-top:20px;"
        ></div>


        <div
            style="
                margin-top:40px;
                padding-top:30px;
                border-top:1px solid var(--border);
            "
        >

            <h3>Features Management</h3>

            <div class="form-row">

                <div class="form-group">
                    <label for="featureTitle">
                        Feature Title
                    </label>

                    <input
                        id="featureTitle"
                        type="text"
                        placeholder="Feature title"
                    >
                </div>

                <div class="form-group">
                    <label for="featureIcon">
                        Feature Key
                    </label>

                    <input
                        id="featureIcon"
                        type="text"
                        placeholder="computer-tips"
                    >
                </div>

            </div>

            <div class="form-group">
                <label for="featureDescription">
                    Description
                </label>

                <textarea
                    id="featureDescription"
                    placeholder="Feature description"
                ></textarea>
            </div>

            <div class="form-group">
                <label for="featureOrder">
                    Display Order
                </label>

                <input
                    id="featureOrder"
                    type="number"
                    value="0"
                >
            </div>

            <button
                type="button"
                class="primary-button"
                id="saveFeatureButton"
            >
                Save Feature
            </button>

            <div
                class="form-status"
                id="featureStatus"
            ></div>

            <div
                id="featureAdminList"
                style="margin-top:20px;"
            ></div>

        </div>
    `;

    if (logoutButton) {
        logoutButton.before(panel);
    } else {
        dashboardBox.appendChild(panel);
    }

    setupManagementButtons();
}


/* =========================================================
   MANAGEMENT BUTTONS
========================================================= */

function setupManagementButtons() {
    const saveService =
        $("#saveServiceButton");

    const saveFeature =
        $("#saveFeatureButton");

    if (saveService) {
        saveService.addEventListener(
            "click",
            saveServiceData
        );
    }

    if (saveFeature) {
        saveFeature.addEventListener(
            "click",
            saveFeatureData
        );
    }

    document.addEventListener(
        "click",
        async (event) => {

            const editService =
                event.target.closest(
                    ".edit-service-button"
                );

            if (editService) {

                const id =
                    editService.getAttribute(
                        "data-id"
                    );

                const service =
                    state.services.find(
                        (item) =>
                            String(item.id) ===
                            String(id)
                    );

                if (!service) return;

                $("#serviceTitle").value =
                    service.title || "";

                $("#serviceIcon").value =
                    service.icon || "";

                $("#serviceDescription").value =
                    service.description || "";

                $("#serviceOrder").value =
                    service.display_order || 0;

                state.editingType = "service";
                state.editingId = service.id;

                $("#saveServiceButton").textContent =
                    "Update Service";

                return;
            }

            const deleteService =
                event.target.closest(
                    ".delete-service-button"
                );

            if (deleteService) {

                const id =
                    deleteService.getAttribute(
                        "data-id"
                    );

                await deleteServiceData(id);

                return;
            }

            const editFeature =
                event.target.closest(
                    ".edit-feature-button"
                );

            if (editFeature) {

                const id =
                    editFeature.getAttribute(
                        "data-id"
                    );

                const feature =
                    state.features.find(
                        (item) =>
                            String(item.id) ===
                            String(id)
                    );

                if (!feature) return;

                $("#featureTitle").value =
                    feature.title || "";

                $("#featureIcon").value =
                    feature.icon || "";

                $("#featureDescription").value =
                    feature.description || "";

                $("#featureOrder").value =
                    feature.display_order || 0;

                state.editingType = "feature";
                state.editingId = feature.id;

                $("#saveFeatureButton").textContent =
                    "Update Feature";

                return;
            }

            const deleteFeature =
                event.target.closest(
                    ".delete-feature-button"
                );

            if (deleteFeature) {

                const id =
                    deleteFeature.getAttribute(
                        "data-id"
                    );

                await deleteFeatureData(id);
            }
        }
    );
}


/* =========================================================
   SAVE SERVICE
========================================================= */

async function saveServiceData() {
    if (!isAdmin()) {
        alert("Admin login required.");
        return;
    }

    const title =
        $("#serviceTitle")?.value.trim();

    const icon =
        $("#serviceIcon")?.value.trim();

    const description =
        $("#serviceDescription")?.value.trim();

    const displayOrder =
        Number(
            $("#serviceOrder")?.value || 0
        );

    const status =
        $("#serviceStatus");

    if (!title || !description) {

        if (status) {
            status.textContent =
                "Title and description are required.";
        }

        return;
    }

    try {

        await refreshAdminSession();

        const payload = {
            title,
            description,
            icon: icon || null,
            display_order: displayOrder
        };

        if (
            state.editingType === "service" &&
            state.editingId
        ) {

            await supabaseFetch(
                `/rest/v1/services?id=eq.${encodeURIComponent(
                    state.editingId
                )}`,
                {
                    method: "PATCH",
                    headers: {
                        Prefer: "return=minimal"
                    },
                    body: JSON.stringify(payload)
                },
                true
            );

        } else {

            await supabaseFetch(
                "/rest/v1/services",
                {
                    method: "POST",
                    headers: {
                        Prefer: "return=minimal"
                    },
                    body: JSON.stringify(payload)
                },
                true
            );
        }

        state.editingId = null;
        state.editingType = null;

        $("#serviceTitle").value = "";
        $("#serviceIcon").value = "";
        $("#serviceDescription").value = "";
        $("#serviceOrder").value = 0;

        $("#saveServiceButton").textContent =
            "Save Service";

        if (status) {
            status.textContent =
                "Service saved successfully.";
        }

        await loadServices();

    } catch (error) {

        console.error(error);

        if (status) {
            status.textContent =
                error.message ||
                "Could not save service.";
        }
    }
}


/* =========================================================
   SAVE FEATURE
========================================================= */

async function saveFeatureData() {
    if (!isAdmin()) {
        alert("Admin login required.");
        return;
    }

    const title =
        $("#featureTitle")?.value.trim();

    const icon =
        $("#featureIcon")?.value.trim();

    const description =
        $("#featureDescription")?.value.trim();

    const displayOrder =
        Number(
            $("#featureOrder")?.value || 0
        );

    const status =
        $("#featureStatus");

    if (!title || !description) {

        if (status) {
            status.textContent =
                "Title and description are required.";
        }

        return;
    }

    try {

        await refreshAdminSession();

        const payload = {
            title,
            description,
            icon: icon || null,
            display_order: displayOrder
        };

        if (
            state.editingType === "feature" &&
            state.editingId
        ) {

            await supabaseFetch(
                `/rest/v1/features?id=eq.${encodeURIComponent(
                    state.editingId
                )}`,
                {
                    method: "PATCH",
                    headers: {
                        Prefer: "return=minimal"
                    },
                    body: JSON.stringify(payload)
                },
                true
            );

        } else {

            await supabaseFetch(
                "/rest/v1/features",
                {
                    method: "POST",
                    headers: {
                        Prefer: "return=minimal"
                    },
                    body: JSON.stringify(payload)
                },
                true
            );
        }

        state.editingId = null;
        state.editingType = null;

        $("#featureTitle").value = "";
        $("#featureIcon").value = "";
        $("#featureDescription").value = "";
        $("#featureOrder").value = 0;

        $("#saveFeatureButton").textContent =
            "Save Feature";

        if (status) {
            status.textContent =
                "Feature saved successfully.";
        }

        await loadFeatures();

    } catch (error) {

        console.error(error);

        if (status) {
            status.textContent =
                error.message ||
                "Could not save feature.";
        }
    }
}


/* =========================================================
   DELETE SERVICE
========================================================= */

async function deleteServiceData(id) {
    if (!isAdmin()) {
        alert("Admin login required.");
        return;
    }

    if (
        !confirm(
            "Are you sure you want to delete this service?"
        )
    ) {
        return;
    }

    try {

        await refreshAdminSession();

        await supabaseFetch(
            `/rest/v1/services?id=eq.${encodeURIComponent(id)}`,
            {
                method: "DELETE",
                headers: {
                    Prefer: "return=minimal"
                }
            },
            true
        );

        await loadServices();

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Could not delete service."
        );
    }
}


/* =========================================================
   DELETE FEATURE
========================================================= */

async function deleteFeatureData(id) {
    if (!isAdmin()) {
        alert("Admin login required.");
        return;
    }

    if (
        !confirm(
            "Are you sure you want to delete this feature?"
        )
    ) {
        return;
    }

    try {

        await refreshAdminSession();

        await supabaseFetch(
            `/rest/v1/features?id=eq.${encodeURIComponent(id)}`,
            {
                method: "DELETE",
                headers: {
                    Prefer: "return=minimal"
                }
            },
            true
        );

        await loadFeatures();

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Could not delete feature."
        );
    }
}


/* =========================================================
   ADMIN MESSAGES
========================================================= */

function createMessagesSection() {
    const dashboardBox =
        document.querySelector(
            "#dashboardModal .dashboard-box"
        );

    if (!dashboardBox) return;

    if (
        document.getElementById(
            "adminMessagesSection"
        )
    ) {
        return;
    }

    const section =
        document.createElement("section");

    section.id =
        "adminMessagesSection";

    section.className =
        "admin-messages-section";

    section.innerHTML = `
        <h3>Visitor Messages</h3>

        <button
            type="button"
            class="dashboard-button"
            id="refreshMessagesButton"
        >
            Refresh Messages
        </button>

        <div
            class="admin-messages-list"
            id="adminMessagesList"
        ></div>
    `;

    const logoutButton =
        $("#logoutButton");

    if (logoutButton) {
        logoutButton.before(section);
    } else {
        dashboardBox.appendChild(section);
    }

    $("#refreshMessagesButton")
        ?.addEventListener(
            "click",
            loadAdminMessages
        );
}


/* =========================================================
   LOAD MESSAGES
========================================================= */

async function loadAdminMessages() {
    if (!isAdmin()) return;

    createMessagesSection();

    const container =
        $("#adminMessagesList");

    if (!container) return;

    container.innerHTML = `
        <div class="empty-content">
            Loading messages...
        </div>
    `;

    try {

        await refreshAdminSession();

        const data =
            await supabaseFetch(
                "/rest/v1/message?select=*&order=created_at.desc",
                {},
                true
            );

        if (!Array.isArray(data) || !data.length) {

            container.innerHTML = `
                <div class="empty-content">
                    No visitor messages yet.
                </div>
            `;

            return;
        }

        container.innerHTML =
            data.map((item) => {

                return `
                    <div
                        class="admin-message-item"
                    >

                        <h4>
                            ${escapeHTML(
                                item.subject ||
                                "Visitor Message"
                            )}
                        </h4>

                        <p>
                            <strong>Name:</strong>
                            ${escapeHTML(
                                item.name || ""
                            )}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${escapeHTML(
                                item.email || ""
                            )}
                        </p>

                        <p>
                            <strong>Message:</strong>
                            ${escapeHTML(
                                item.message || ""
                            )}
                        </p>

                        <small>
                            ${formatDate(
                                item.created_at
                            )}
                        </small>

                        <button
                            type="button"
                            class="delete-message-button"
                            data-id="${escapeHTML(
                                item.id
                            )}"
                        >
                            Delete
                        </button>

                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty-content">
                Could not load visitor messages.
            </div>
        `;
    }
}


/* =========================================================
   DELETE MESSAGE
========================================================= */

function setupMessageDeletion() {
    document.addEventListener(
        "click",
        async (event) => {

            const button =
                event.target.closest(
                    ".delete-message-button"
                );

            if (!button) return;

            if (!isAdmin()) {
                alert("Admin login required.");
                return;
            }

            const id =
                button.getAttribute("data-id");

            if (
                !confirm(
                    "Are you sure you want to delete this message?"
                )
            ) {
                return;
            }

            try {

                await refreshAdminSession();

                await supabaseFetch(
                    `/rest/v1/message?id=eq.${encodeURIComponent(
                        id
                    )}`,
                    {
                        method: "DELETE",
                        headers: {
                            Prefer: "return=minimal"
                        }
                    },
                    true
                );

                await loadAdminMessages();

            } catch (error) {

                console.error(error);

                alert(
                    error.message ||
                    "Could not delete message."
                );
            }
        }
    );
}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {
    const button = $("#logoutButton");

    if (!button) return;

    button.addEventListener("click", () => {

        state.session = null;

        localStorage.removeItem(
            "danielTechSession"
        );

        closeModal(
            $("#dashboardModal")
        );

        alert(
            "You have been logged out."
        );
    });
}


/* =========================================================
   BACK TO TOP
========================================================= */

function setupBackToTop() {
    const button = $("#backTop");

    if (!button) return;

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 500) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }

        }
    );

    button.addEventListener(
        "click",
        () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}


/* =========================================================
   PROTECT DASHBOARD
========================================================= */

function protectDashboard() {
    const dashboard =
        $("#dashboardModal");

    if (!dashboard) return;

    dashboard.addEventListener(
        "click",
        (event) => {

            if (
                event.target.closest(
                    "#logoutButton"
                )
            ) {
                return;
            }

            if (!isAdmin()) {
                closeModal(dashboard);
            }
        }
    );
}


/* =========================================================
   WHATSAPP
========================================================= */

function setupWhatsApp() {
    const button =
        document.querySelector(
            ".whatsapp-button"
        );

    if (!button) return;

    button.setAttribute(
        "target",
        "_blank"
    );

    button.setAttribute(
        "rel",
        "noopener noreferrer"
    );
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Daniel Tech script loaded successfully."
        );

        restoreDarkMode();

        setupMobileMenu();
        setupDarkMode();
        setupSettings();
        setupModalClose();
        setupAbout();

        setupServiceButtons();
        setupFeatureButtons();

        setupComments();
        setupContactForm();

        setupAdminButton();
        setupAdminLogin();

        setupContentButtons();
        setupSaveContent();
        setupContentManagement();

        setupManagementButtons();

        setupMessageDeletion();
        setupLogout();

        setupBackToTop();
        setupDashboardButton();

        setupWhatsApp();

        protectDashboard();

        createManagementPanel();
        createMessagesSection();

        navigateTo("home");

        loadComments();

        await restoreAdminSession();

        await Promise.all([
            loadContents(),
            loadServices(),
            loadFeatures()
        ]);

        renderAdminContent();
        renderServiceAdminList();
        renderFeatureAdminList();

        if (isAdmin()) {
            console.log(
                "Daniel Tech admin session restored."
            );
        }
    }
);
