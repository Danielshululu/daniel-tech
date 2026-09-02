/* =========================================================
   DANIEL TECH - MAIN JAVASCRIPT
   ========================================================= */

const SUPABASE_URL =
    "https://bodprzntcloioncwhpvr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";

const ADMIN_UID =
    "05fef3eb-16a3-4554-9d9b-de7d2b29144b";

const STORAGE_BUCKET =
    "daniel-files";


/* =========================================================
   STATE
   ========================================================= */

const state = {
    session: null,
    contents: [],
    editingId: null
};


/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function show(element) {
    if (!element) return;
    element.classList.add("active");
    element.style.display = "flex";
}

function hide(element) {
    if (!element) return;
    element.classList.remove("active");
    element.style.display = "none";
}

function escapeHTML(value) {
    return String(value || "")
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

function getHeaders(token = null) {
    const headers = {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}


/* =========================================================
   OVERLAY
   ========================================================= */

function openOverlay() {
    const overlay = $("overlay");
    if (overlay) {
        overlay.classList.add("active");
        overlay.style.display = "block";
    }
}

function closeOverlay() {
    const overlay = $("overlay");
    if (overlay) {
        overlay.classList.remove("active");
        overlay.style.display = "none";
    }
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function navigateTo(pageName) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const target = $(pageName);

    if (target) {
        target.classList.add("active-page");
    }

    document.querySelectorAll("[data-page]").forEach(link => {
        link.classList.remove("active");
    });

    document.querySelectorAll(`[data-page="${pageName}"]`).forEach(link => {
        link.classList.add("active");
    });

    const mainNav = $("mainNav");

    if (mainNav) {
        mainNav.classList.remove("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.addEventListener("click", function (event) {
    const pageButton = event.target.closest("[data-page]");

    if (!pageButton) return;

    event.preventDefault();

    const page = pageButton.getAttribute("data-page");

    if (page) {
        navigateTo(page);
    }
});


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuButton = $("menuButton");

if (menuButton) {
    menuButton.addEventListener("click", function () {
        const mainNav = $("mainNav");

        if (!mainNav) return;

        mainNav.classList.toggle("active");
    });
}


/* =========================================================
   DARK MODE
   ========================================================= */

function setDarkMode(enabled) {
    document.body.classList.toggle("dark-mode", enabled);

    localStorage.setItem(
        "danielTechDarkMode",
        enabled ? "true" : "false"
    );

    const settingsToggle = $("settingsDarkMode");

    if (settingsToggle) {
        settingsToggle.checked = enabled;
    }
}

function restoreDarkMode() {
    const saved = localStorage.getItem("danielTechDarkMode");

    const enabled = saved === "true";

    setDarkMode(enabled);
}

const darkModeButton = $("darkModeButton");

if (darkModeButton) {
    darkModeButton.addEventListener("click", function () {
        const enabled =
            !document.body.classList.contains("dark-mode");

        setDarkMode(enabled);
    });
}


/* =========================================================
   SETTINGS
   ========================================================= */

function openSettings() {
    const panel = $("settingsPanel");

    if (!panel) return;

    panel.classList.add("active");
    panel.style.display = "block";

    openOverlay();
}

function closeSettings() {
    const panel = $("settingsPanel");

    if (!panel) return;

    panel.classList.remove("active");
    panel.style.display = "none";

    closeOverlay();
}

const settingsButton = $("settingsButton");

if (settingsButton) {
    settingsButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        openSettings();
    });
}

const closeSettingsButton = $("closeSettings");

if (closeSettingsButton) {
    closeSettingsButton.addEventListener("click", function () {
        closeSettings();
    });
}

const settingsDarkMode = $("settingsDarkMode");

if (settingsDarkMode) {
    settingsDarkMode.addEventListener("change", function () {
        setDarkMode(this.checked);
    });
}

const overlay = $("overlay");

if (overlay) {
    overlay.addEventListener("click", function () {
        closeSettings();
        closeAllModals();
    });
}


/* =========================================================
   ABOUT
   ========================================================= */

function openAbout() {
    closeSettings();

    const modal = $("aboutModal");

    if (!modal) return;

    show(modal);
    openOverlay();
}

const aboutButton = $("aboutButton");

if (aboutButton) {
    aboutButton.addEventListener("click", function () {
        openAbout();
    });
}


/* =========================================================
   SERVICE DATA
   ========================================================= */

const serviceData = {
    web: {
        title: "Web Development",
        text:
            "Modern, responsive and professional websites for businesses, organizations and personal projects."
    },

    graphics: {
        title: "Graphics Design",
        text:
            "Professional digital designs for logos, posters, social media and other creative projects."
    },

    security: {
        title: "Cyber Security",
        text:
            "Technology security guidance, digital safety awareness and basic cybersecurity solutions."
    },

    computer: {
        title: "Computer Services",
        text:
            "Computer setup, software installation, troubleshooting and general ICT support."
    },

    software: {
        title: "Software Solutions",
        text:
            "Software solutions and digital tools designed to make everyday work easier."
    },

    ai: {
        title: "AI Solutions",
        text:
            "Practical use of artificial intelligence tools for learning, productivity and digital projects."
    }
};


document.querySelectorAll(".service-view-button").forEach(button => {
    button.addEventListener("click", function () {
        const key = this.dataset.service;
        const data = serviceData[key];

        if (!data) return;

        $("serviceModalTitle").textContent = data.title;
        $("serviceModalText").textContent = data.text;

        show($("serviceModal"));
        openOverlay();
    });
});


/* =========================================================
   FEATURE DATA
   ========================================================= */

const featureData = {
    "computer-tips": {
        title: "Computer Tips",
        text:
            "Learn useful computer tricks, maintenance tips and productivity techniques."
    },

    "phone-tips": {
        title: "Phone Tips",
        text:
            "Discover useful smartphone settings, troubleshooting methods and practical tips."
    },

    "ai-tools": {
        title: "AI Tools",
        text:
            "Learn about useful artificial intelligence tools and how they can improve productivity."
    },

    gaming: {
        title: "Gaming",
        text:
            "Gaming tips, software information, performance improvements and guides."
    },

    programming: {
        title: "Programming",
        text:
            "Programming concepts, coding tutorials and useful development resources."
    },

    "software-tips": {
        title: "Software Tips",
        text:
            "Guides for installing, configuring and using useful computer software."
    }
};


document.querySelectorAll(".feature-view-button").forEach(button => {
    button.addEventListener("click", function () {
        const key = this.dataset.feature;
        const data = featureData[key];

        if (!data) return;

        $("featureModalTitle").textContent = data.title;
        $("featureModalText").textContent = data.text;

        show($("featureModal"));
        openOverlay();
    });
});


/* =========================================================
   MODALS
   ========================================================= */

function closeAllModals() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("active");
        modal.style.display = "none";
    });

    closeOverlay();
}

