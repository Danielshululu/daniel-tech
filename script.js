/* =========================================================
   DANIEL TECH - MAIN SCRIPT
   Supabase + Website + Admin Dashboard
   ========================================================= */

const SUPABASE_URL =
    "https://bodprzntcloioncwhpvr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";

const ADMIN_UID =
    "05fef3eb-16a3-4554-9d9b-de7d2b29144b";

const STORAGE_BUCKET = "daniel-files";

const state = {
    session: null,
    contents: [],
    editingId: null,
    services: [],
    features: [],
    editingServiceId: null,
    editingFeatureId: null
};


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function show(element) {
    if (element) {
        element.style.display = "flex";
        element.classList.add("active");
    }
}

function hide(element) {
    if (element) {
        element.style.display = "none";
        element.classList.remove("active");
    }
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

    try {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    } catch {
        return "";
    }
}

function getHeaders(authenticated = false) {
    const headers = {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json"
    };

    if (authenticated && state.session?.access_token) {
        headers.Authorization = `Bearer ${state.session.access_token}`;
    }

    return headers;
}

function openOverlay() {
    const overlay = $("overlay");

    if (overlay) {
        overlay.style.display = "block";
        overlay.classList.add("active");
    }
}

function closeOverlay() {
    const overlay = $("overlay");

    if (overlay) {
        overlay.style.display = "none";
        overlay.classList.remove("active");
    }
}


/* =========================================================
   MODALS
   ========================================================= */

function closeAllModals() {
    document.querySelectorAll(".modal").forEach(modal => {
        hide(modal);
    });

    closeOverlay();
}

document.addEventListener("click", function (event) {
    const closeButton = event.target.closest("[data-close-modal]");

    if (closeButton) {
        closeAllModals();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeAllModals();
    }
});


/* =========================================================
   NAVIGATION
   ========================================================= */