document.querySelectorAll("[data-close-modal]").forEach(button => {
    button.addEventListener("click", function () {
        const modalId = this.dataset.closeModal;

        const modal = $(modalId);

        if (modal) {
            hide(modal);
        }

        closeOverlay();
    });
});


document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeSettings();
        closeAllModals();
    }
});


/* =========================================================
   CONTENT MEDIA
   ========================================================= */

function createMedia(content) {
    if (!content.file_url) return "";

    const url = escapeHTML(content.file_url);
    const fileName = escapeHTML(content.file_name || "File");
    const fileType = String(content.file_type || "").toLowerCase();

    if (fileType.startsWith("image/")) {
        return `
            <div class="content-media">
                <img src="${url}" alt="${fileName}" loading="lazy">
            </div>
        `;
    }

    if (fileType.startsWith("video/")) {
        return `
            <div class="content-media">
                <video controls preload="metadata">
                    <source src="${url}" type="${fileType}">
                </video>
            </div>
        `;
    }

    if (fileType.startsWith("audio/")) {
        return `
            <div class="content-media">
                <audio controls preload="metadata">
                    <source src="${url}" type="${fileType}">
                </audio>
            </div>
        `;
    }

    return `
        <div class="content-file">
            <a href="${url}" target="_blank" rel="noopener noreferrer">
                Open ${fileName}
            </a>
        </div>
    `;
}


/* =========================================================
   LOAD CONTENT
   ========================================================= */

async function loadContents() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/contents?select=*&order=created_at.desc`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load content.");
        }

        const data = await response.json();

        state.contents = Array.isArray(data) ? data : [];

        renderLatestContent();
        renderBlog();
        updateNewsBar();

        if (state.session) {
            renderAdminContent();
        }

    } catch (error) {
        console.error("Content loading error:", error);
    }
}


/* =========================================================
   LATEST CONTENT
   ========================================================= */

function renderLatestContent() {
    const container = $("latestContent");

    if (!container) return;

    if (!state.contents.length) {
        container.innerHTML = `
            <div class="empty-content">
                No content has been published yet.
            </div>
        `;
        return;
    }

    container.innerHTML = state.contents
        .slice(0, 6)
        .map(content => `
            <article class="content-card">
                <div class="content-card-body">

                    <small>
                        ${escapeHTML(content.category || "Content")}
                        ${content.created_at ? " • " + formatDate(content.created_at) : ""}
                    </small>

                    <h3>
                        ${escapeHTML(content.title)}
                    </h3>

                    <p>
                        ${escapeHTML(content.content_text || "")}
                    </p>

                    ${createMedia(content)}

                </div>
            </article>
        `)
        .join("");
}


/* =========================================================
   BLOG
   ========================================================= */

function renderBlog() {
    const container = $("blogGrid");

    if (!container) return;

    const blogs = state.contents.filter(item =>
        ["blog", "news", "tip"].includes(
            String(item.category || "").toLowerCase()
        )
    );

    if (!blogs.length) {
        container.innerHTML = `
            <div class="empty-content">
                No blog content has been published yet.
            </div>
        `;
        return;
    }

    container.innerHTML = blogs
        .map(content => `
            <article class="blog-card">

                <div class="blog-card-content">

                    <small>
                        ${escapeHTML(content.category || "Blog")}
                        •
                        ${formatDate(content.created_at)}
                    </small>

                    <h3>
                        ${escapeHTML(content.title)}
                    </h3>

                    <p>
                        ${escapeHTML(content.content_text || "")}
                    </p>

                    ${createMedia(content)}

                </div>

            </article>
        `)
        .join("");
}


/* =========================================================
   NEWS BAR
   ========================================================= */

function updateNewsBar() {
    const news = $("newsContent");

    if (!news) return;

    const latest = state.contents[0];

    if (!latest) {
        news.textContent = "Welcome to Daniel Tech.";
        return;
    }

    news.textContent =
        `${latest.title} — ${latest.content_text || "New content available on Daniel Tech."}`;
}


/* =========================================================
   LOCAL COMMENTS
   ========================================================= */

function loadComments() {
    const list = $("commentsList");

    if (!list) return;

    const comments =
        JSON.parse(localStorage.getItem("danielTechComments") || "[]");

    if (!comments.length) {
        list.innerHTML = `
            <p class="empty-content">
                No comments yet.
            </p>
        `;
        return;
    }

    list.innerHTML = comments
        .map(comment => `
            <div class="comment-item">

                <strong>
                    ${escapeHTML(comment.name)}
                </strong>

                <p>
                    ${escapeHTML(comment.text)}
                </p>

                <small>
                    ${escapeHTML(comment.date)}
                </small>

            </div>
        `)
        .join("");
}

const commentForm = $("commentForm");

if (commentForm) {
    commentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = $("commentName").value.trim();
        const text = $("commentText").value.trim();

        if (!name || !text) return;

        const comments =
            JSON.parse(localStorage.getItem("danielTechComments") || "[]");

        comments.unshift({
            name,
            text,
            date: new Date().toLocaleDateString("en-GB")
        });

        localStorage.setItem(
            "danielTechComments",
            JSON.stringify(comments)
        );

        this.reset();

        loadComments();
    });
}


/* =========================================================
   CONTACT FORM
   ========================================================= */

const contactForm = $("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const status = $("contactStatus");

        const name = $("contactName").value.trim();
        const email = $("contactEmail").value.trim();
        const subject = $("contactSubject").value.trim();
        const message = $("contactMessage").value.trim();

        if (!name || !email || !subject || !message) {
            if (status) {
                status.textContent =
                    "Please complete all fields.";
            }

            return;
        }

        if (status) {
            status.textContent = "Sending message...";
        }

        try {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/message`,
                {
                    method: "POST",
                    headers: {
                        ...getHeaders(),
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

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            this.reset();

            if (status) {
                status.textContent =
                    "Your message has been sent successfully.";
            }

        } catch (error) {
            console.error("Contact error:", error);

            if (status) {
                status.textContent =
                    "Unable to send message. Please try again.";
            }
        }
    });
}