function navigateTo(pageName) {
    document.querySelectorAll("[data-page]").forEach(button => {
        button.classList.remove("active");
    });

    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
        page.classList.remove("active");
    });

    const target = document.getElementById(pageName);

    if (target) {
        target.style.display = "block";
        target.classList.add("active");
    }

    const activeButton = document.querySelector(
        `[data-page="${pageName}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    const mobileMenu = $("mobileMenu");

    if (mobileMenu) {
        mobileMenu.classList.remove("active");
    }
}

document.addEventListener("click", function (event) {
    const navigationButton = event.target.closest("[data-page]");

    if (!navigationButton) return;

    event.preventDefault();

    const page = navigationButton.dataset.page;

    if (page) {
        navigateTo(page);
    }
});


/* =========================================================
   MOBILE MENU
   ========================================================= */

document.addEventListener("click", function (event) {
    const menuButton = event.target.closest(
        "#menuButton, #mobileMenuButton, .menu-button"
    );

    if (!menuButton) return;

    const mobileMenu = $("mobileMenu");

    if (mobileMenu) {
        mobileMenu.classList.toggle("active");
    }
});


/* =========================================================
   DARK MODE / SETTINGS
   ========================================================= */

function restoreDarkMode() {
    const saved = localStorage.getItem("danielTechDarkMode");

    if (saved === "true") {
        document.body.classList.add("dark-mode");
    }
}

document.addEventListener("click", function (event) {
    const darkModeButton = event.target.closest(
        "#darkModeButton, #themeButton, .theme-button"
    );

    if (!darkModeButton) return;

    document.body.classList.toggle("dark-mode");

    localStorage.setItem(
        "danielTechDarkMode",
        document.body.classList.contains("dark-mode")
    );
});


/* =========================================================
   ABOUT
   ========================================================= */

function setupAbout() {
    const aboutButtons = document.querySelectorAll(
        '[data-about], #aboutButton'
    );

    aboutButtons.forEach(button => {
        button.addEventListener("click", function () {
            navigateTo("about");
        });
    });
}


/* =========================================================
   AUTH SESSION
   ========================================================= */

function isAdmin() {
    return (
        state.session?.user?.id === ADMIN_UID
    );
}


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

            localStorage.removeItem(
                "danielTechSession"
            );

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
            "Session refresh error:",
            error
        );

        return false;
    }
}


async function ensureAdminSession() {
    if (!state.session) {
        return false;
    }

    if (!isAdmin()) {
        return false;
    }

    const refreshed = await refreshAdminSession();

    return refreshed;
}


/* =========================================================
   REST API HELPER
   ========================================================= */

async function supabaseFetch(
    endpoint,
    options = {},
    authenticated = false
) {
    const headers = {
        ...getHeaders(authenticated),
        ...(options.headers || {})
    };

    let response = await fetch(
        `${SUPABASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    if (
        authenticated &&
        (response.status === 401 || response.status === 403)
    ) {
        const refreshed = await refreshAdminSession();

        if (refreshed) {
            const retryHeaders = {
                ...getHeaders(true),
                ...(options.headers || {})
            };

            response = await fetch(
                `${SUPABASE_URL}${endpoint}`,
                {
                    ...options,
                    headers: retryHeaders
                }
            );
        }
    }

    return response;
}


/* =========================================================
   SERVICES
   ========================================================= */

async function loadServices() {
    try {
        const response = await supabaseFetch(
            "/rest/v1/services?select=*&order=display_order.asc,created_at.asc",
            {},
            false
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error(
                "Services loading error:",
                errorText
            );

            return;
        }

        state.services = await response.json();

        renderServicesOnWebsite();

        if (isAdmin()) {
            renderAdminServices();
        }

    } catch (error) {
        console.error(
            "Could not load services:",
            error
        );
    }
}


/* =========================================================
   RENDER SERVICES ON WEBSITE
   ========================================================= */

function renderServicesOnWebsite() {
    const buttons = document.querySelectorAll(
        ".service-view-button"
    );

    buttons.forEach(button => {
        const key = button.dataset.service;

        const service = state.services.find(item =>
            String(item.icon || "").toLowerCase() ===
            String(key || "").toLowerCase()
        );

        if (!service) return;

        button.dataset.serviceId = service.id;

        button.textContent = "View Service";

        button.onclick = function (event) {
            event.preventDefault();
            event.stopPropagation();

            openServiceDetails(service);
        };
    });
}


function openServiceDetails(service) {
    const title = $("serviceModalTitle");
    const text = $("serviceModalText");
    const modal = $("serviceModal");

    if (title) {
        title.textContent = service.title || "Service";
    }

    if (text) {
        text.textContent =
            service.description ||
            "No description available.";
    }

    if (modal) {
        show(modal);
        openOverlay();
    }
}


/* =========================================================
   FEATURES
   ========================================================= */

async function loadFeatures() {
    try {
        const response = await supabaseFetch(
            "/rest/v1/features?select=*&order=display_order.asc,created_at.asc",
            {},
            false
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error(
                "Features loading error:",
                errorText
            );

            return;
        }

        state.features = await response.json();

        renderFeaturesOnWebsite();

        if (isAdmin()) {
            renderAdminFeatures();
        }

    } catch (error) {
        console.error(
            "Could not load features:",
            error
        );
    }
}


/* =========================================================
   RENDER FEATURES ON WEBSITE
   ========================================================= */

function renderFeaturesOnWebsite() {
    const buttons = document.querySelectorAll(
        ".feature-view-button"
    );

    buttons.forEach(button => {
        const key = button.dataset.feature;

        const feature = state.features.find(item =>
            String(item.icon || "").toLowerCase() ===
            String(key || "").toLowerCase()
        );

        if (!feature) return;

        button.dataset.featureId = feature.id;

        button.textContent = "Explore";

        button.onclick = function (event) {
            event.preventDefault();
            event.stopPropagation();

            openFeatureDetails(feature);
        };
    });
}


function openFeatureDetails(feature) {
    const title = $("featureModalTitle");
    const text = $("featureModalText");
    const modal = $("featureModal");

    if (title) {
        title.textContent = feature.title || "Feature";
    }

    if (text) {
        text.textContent =
            feature.description ||
            "No description available.";
    }

    if (modal) {
        show(modal);
        openOverlay();
    }
}


/* =========================================================
   CONTENT
   ========================================================= */

async function loadContents() {
    try {
        const response = await supabaseFetch(
            "/rest/v1/contents?select=*&order=created_at.desc",
            {},
            false
        );

        if (!response.ok) {
            console.error(
                "Contents loading failed:",
                await response.text()
            );

            return;
        }

        state.contents = await response.json();

        renderLatestContent();
        renderBlog();
        updateNewsBar();

        if (isAdmin()) {
            renderAdminContent();
        }

    } catch (error) {
        console.error(
            "Contents error:",
            error
        );
    }
}


/* =========================================================
   LATEST CONTENT
   ========================================================= */

function renderLatestContent() {
    const containers = document.querySelectorAll(
        "[data-latest-content], #latestContent"
    );

    if (!containers.length) return;

    containers.forEach(container => {
        if (!state.contents.length) {
            container.innerHTML =
                "<p>No content available.</p>";

            return;
        }

        container.innerHTML = state.contents
            .slice(0, 6)
            .map(content => {
                return `
                    <article class="content-card">
                        <h3>
                            ${escapeHTML(content.title || "")}
                        </h3>

                        <p>
                            ${escapeHTML(
                                content.description ||
                                content.content ||
                                ""
                            )}
                        </p>

                        <small>
                            ${formatDate(content.created_at)}
                        </small>
                    </article>
                `;
            })
            .join("");
    });
}


/* =========================================================
   BLOG
   ========================================================= */

function renderBlog() {
    const container =
        $("blogContainer") ||
        document.querySelector("[data-blog]");

    if (!container) return;

    const blogs = state.contents.filter(
        item =>
            String(item.type || "").toLowerCase() ===
            "news"
    );

    if (!blogs.length) {
        container.innerHTML =
            "<p>No news available.</p>";

        return;
    }

    container.innerHTML = blogs
        .map(item => {
            return `
                <article class="blog-card">
                    <h3>
                        ${escapeHTML(item.title || "")}
                    </h3>

                    <p>
                        ${escapeHTML(
                            item.description ||
                            item.content ||
                            ""
                        )}
                    </p>

                    <small>
                        ${formatDate(item.created_at)}
                    </small>
                </article>
            `;
        })
        .join("");
}


/* =========================================================
   NEWS BAR
   ========================================================= */

function updateNewsBar() {
    const newsBar =
        $("newsBar") ||
        document.querySelector("[data-news-bar]");

    if (!newsBar) return;

    const news = state.contents.filter(
        item =>
            String(item.type || "").toLowerCase() ===
            "news"
    );

    if (!news.length) {
        newsBar.textContent =
            "Welcome to Daniel Tech";

        return;
    }

    newsBar.textContent =
        news[0].title ||
        "Daniel Tech News";
}


/* =========================================================
   COMMENTS
   ========================================================= */

function loadComments() {
    const container =
        $("commentsContainer") ||
        document.querySelector("[data-comments]");

    if (!container) return;

    let comments = [];

    try {
        comments =
            JSON.parse(
                localStorage.getItem(
                    "danielTechComments"
                )
            ) || [];
    } catch {
        comments = [];
    }

    if (!comments.length) {
        container.innerHTML =
            "<p>No comments yet.</p>";

        return;
    }

    container.innerHTML = comments
        .map(comment => {
            return `
                <div class="comment">
                    <strong>
                        ${escapeHTML(comment.name)}
                    </strong>

                    <p>
                        ${escapeHTML(comment.text)}
                    </p>
                </div>
            `;
        })
        .join("");
}


document.addEventListener("submit", function (event) {
    const form = event.target.closest(
        "#commentForm, [data-comment-form]"
    );

    if (!form) return;

    event.preventDefault();

    const name =
        form.querySelector(
            '[name="name"]'
        )?.value.trim();

    const text =
        form.querySelector(
            '[name="comment"], [name="text"]'
        )?.value.trim();

    if (!name || !text) {
        alert("Please fill in all fields.");

        return;
    }

    let comments = [];

    try {
        comments =
            JSON.parse(
                localStorage.getItem(
                    "danielTechComments"
                )
            ) || [];
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


/* =========================================================
   CONTACT / MESSAGES
   ========================================================= */

document.addEventListener("submit", async function (event) {
    const form = event.target.closest(
        "#contactForm"
    );

    if (!form) return;

    event.preventDefault();

    const name =
        form.querySelector(
            '[name="name"]'
        )?.value.trim();

    const email =
        form.querySelector(
            '[name="email"]'
        )?.value.trim();

    const message =
        form.querySelector(
            '[name="message"]'
        )?.value.trim();

    if (!name || !email || !message) {
        alert("Please fill in all fields.");

        return;
    }

    try {
        const response = await supabaseFetch(
            "/rest/v1/message",
            {
                method: "POST",
                headers: {
                    Prefer: "return=minimal"
                },
                body: JSON.stringify({
                    name,
                    email,
                    message
                })
            },
            false
        );

        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }

        alert(
            "Your message has been sent successfully."
        );

        form.reset();

    } catch (error) {
        console.error(error);

        alert(
            "Failed to send your message. Please try again."
        );
    }
});


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

document.addEventListener("click", function (event) {
    const adminButton = event.target.closest(
        "#adminButton, #loginButton, .admin-button"
    );

    if (!adminButton) return;

    event.preventDefault();

    if (isAdmin()) {
        openDashboard();
    } else {
        const loginModal = $("loginModal");

        if (loginModal) {
            show(loginModal);
            openOverlay();
        }
    }
});


document.addEventListener("submit", async function (event) {
    const form = event.target.closest(
        "#loginForm"
    );

    if (!form) return;

    event.preventDefault();

    const email =
        form.querySelector(
            '[name="email"]'
        )?.value.trim();

    const password =
        form.querySelector(
            '[name="password"]'
        )?.value;

    if (!email || !password) {
        alert(
            "Please enter email and password."
        );

        return;
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
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (
            !response.ok ||
            !data.access_token ||
            !data.user
        ) {
            throw new Error(
                data.error_description ||
                data.msg ||
                "Login failed"
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

        if (!isAdmin()) {
            state.session = null;

            localStorage.removeItem(
                "danielTechSession"
            );

            throw new Error(
                "This account is not authorized as administrator."
            );
        }

        form.reset();

        closeAllModals();

        openDashboard();

    } catch (error) {
        console.error(error);

        alert(
            error.message ||
            "Login failed."
        );
    }
});


/* =========================================================
   RESTORE SESSION
   ========================================================= */

async function restoreAdminSession() {
    const saved =
        localStorage.getItem(
            "danielTechSession"
        );

    if (!saved) return;

    try {
        const session = JSON.parse(saved);

        state.session = session;

        if (!isAdmin()) {
            state.session = null;

            localStorage.removeItem(
                "danielTechSession"
            );

            return;
        }

        await refreshAdminSession();

    } catch (error) {
        console.error(
            "Session restore failed:",
            error
        );

        state.session = null;

        localStorage.removeItem(
            "danielTechSession"
        );
    }
}


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function openDashboard() {
    if (!isAdmin()) {
        const loginModal = $("loginModal");

        if (loginModal) {
            show(loginModal);
            openOverlay();
        }

        return;
    }

    const dashboard =
        $("dashboardModal");

    if (!dashboard) {
        console.error(
            "dashboardModal was not found."
        );

        return;
    }

    show(dashboard);
    openOverlay();

    createManagementPanel();

    renderAdminContent();
    renderAdminServices();
    renderAdminFeatures();

    loadAdminMessages();
}


/* =========================================================
   CONTENT ADMIN
   ========================================================= */

function prepareEditor(content = null) {
    const editor =
        $("contentEditor") ||
        $("adminEditor");

    if (!editor) return;

    state.editingId =
        content?.id || null;

    const title =
        editor.querySelector(
            '[name="title"], #contentTitle'
        );

    const description =
        editor.querySelector(
            '[name="description"], #contentDescription'
        );

    const type =
        editor.querySelector(
            '[name="type"], #contentType'
        );

    if (title) {
        title.value =
            content?.title || "";
    }

    if (description) {
        description.value =
            content?.description ||
            content?.content ||
            "";
    }

    if (type) {
        type.value =
            content?.type || "news";
    }

    show(editor);
}


document.addEventListener("click", function (event) {
    const addNews =
        event.target.closest("#addNewsButton");

    const addTip =
        event.target.closest("#addTipButton");

    const addVideo =
        event.target.closest("#addVideoButton");

    const addPdf =
        event.target.closest("#addPdfButton");

    if (
        addNews ||
        addTip ||
        addVideo ||
        addPdf
    ) {
        event.preventDefault();

        let type = "news";

        if (addTip) type = "tip";
        if (addVideo) type = "video";
        if (addPdf) type = "pdf";

        prepareEditor({
            type
        });
    }
});


document.addEventListener("submit", async function (event) {
    const form = event.target.closest(
        "#contentEditorForm"
    );

    if (!form) return;

    event.preventDefault();

    if (!(await ensureAdminSession())) {
        alert(
            "Admin session expired. Please log in again."
        );

        return;
    }

    const title =
        form.querySelector(
            '[name="title"]'
        )?.value.trim();

    const description =
        form.querySelector(
            '[name="description"]'
        )?.value.trim();

    const type =
        form.querySelector(
            '[name="type"]'
        )?.value || "news";

    if (!title || !description) {
        alert(
            "Please fill in title and description."
        );

        return;
    }

    const payload = {
        title,
        description,
        type
    };

    try {
        let response;

        if (state.editingId) {
            response = await supabaseFetch(
                `/rest/v1/contents?id=eq.${state.editingId}`,
                {
                    method: "PATCH",
                    headers: {
                        Prefer: "return=representation"
                    },
                    body: JSON.stringify(payload)
                },
                true
            );
        } else {
            response = await supabaseFetch(
                "/rest/v1/contents",
                {
                    method: "POST",
                    headers: {
                        Prefer: "return=representation"
                    },
                    body: JSON.stringify(payload)
                },
                true
            );
        }

        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }

        alert(
            state.editingId
                ? "Content updated successfully."
                : "Content added successfully."
        );

        state.editingId = null;

        form.reset();

        hide(form);

        await loadContents();

    } catch (error) {
        console.error(error);

        alert(
            "Could not save content: " +
            error.message
        );
    }
});


/* =========================================================
   ADMIN CONTENT LIST
   ========================================================= */

function renderAdminContent() {
    const container =
        $("adminContentList") ||
        document.querySelector(
            "[data-admin-content-list]"
        );

    if (!container) return;

    if (!state.contents.length) {
        container.innerHTML =
            "<p>No content available.</p>";

        return;
    }

    container.innerHTML = state.contents
        .map(item => {
            return `
                <div class="admin-content-item">

                    <div>
                        <strong>
                            ${escapeHTML(
                                item.title || ""
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                item.type || ""
                            )}
                            -
                            ${formatDate(
                                item.created_at
                            )}
                        </small>
                    </div>

                    <div class="admin-actions">

                        <button
                            type="button"
                            class="edit-content-button"
                            data-id="${item.id}">
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-content-button"
                            data-id="${item.id}">
                            Delete
                        </button>

                    </div>

                </div>
            `;
        })
        .join("");
}


document.addEventListener("click", async function (event) {
    const editButton =
        event.target.closest(
            ".edit-content-button"
        );

    const deleteButton =
        event.target.closest(
            ".delete-content-button"
        );

    if (editButton) {
        const id =
            editButton.dataset.id;

        const content =
            state.contents.find(
                item =>
                    String(item.id) ===
                    String(id)
            );

        if (content) {
            prepareEditor(content);
        }

        return;
    }

    if (deleteButton) {
        const id =
            deleteButton.dataset.id;

        if (!confirm(
            "Are you sure you want to delete this content?"
        )) {
            return;
        }

        if (!(await ensureAdminSession())) {
            alert(
                "Admin session expired. Please log in again."
            );

            return;
        }

        try {
            const response =
                await supabaseFetch(
                    `/rest/v1/contents?id=eq.${id}`,
                    {
                        method: "DELETE"
                    },
                    true
                );

            if (!response.ok) {
                throw new Error(
                    await response.text()
                );
            }

            await loadContents();

            alert(
                "Content deleted successfully."
            );

        } catch (error) {
            console.error(error);

            alert(
                "Delete failed: " +
                error.message
            );
        }
    }
});


/* =========================================================
   FILE UPLOAD
   ========================================================= */

async function uploadFile(file) {
    if (!file) {
        throw new Error(
            "No file selected."
        );
    }

    if (!(await ensureAdminSession())) {
        throw new Error(
            "Admin session expired. Please log in again."
        );
    }

    const safeName =
        file.name
            .replace(/[^a-zA-Z0-9._-]/g, "_");

    const path =
        `${Date.now()}-${safeName}`;

    const response =
        await supabaseFetch(
            `/storage/v1/object/${STORAGE_BUCKET}/${path}`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        file.type ||
                        "application/octet-stream",
                    "x-upsert": "false"
                },
                body: file
            },
            true
        );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}


/* =========================================================
   ADMIN SERVICES & FEATURES MANAGER
   ========================================================= */

function createManagementPanel() {
    if (!isAdmin()) return;

    const dashboard =
        $("dashboardModal");

    if (!dashboard) return;

    let box =
        dashboard.querySelector(
            ".management-panel"
        );

    if (box) return;

    box =
        document.createElement("div");

    box.className =
        "management-panel";

    box.innerHTML = `
        <div class="management-header">
            <h2>Services & Features Manager</h2>
        </div>

        <section class="management-section">

            <div class="management-section-header">
                <h3>Services</h3>

                <button
                    type="button"
                    id="addServiceButton">
                    Add Service
                </button>
            </div>

            <div
                id="serviceEditor"
                class="management-editor"
                style="display:none;">

                <input
                    type="text"
                    id="serviceTitle"
                    placeholder="Service title">

                <textarea
                    id="serviceDescription"
                    placeholder="Service description"></textarea>

                <input
                    type="text"
                    id="serviceIcon"
                    placeholder="Icon key e.g. web">

                <input
                    type="number"
                    id="serviceOrder"
                    placeholder="Display order"
                    value="0">

                <div class="management-actions">

                    <button
                        type="button"
                        id="saveServiceButton">
                        Save Service
                    </button>

                    <button
                        type="button"
                        id="cancelServiceButton">
                        Cancel
                    </button>

                </div>

            </div>

            <div id="adminServicesList"></div>

        </section>


        <section class="management-section">

            <div class="management-section-header">
                <h3>Features</h3>

                <button
                    type="button"
                    id="addFeatureButton">
                    Add Feature
                </button>
            </div>

            <div
                id="featureEditor"
                class="management-editor"
                style="display:none;">

                <input
                    type="text"
                    id="featureTitle"
                    placeholder="Feature title">

                <textarea
                    id="featureDescription"
                    placeholder="Feature description"></textarea>

                <input
                    type="text"
                    id="featureIcon"
                    placeholder="Feature key e.g. programming">

                <input
                    type="number"
                    id="featureOrder"
                    placeholder="Display order"
                    value="0">

                <div class="management-actions">

                    <button
                        type="button"
                        id="saveFeatureButton">
                        Save Feature
                    </button>

                    <button
                        type="button"
                        id="cancelFeatureButton">
                        Cancel
                    </button>

                </div>

            </div>

            <div id="adminFeaturesList"></div>

        </section>
    `;

    const logout =
        $("logoutButton");

    if (logout) {
        logout.parentNode.insertBefore(
            box,
            logout
        );
    } else {
        const modalBox =
            dashboard.querySelector(
                ".modal-box"
            ) ||
            dashboard.firstElementChild ||
            dashboard;

        modalBox.appendChild(box);
    }

    setupManagementButtons();
}


/* =========================================================
   ADMIN SERVICES LIST
   ========================================================= */

function renderAdminServices() {
    const container =
        $("adminServicesList");

    if (!container) return;

    if (!state.services.length) {
        container.innerHTML =
            "<p>No services available.</p>";

        return;
    }

    container.innerHTML =
        state.services
            .map(service => {
                return `
                    <div class="management-item">

                        <div>
                            <strong>
                                ${escapeHTML(
                                    service.title
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    service.description
                                )}
                            </p>

                            <small>
                                Key:
                                ${escapeHTML(
                                    service.icon || ""
                                )}
                            </small>
                        </div>

                        <div class="management-actions">

                            <button
                                type="button"
                                class="edit-service-button"
                                data-id="${service.id}">
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-service-button"
                                data-id="${service.id}">
                                Delete
                            </button>

                        </div>

                    </div>
                `;
            })
            .join("");
}


/* =========================================================
   ADMIN FEATURES LIST
   ========================================================= */

function renderAdminFeatures() {
    const container =
        $("adminFeaturesList");

    if (!container) return;

    if (!state.features.length) {
        container.innerHTML =
            "<p>No features available.</p>";

        return;
    }

    container.innerHTML =
        state.features
            .map(feature => {
                return `
                    <div class="management-item">

                        <div>
                            <strong>
                                ${escapeHTML(
                                    feature.title
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    feature.description
                                )}
                            </p>

                            <small>
                                Key:
                                ${escapeHTML(
                                    feature.icon || ""
                                )}
                            </small>
                        </div>

                        <div class="management-actions">

                            <button
                                type="button"
                                class="edit-feature-button"
                                data-id="${feature.id}">
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-feature-button"
                                data-id="${feature.id}">
                                Delete
                            </button>

                        </div>

                    </div>
                `;
            })
            .join("");
}


/* =========================================================
   MANAGEMENT BUTTONS
   ========================================================= */

function setupManagementButtons() {

    const addService =
        $("addServiceButton");

    const saveService =
        $("saveServiceButton");

    const cancelService =
        $("cancelServiceButton");

    const addFeature =
        $("addFeatureButton");

    const saveFeature =
        $("saveFeatureButton");

    const cancelFeature =
        $("cancelFeatureButton");


    if (addService) {
        addService.onclick = function () {

            state.editingServiceId = null;

            $("serviceTitle").value = "";
            $("serviceDescription").value = "";
            $("serviceIcon").value = "";
            $("serviceOrder").value = "0";

            show(
                $("serviceEditor")
            );
        };
    }


    if (cancelService) {
        cancelService.onclick = function () {

            state.editingServiceId = null;

            hide(
                $("serviceEditor")
            );
        };
    }


    if (saveService) {
        saveService.onclick =
            saveServiceToDatabase;
    }


    if (addFeature) {
        addFeature.onclick = function () {

            state.editingFeatureId = null;

            $("featureTitle").value = "";
            $("featureDescription").value = "";
            $("featureIcon").value = "";
            $("featureOrder").value = "0";

            show(
                $("featureEditor")
            );
        };
    }


    if (cancelFeature) {
        cancelFeature.onclick = function () {

            state.editingFeatureId = null;

            hide(
                $("featureEditor")
            );
        };
    }


    if (saveFeature) {
        saveFeature.onclick =
            saveFeatureToDatabase;
    }
}


/* =========================================================
   SAVE SERVICE
   ========================================================= */

async function saveServiceToDatabase() {

    if (!(await ensureAdminSession())) {
        alert(
            "Admin session expired. Please log in again."
        );

        return;
    }

    const title =
        $("serviceTitle")
            ?.value.trim();

    const description =
        $("serviceDescription")
            ?.value.trim();

    const icon =
        $("serviceIcon")
            ?.value.trim();

    const displayOrder =
        Number(
            $("serviceOrder")
                ?.value || 0
        );


    if (!title || !description || !icon) {
        alert(
            "Please fill in title, description and icon key."
        );

        return;
    }


    const payload = {
        title,
        description,
        icon,
        display_order: displayOrder
    };


    try {

        let response;

        if (state.editingServiceId) {

            response =
                await supabaseFetch(
                    `/rest/v1/services?id=eq.${state.editingServiceId}`,
                    {
                        method: "PATCH",
                        headers: {
                            Prefer:
                                "return=representation"
                        },
                        body:
                            JSON.stringify(
                                payload
                            )
                    },
                    true
                );

        } else {

            response =
                await supabaseFetch(
                    "/rest/v1/services",
                    {
                        method: "POST",
                        headers: {
                            Prefer:
                                "return=representation"
                        },
                        body:
                            JSON.stringify(
                                payload
                            )
                    },
                    true
                );
        }


        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }


        state.editingServiceId = null;

        hide(
            $("serviceEditor")
        );

        await loadServices();

        alert(
            "Service saved successfully."
        );

    } catch (error) {

        console.error(error);

        alert(
            "Could not save service: " +
            error.message
        );
    }
}


/* =========================================================
   SAVE FEATURE
   ========================================================= */

async function saveFeatureToDatabase() {

    if (!(await ensureAdminSession())) {
        alert(
            "Admin session expired. Please log in again."
        );

        return;
    }


    const title =
        $("featureTitle")
            ?.value.trim();

    const description =
        $("featureDescription")
            ?.value.trim();

    const icon =
        $("featureIcon")
            ?.value.trim();

    const displayOrder =
        Number(
            $("featureOrder")
                ?.value || 0
        );


    if (!title || !description || !icon) {
        alert(
            "Please fill in title, description and feature key."
        );

        return;
    }


    const payload = {
        title,
        description,
        icon,
        display_order: displayOrder
    };


    try {

        let response;

        if (state.editingFeatureId) {

            response =
                await supabaseFetch(
                    `/rest/v1/features?id=eq.${state.editingFeatureId}`,
                    {
                        method: "PATCH",
                        headers: {
                            Prefer:
                                "return=representation"
                        },
                        body:
                            JSON.stringify(
                                payload
                            )
                    },
                    true
                );

        } else {

            response =
                await supabaseFetch(
                    "/rest/v1/features",
                    {
                        method: "POST",
                        headers: {
                            Prefer:
                                "return=representation"
                        },
                        body:
                            JSON.stringify(
                                payload
                            )
                    },
                    true
                );
        }


        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }


        state.editingFeatureId = null;

        hide(
            $("featureEditor")
        );

        await loadFeatures();

        alert(
            "Feature saved successfully."
        );

    } catch (error) {

        console.error(error);

        alert(
            "Could not save feature: " +
            error.message
        );
    }
}