/* =========================================================
   ADMIN AUTH
   ========================================================= */

function isAdmin() {
    if (!state.session || !state.session.user) {
        return false;
    }

    const userId =
        String(state.session.user.id || "")
            .trim()
            .toLowerCase();

    return userId === ADMIN_UID.toLowerCase();
}


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

const adminButton = $("adminButton");

if (adminButton) {
    adminButton.addEventListener("click", function () {
        closeSettings();

        if (isAdmin()) {
            openDashboard();
            return;
        }

        show($("adminLoginModal"));
        openOverlay();
    });
}


const adminLoginForm = $("adminLoginForm");

if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const message = $("loginMessage");

        const username =
            $("adminUsername").value.trim();

        const password =
            $("adminPassword").value;

        if (!username || !password) {
            if (message) {
                message.textContent =
                    "Please enter your email and password.";
            }

            return;
        }

        if (message) {
            message.textContent = "Signing in...";
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
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error_description ||
                    data.msg ||
                    "Login failed."
                );
            }

            if (!data.user || !data.access_token) {
                throw new Error("Invalid login response.");
            }

            const returnedUid =
                String(data.user.id || "")
                    .trim()
                    .toLowerCase();

            const allowedUid =
                ADMIN_UID.trim().toLowerCase();

            if (returnedUid !== allowedUid) {

                if (message) {
                    message.textContent =
                        "This account is not authorized as Daniel Tech Admin.";
                }

                return;
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

            if (message) {
                message.textContent =
                    "Login successful.";
            }

            adminLoginForm.reset();

            hide($("adminLoginModal"));
            closeOverlay();

            openDashboard();

            await loadAdminMessages();

        } catch (error) {
            console.error("Admin login error:", error);

            if (message) {
                message.textContent =
                    error.message || "Login failed.";
            }
        }
    });
}


/* =========================================================
   RESTORE ADMIN SESSION
   ========================================================= */

function restoreAdminSession() {
    const saved =
        localStorage.getItem("danielTechSession");

    if (!saved) {
        state.session = null;
        return;
    }

    try {
        const session = JSON.parse(saved);

        if (
            session &&
            session.access_token &&
            session.user &&
            String(session.user.id).toLowerCase() ===
            ADMIN_UID.toLowerCase()
        ) {
            state.session = session;
        } else {
            state.session = null;
            localStorage.removeItem("danielTechSession");
        }

    } catch {
        state.session = null;
        localStorage.removeItem("danielTechSession");
    }
}


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function openDashboard() {

    if (!isAdmin()) {
        show($("adminLoginModal"));
        openOverlay();
        return;
    }

    hide($("adminLoginModal"));

    show($("dashboardModal"));
    openOverlay();

    renderAdminContent();
    loadAdminMessages();
}


function closeDashboard() {
    hide($("dashboardModal"));
    closeOverlay();
}


/* =========================================================
   ADMIN CONTENT BUTTONS
   ========================================================= */

function prepareEditor(category) {
    if (!isAdmin()) return;

    state.editingId = null;

    $("contentTitle").value = "";
    $("contentText").value = "";
    $("contentCategory").value = category;
    $("contentFile").value = "";

    $("contentStatus").textContent =
        `Ready to add ${category}.`;

    $("contentTitle").focus();
}


const addNewsButton = $("addNewsButton");

if (addNewsButton) {
    addNewsButton.addEventListener("click", function () {
        prepareEditor("news");
    });
}


const addTipButton = $("addTipButton");

if (addTipButton) {
    addTipButton.addEventListener("click", function () {
        prepareEditor("tip");
    });
}


const addVideoButton = $("addVideoButton");

if (addVideoButton) {
    addVideoButton.addEventListener("click", function () {
        prepareEditor("video");
    });
}


const addPdfButton = $("addPdfButton");

if (addPdfButton) {
    addPdfButton.addEventListener("click", function () {
        prepareEditor("pdf");
    });
}


/* =========================================================
   FILE UPLOAD
   ========================================================= */