/* =========================================================
   EDIT / DELETE SERVICES & FEATURES
   ========================================================= */

document.addEventListener("click", async function (event) {

    const editService =
        event.target.closest(
            ".edit-service-button"
        );

    const deleteService =
        event.target.closest(
            ".delete-service-button"
        );

    const editFeature =
        event.target.closest(
            ".edit-feature-button"
        );

    const deleteFeature =
        event.target.closest(
            ".delete-feature-button"
        );


    /* ---------- EDIT SERVICE ---------- */

    if (editService) {

        const id =
            editService.dataset.id;

        const service =
            state.services.find(
                item =>
                    String(item.id) ===
                    String(id)
            );

        if (!service) return;

        state.editingServiceId =
            service.id;

        $("serviceTitle").value =
            service.title || "";

        $("serviceDescription").value =
            service.description || "";

        $("serviceIcon").value =
            service.icon || "";

        $("serviceOrder").value =
            service.display_order || 0;

        show(
            $("serviceEditor")
        );

        return;
    }


    /* ---------- DELETE SERVICE ---------- */

    if (deleteService) {

        const id =
            deleteService.dataset.id;

        if (!confirm(
            "Are you sure you want to delete this service?"
        )) {
            return;
        }

        if (!(await ensureAdminSession())) {
            alert(
                "Admin session expired. Please log in again."
            );

            return;
        }

        try {

            const response =
                await supabaseFetch(
                    `/rest/v1/services?id=eq.${id}`,
                    {
                        method: "DELETE"
                    },
                    true
                );

            if (!response.ok) {
                throw new Error(
                    await response.text()
                );
            }

            await loadServices();

            alert(
                "Service deleted successfully."
            );

        } catch (error) {

            console.error(error);

            alert(
                "Could not delete service: " +
                error.message
            );
        }

        return;
    }


    /* ---------- EDIT FEATURE ---------- */

    if (editFeature) {

        const id =
            editFeature.dataset.id;

        const feature =
            state.features.find(
                item =>
                    String(item.id) ===
                    String(id)
            );

        if (!feature) return;

        state.editingFeatureId =
            feature.id;

        $("featureTitle").value =
            feature.title || "";

        $("featureDescription").value =
            feature.description || "";

        $("featureIcon").value =
            feature.icon || "";

        $("featureOrder").value =
            feature.display_order || 0;

        show(
            $("featureEditor")
        );

        return;
    }


    /* ---------- DELETE FEATURE ---------- */

    if (deleteFeature) {

        const id =
            deleteFeature.dataset.id;

        if (!confirm(
            "Are you sure you want to delete this feature?"
        )) {
            return;
        }

        if (!(await ensureAdminSession())) {
            alert(
                "Admin session expired. Please log in again."
            );

            return;
        }

        try {

            const response =
                await supabaseFetch(
                    `/rest/v1/features?id=eq.${id}`,
                    {
                        method: "DELETE"
                    },
                    true
                );

            if (!response.ok) {
                throw new Error(
                    await response.text()
                );
            }

            await loadFeatures();

            alert(
                "Feature deleted successfully."
            );

        } catch (error) {

            console.error(error);

            alert(
                "Could not delete feature: " +
                error.message
            );
        }

        return;
    }

});