async function uploadFile(file) {

    if (!file) {
        return null;
    }

    if (!isAdmin()) {
        throw new Error("You are not authorized.");
    }

    const extension =
        file.name.includes(".")
            ? file.name.split(".").pop()
            : "file";

    const safeName =
        file.name
            .replace(/[^a-zA-Z0-9._-]/g, "_");

    const path =
        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}-${safeName}`;

    const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`,
        {
            method: "POST",
            headers: {
                Authorization:
                    `Bearer ${state.session.access_token}`,
                apikey: SUPABASE_KEY,
                "Content-Type":
                    file.type || "application/octet-stream"
            },
            body: file
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "File upload failed.");
    }

    const publicUrl =
        `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;

    return {
        url: publicUrl,
        name: file.name,
        type: file.type || "application/octet-stream",
        path
    };
}


/* =========================================================
   SAVE CONTENT
   ========================================================= */

const saveContentButton = $("saveContentButton");

if (saveContentButton) {

    saveContentButton.addEventListener("click", async function () {

        if (!isAdmin()) {
            $("contentStatus").textContent =
                "Admin authorization required.";
            return;
        }

        const title =
            $("contentTitle").value.trim();

        const category =
            $("contentCategory").value;

        const text =
            $("contentText").value.trim();

        const file =
            $("contentFile").files[0];

        const status =
            $("contentStatus");

        if (!title) {
            status.textContent =
                "Please enter a title.";
            return;
        }

        status.textContent =
            "Publishing content...";

        this.disabled = true;

        try {

            let fileInfo = null;

            if (file) {
                status.textContent =
                    "Uploading file...";

                fileInfo = await uploadFile(file);
            }

            const payload = {
                title,
                category,
                content_text: text || null,
                file_url: fileInfo ? fileInfo.url : null,
                file_name: fileInfo ? fileInfo.name : null,
                file_type: fileInfo ? fileInfo.type : null
            };

            let response;

            if (state.editingId) {

                response = await fetch(
                    `${SUPABASE_URL}/rest/v1/contents?id=eq.${state.editingId}`,
                    {
                        method: "PATCH",
                        headers: {
                            ...getHeaders(
                                state.session.access_token
                            ),
                            Prefer: "return=representation"
                        },
                        body: JSON.stringify(payload)
                    }
                );

            } else {

                response = await fetch(
                    `${SUPABASE_URL}/rest/v1/contents`,
                    {
                        method: "POST",
                        headers: {
                            ...getHeaders(
                                state.session.access_token
                            ),
                            Prefer: "return=representation"
                        },
                        body: JSON.stringify(payload)
                    }
                );
            }

            if (!response.ok) {
                const errorText =
                    await response.text();

                throw new Error(
                    errorText || "Unable to publish content."
                );
            }

            status.textContent =
                "Content published successfully.";

            state.editingId = null;

            $("contentTitle").value = "";
            $("contentText").value = "";
            $("contentFile").value = "";

            await loadContents();

            renderAdminContent();

        } catch (error) {

            console.error("Save content error:", error);

            status.textContent =
                error.message || "Unable to publish content.";

        } finally {

            this.disabled = false;
        }
    });
}


/* =========================================================
   ADMIN CONTENT LIST
   ========================================================= */

function renderAdminContent() {

    const container =
        $("adminContentList");

    if (!container) return;

    if (!isAdmin()) {
        container.innerHTML = "";
        return;
    }

    if (!state.contents.length) {

        container.innerHTML = `
            <p class="empty-content">
                No content available.
            </p>
        `;

        return;
    }

    container.innerHTML =
        state.contents
            .map(content => `
                <div class="admin-content-item">

                    <div>
                        <strong>
                            ${escapeHTML(content.title)}
                        </strong>

                        <small>
                            ${escapeHTML(content.category)}
                            •
                            ${formatDate(content.created_at)}
                        </small>
                    </div>

                    <button
                        type="button"
                        class="delete-content-button"
                        data-content-id="${content.id}">
                        Delete
                    </button>

                </div>
            `)
            .join("");
}


document.addEventListener("click", async function (event) {

    const deleteButton =
        event.target.closest(".delete-content-button");

    if (!deleteButton) return;

    if (!isAdmin()) return;

    const id =
        deleteButton.dataset.contentId;

    if (!id) return;

    const confirmed =
        window.confirm(
            "Delete this content?"
        );

    if (!confirmed) return;

    deleteButton.disabled = true;

    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/contents?id=eq.${id}`,
                {
                    method: "DELETE",
                    headers: {
                        ...getHeaders(
                            state.session.access_token
                        ),
                        Prefer: "return=minimal"
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }

        await loadContents();
        renderAdminContent();

    } catch (error) {

        console.error(
            "Delete content error:",
            error
        );

        alert(
            "Unable to delete content."
        );

    } finally {

        deleteButton.disabled = false;
    }
});