/* =========================================================
   ADMIN MESSAGES
   ========================================================= */

async function loadAdminMessages() {

    const dashboard =
        $("dashboardModal");

    if (!dashboard) return;

    if (!isAdmin()) return;

    if (!(await ensureAdminSession())) {
        return;
    }

    let section =
        dashboard.querySelector(
            ".admin-messages-section"
        );

    if (!section) {

        section =
            document.createElement("section");

        section.className =
            "admin-messages-section";

        section.innerHTML = `
            <div class="management-section-header">
                <h2>Visitor Messages</h2>
            </div>

            <div id="adminMessagesList"></div>
        `;

        const management =
            dashboard.querySelector(
                ".management-panel"
            );

        if (management) {
            management.after(section);
        } else {
            dashboard.appendChild(section);
        }
    }


    const container =
        $("adminMessagesList");

    if (!container) return;


    try {

        const response =
            await supabaseFetch(
                "/rest/v1/message?select=*&order=created_at.desc",
                {},
                true
            );

        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }

        const messages =
            await response.json();


        if (!messages.length) {

            container.innerHTML =
                "<p>No messages available.</p>";

            return;
        }


        container.innerHTML =
            messages.map(message => {

                return `
                    <div class="admin-message-item">

                        <div>
                            <strong>
                                ${escapeHTML(
                                    message.name || ""
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    message.email || ""
                                )}
                                -
                                ${formatDate(
                                    message.created_at
                                )}
                            </small>

                            <p>
                                ${escapeHTML(
                                    message.message || ""
                                )}
                            </p>
                        </div>

                        <button
                            type="button"
                            class="delete-message-button"
                            data-id="${message.id}">
                            Delete
                        </button>

                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "Messages loading error:",
            error
        );

        container.innerHTML =
            "<p>Unable to load messages.</p>";
    }
}


document.addEventListener("click", async function (event) {

    const button =
        event.target.closest(
            ".delete-message-button"
        );

    if (!button) return;

    const id =
        button.dataset.id;

    if (!confirm(
        "Are you sure you want to delete this message?"
    )) {
        return;
    }

    if (!(await ensureAdminSession())) {
        alert(
            "Admin session expired. Please log in again."
        );

        return;
    }

    try {

        const response =
            await supabaseFetch(
                `/rest/v1/message?id=eq.${id}`,
                {
                    method: "DELETE"
                },
                true
            );

        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }

        await loadAdminMessages();

        alert(
            "Message deleted successfully."
        );

    } catch (error) {

        console.error(error);

        alert(
            "Could not delete message: " +
            error.message
        );
    }
});


/* =========================================================
   LOGOUT
   ========================================================= */

document.addEventListener("click", function (event) {

    const logout =
        event.target.closest(
            "#logoutButton"
        );

    if (!logout) return;

    event.preventDefault();

    state.session = null;
    state.editingId = null;
    state.editingServiceId = null;
    state.editingFeatureId = null;

    localStorage.removeItem(
        "danielTechSession"
    );

    closeAllModals();

    alert(
        "You have been logged out."
    );
});


/* =========================================================
   BACK TO TOP
   ========================================================= */

document.addEventListener("click", function (event) {

    const button =
        event.target.closest(
            "#backToTop, .back-to-top"
        );

    if (!button) return;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


window.addEventListener("scroll", function () {

    const button =
        $("backToTop");

    if (!button) return;

    if (window.scrollY > 400) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
});


/* =========================================================
   PROTECT DASHBOARD
   ========================================================= */

function protectDashboard() {

    const dashboard =
        $("dashboardModal");

    if (!dashboard) return;

    if (!isAdmin()) {
        hide(dashboard);
    }
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        restoreDarkMode();

        setupAbout();

        loadComments();

        navigateTo("home");

        await restoreAdminSession();

        protectDashboard();

        await loadContents();

        await loadServices();

        await loadFeatures();

        if (isAdmin()) {
            createManagementPanel();

            renderAdminContent();

            renderAdminServices();

            renderAdminFeatures();
        }

        console.log(
            "Daniel Tech initialized successfully."
        );
    }
);