/* =========================================================
   ADMIN MESSAGES
   ========================================================= */

async function loadAdminMessages() {

    if (!isAdmin()) return;

    const dashboard =
        $("dashboardModal");

    if (!dashboard) return;

    let section =
        $("adminMessagesSection");

    if (!section) {

        section =
            document.createElement("section");

        section.id =
            "adminMessagesSection";

        section.className =
            "admin-messages-section";

        section.innerHTML = `
            <div class="section-heading small-heading">
                <p>CONTACT</p>
                <h3>Visitor Messages</h3>
                <span>
                    Messages sent through the Daniel Tech contact form.
                </span>
            </div>

            <div
                id="adminMessagesList"
                class="admin-messages-list">
            </div>
        `;

        const logout =
            $("logoutButton");

        if (logout) {
            logout.parentNode.insertBefore(
                section,
                logout
            );
        } else {
            dashboard
                .querySelector(".modal-box")
                .appendChild(section);
        }
    }

    const list =
        $("adminMessagesList");

    if (!list) return;

    list.innerHTML = `
        <p class="empty-content">
            Loading messages...
        </p>
    `;

    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/message?select=*&order=created_at.desc`,
                {
                    method: "GET",
                    headers: getHeaders(
                        state.session.access_token
                    )
                }
            );

        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }

        const messages =
            await response.json();

        if (!messages.length) {

            list.innerHTML = `
                <p class="empty-content">
                    No visitor messages yet.
                </p>
            `;

            return;
        }

        list.innerHTML =
            messages
                .map(message => `
                    <div class="admin-message-item">

                        <div>
                            <strong>
                                ${escapeHTML(message.name)}
                            </strong>

                            <small>
                                ${escapeHTML(message.email)}
                            </small>

                            <small>
                                ${formatDate(message.created_at)}
                            </small>
                        </div>

                        <h4>
                            ${escapeHTML(message.subject)}
                        </h4>

                        <p>
                            ${escapeHTML(message.message)}
                        </p>

                        <button
                            type="button"
                            class="delete-message-button"
                            data-message-id="${message.id}">
                            Delete Message
                        </button>

                    </div>
                `)
                .join("");

    } catch (error) {

        console.error(
            "Load messages error:",
            error
        );

        list.innerHTML = `
            <p class="empty-content">
                Unable to load messages.
            </p>
        `;
    }
}


/* =========================================================
   DELETE MESSAGE
   ========================================================= */

document.addEventListener("click", async function (event) {

    const button =
        event.target.closest(".delete-message-button");

    if (!button) return;

    if (!isAdmin()) return;

    const id =
        button.dataset.messageId;

    if (!id) return;

    const confirmed =
        window.confirm(
            "Delete this visitor message?"
        );

    if (!confirmed) return;

    button.disabled = true;

    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/message?id=eq.${id}`,
                {
                    method: "DELETE",
                    headers: {
                        ...getHeaders(
                            state.session.access_token
                        ),
                        Prefer: "return=minimal"
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }

        await loadAdminMessages();

    } catch (error) {

        console.error(
            "Delete message error:",
            error
        );

        alert(
            "Unable to delete message."
        );

    } finally {

        button.disabled = false;
    }
});


/* =========================================================
   LOGOUT
   ========================================================= */

const logoutButton = $("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            state.session = null;

            localStorage.removeItem(
                "danielTechSession"
            );

            closeDashboard();

            $("loginMessage").textContent = "";

            alert(
                "You have been logged out."
            );
        }
    );
}


/* =========================================================
   BACK TO TOP
   ========================================================= */

const backTop = $("backTop");

if (backTop) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 400) {
            backTop.classList.add("active");
        } else {
            backTop.classList.remove("active");
        }

    });

    backTop.addEventListener(
        "click",
        function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );
}


/* =========================================================
   PREVENT CLIENT ACCESS TO DASHBOARD
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

        restoreAdminSession();

        loadComments();

        protectDashboard();

        navigateTo("home");

        await loadContents();

        if (isAdmin()) {
            renderAdminContent();
        }

    }
);
