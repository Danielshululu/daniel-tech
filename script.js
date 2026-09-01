const SUPABASE_URL =
    "https://bodprzntcloioncwhpvr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";

const ADMIN_UID =
    "05fef3eb-16a3-4554-9d9b-de7d2b29144b";

const STORAGE_BUCKET =
    "daniel-files";

const state = {
    session: null,
    contents: [],
    editingId: null
};

const $ = (id) => document.getElementById(id);

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function show(element) {
    if (element) element.classList.add("show");
}

function hide(element) {
    if (element) element.classList.remove("show");
}

function formatDate(date) {
    if (!date) return "";
    
    return new Date(date).toLocaleDateString("en-TZ", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

/* =========================
   NAVIGATION
========================= */

document.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const page = link.getAttribute("data-page");

        document.querySelectorAll(".page").forEach((section) => {
            section.classList.remove("active");
        });

        const target = document.getElementById(page);

        if (target) {
            target.classList.add("active");
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        $("mainMenu")?.classList.remove("open");
    });
});

/* =========================
   MOBILE MENU
========================= */

$("menuButton")?.addEventListener("click", () => {
    $("mainMenu")?.classList.toggle("open");
});

/* =========================
   DARK MODE
========================= */

function applyDarkMode(enabled) {
    document.body.classList.toggle("dark-mode", enabled);

    localStorage.setItem(
        "danielTechDarkMode",
        enabled ? "true" : "false"
    );

    if ($("settingsDarkMode")) {
        $("settingsDarkMode").checked = enabled;
    }
}

const savedDarkMode =
    localStorage.getItem("danielTechDarkMode") === "true";

applyDarkMode(savedDarkMode);

$("darkModeButton")?.addEventListener("click", () => {
    applyDarkMode(!document.body.classList.contains("dark-mode"));
});

$("settingsDarkMode")?.addEventListener("change", (event) => {
    applyDarkMode(event.target.checked);
});

/* =========================
   SETTINGS
========================= */

$("settingsButton")?.addEventListener("click", () => {
    show($("settingsPanel"));
    show($("overlay"));
});

$("closeSettings")?.addEventListener("click", () => {
    hide($("settingsPanel"));
    hide($("overlay"));
});

$("overlay")?.addEventListener("click", () => {
    hide($("settingsPanel"));
    hide($("aboutModal"));
    hide($("serviceModal"));
    hide($("featureModal"));
    hide($("adminLoginModal"));
    hide($("dashboardModal"));
    hide($("overlay"));
});

/* =========================
   ABOUT
========================= */

$("aboutButton")?.addEventListener("click", () => {
    hide($("settingsPanel"));
    show($("aboutModal"));
    show($("overlay"));
});

$("aboutModal")?.querySelector(".close-modal")?.addEventListener("click", () => {
    hide($("aboutModal"));
    hide($("overlay"));
});

/* =========================
   SERVICES
========================= */

const serviceData = {
    "Web Development": {
        title: "Web Development",
        text: "Professional websites and web applications designed for businesses, organizations, schools and personal projects."
    },

    "Graphics Design": {
        title: "Graphics Design",
        text: "Creative graphics, posters, logos, social media designs and other digital designs."
    },

    "Cyber Security": {
        title: "Cyber Security",
        text: "Basic cybersecurity guidance, security awareness and protection of digital accounts and systems."
    },

    "Computer Services": {
        title: "Computer Services",
        text: "Computer setup, software installation, troubleshooting, maintenance and technical support."
    },

    "Software Solutions": {
        title: "Software Solutions",
        text: "Useful software solutions and digital tools designed to simplify everyday work."
    },

    "AI Solutions": {
        title: "AI Solutions",
        text: "Information and practical solutions using modern artificial intelligence tools."
    }
};

document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => {
        const title =
            card.dataset.service ||
            card.querySelector("h3")?.textContent.trim();

        const service = serviceData[title];

        if (!service) return;

        $("serviceModalTitle").textContent = service.title;
        $("serviceModalText").textContent = service.text;

        show($("serviceModal"));
        show($("overlay"));
    });
});

$("serviceModal")?.querySelector(".close-modal")?.addEventListener("click", () => {
    hide($("serviceModal"));
    hide($("overlay"));
});

/* =========================
   FEATURES
========================= */

const featureData = {
    "Computer Tips":
        "Useful computer tips, shortcuts, maintenance advice and troubleshooting information.",

    "Phone Tips":
        "Practical smartphone tips, settings, security advice and useful tricks.",

    "AI Tools":
        "Discover useful AI tools and learn how they can help with work, study and creativity.",

    "Gaming":
        "Gaming information, tips, software and useful resources for gamers.",

    "Programming":
        "Programming tutorials, coding tips and resources for beginners and developers.",

    "Software Tips":
        "Helpful software guides, installation information and practical computer solutions."
};

document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("click", () => {
        const title =
            card.dataset.feature ||
            card.querySelector("h3")?.textContent.trim();

        const text = featureData[title];

        if (!text) return;

        $("featureModalTitle").textContent = title;
        $("featureModalText").textContent = text;

        show($("featureModal"));
        show($("overlay"));
    });
});

$("featureModal")?.querySelector(".close-modal")?.addEventListener("click", () => {
    hide($("featureModal"));
    hide($("overlay"));
});

/* =========================
   CONTENT MEDIA
========================= */

function createMedia(content) {
    if (!content.file_url) return "";

    const url = escapeHTML(content.file_url);
    const fileType = content.file_type || "";

    if (fileType.startsWith("image/")) {
        return `
            <div class="content-media">
                <img src="${url}" alt="${escapeHTML(content.title)}">
            </div>
        `;
    }

    if (fileType.startsWith("audio/")) {
        return `
            <div class="content-media">
                <audio controls>
                    <source src="${url}" type="${escapeHTML(fileType)}">
                </audio>
            </div>
        `;
    }

    if (fileType.startsWith("video/")) {
        return `
            <div class="content-media">
                <video controls>
                    <source src="${url}" type="${escapeHTML(fileType)}">
                </video>
            </div>
        `;
    }

    return `
        <div class="content-file">
            <a href="${url}" target="_blank" rel="noopener">
                Open ${escapeHTML(content.file_name || "file")}
            </a>
        </div>
    `;
}

/* =========================
   LOAD CONTENTS
========================= */

async function loadContents() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/contents?select=*&order=created_at.desc`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Could not load contents");
        }

        state.contents = await response.json();

        renderLatestContent();
        renderBlog();
        renderAdminContents();

        updateNewsBar();

    } catch (error) {
        console.error(error);
    }
}

/* =========================
   LATEST CONTENT
========================= */

function renderLatestContent() {
    const container = $("latestContent");

    if (!container) return;

    const latest = state.contents.slice(0, 3);

    if (!latest.length) {
        container.innerHTML = `
            <p>No content has been published yet.</p>
        `;
        return;
    }

    container.innerHTML = latest.map((item) => `
        <article class="content-card">
            <span class="content-category">
                ${escapeHTML(item.category)}
            </span>

            <h3>${escapeHTML(item.title)}</h3>

            <p>
                ${escapeHTML(item.content_text || "")}
            </p>

            ${createMedia(item)}

            <small>
                ${formatDate(item.created_at)}
            </small>
        </article>
    `).join("");
}

/* =========================
   BLOG
========================= */

function renderBlog() {
    const container = $("blogGrid");

    if (!container) return;

    const blogItems = state.contents.filter(
        (item) =>
            item.category.toLowerCase() === "news" ||
            item.category.toLowerCase() === "tip" ||
            item.category.toLowerCase() === "blog"
    );

    if (!blogItems.length) {
        container.innerHTML = `
            <p>No blog or news content available yet.</p>
        `;
        return;
    }

    container.innerHTML = blogItems.map((item) => `
        <article class="blog-card">
            <span class="content-category">
                ${escapeHTML(item.category)}
            </span>

            <h3>${escapeHTML(item.title)}</h3>

            <p>
                ${escapeHTML(item.content_text || "")}
            </p>

            ${createMedia(item)}

            <small>
                ${formatDate(item.created_at)}
            </small>
        </article>
    `).join("");
}

/* =========================
   NEWS BAR
========================= */

function updateNewsBar() {
    const news = $("newsContent");

    if (!news) return;

    const latest = state.contents[0];

    if (!latest) {
        news.textContent = "Welcome to Daniel Tech";
        return;
    }

    news.textContent =
        `${latest.category}: ${latest.title}`;
}

/* =========================
   COMMENTS
========================= */

function loadComments() {
    const comments = JSON.parse(
        localStorage.getItem("danielTechComments") || "[]"
    );

    const container = $("commentsList");

    if (!container) return;

    if (!comments.length) {
        container.innerHTML = "<p>No comments yet.</p>";
        return;
    }

    container.innerHTML = comments.map((comment) => `
        <div class="comment-item">
            <strong>${escapeHTML(comment.name)}</strong>
            <p>${escapeHTML(comment.text)}</p>
            <small>${escapeHTML(comment.date)}</small>
        </div>
    `).join("");
}

$("commentForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("commentName")?.value.trim();
    const text = $("commentText")?.value.trim();

    if (!name || !text) return;

    const comments = JSON.parse(
        localStorage.getItem("danielTechComments") || "[]"
    );

    comments.unshift({
        name,
        text,
        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "danielTechComments",
        JSON.stringify(comments)
    );

    event.target.reset();

    loadComments();
});

loadComments();

/* =========================
   CONTACT FORM
========================= */

$("contactForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = $("contactStatus");

    const name = $("contactName")?.value.trim();
    const email = $("contactEmail")?.value.trim();
    const subject = $("contactSubject")?.value.trim();
    const message = $("contactMessage")?.value.trim();

    if (!name || !email || !subject || !message) {
        if (status) {
            status.textContent = "Please fill in all fields.";
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
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
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
            throw new Error("Message could not be sent");
        }

        event.target.reset();

        if (status) {
            status.textContent =
                "Your message has been sent successfully.";
        }

    } catch (error) {
        console.error(error);

        if (status) {
            status.textContent =
                "There was a problem sending your message.";
        }
    }
});

/* =========================
   ADMIN LOGIN
========================= */

$("adminButton")?.addEventListener("click", () => {
    hide($("settingsPanel"));

    show($("adminLoginModal"));
    show($("overlay"));
});

$("adminLoginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = $("adminUsername")?.value.trim();
    const password = $("adminPassword")?.value;

    const message = $("loginMessage");

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
                "Login failed"
            );
        }

        if (!data.user || data.user.id !== ADMIN_UID) {
            if (message) {
                message.textContent =
                    "This account is not authorized as Daniel Tech Admin.";
            }

            return;
        }

        state.session = data;

        localStorage.setItem(
            "danielTechSession",
            JSON.stringify(data)
        );

        hide($("adminLoginModal"));
        show($("dashboardModal"));

        hide($("overlay"));

        setupAdminDashboard();

    } catch (error) {
        console.error(error);

        if (message) {
            message.textContent =
                error.message ||
                "Login failed.";
        }
    }
});

/* =========================
   RESTORE ADMIN SESSION
========================= */

function restoreAdminSession() {
    const saved =
        localStorage.getItem("danielTechSession");

    if (!saved) return;

    try {
        const session = JSON.parse(saved);

        if (
            session?.user?.id === ADMIN_UID &&
            session?.access_token
        ) {
            state.session = session;
        } else {
            localStorage.removeItem("danielTechSession");
        }

    } catch {
        localStorage.removeItem("danielTechSession");
    }
}

/* =========================
   ADMIN DASHBOARD
========================= */

function setupAdminDashboard() {
    if (!state.session) return;

    loadAdminMessages();
    renderAdminContents();
}

$("addNewsButton")?.addEventListener("click", () => {
    openEditor("News");
});

$("addTipButton")?.addEventListener("click", () => {
    openEditor("Tip");
});

$("addVideoButton")?.addEventListener("click", () => {
    openEditor("Video");
});

$("addPdfButton")?.addEventListener("click", () => {
    openEditor("PDF");
});

function openEditor(category) {
    state.editingId = null;

    if ($("contentTitle")) {
        $("contentTitle").value = "";
    }

    if ($("contentText")) {
        $("contentText").value = "";
    }

    if ($("contentCategory")) {
        $("contentCategory").value = category;
    }

    if ($("contentFile")) {
        $("contentFile").value = "";
    }

    if ($("contentStatus")) {
        $("contentStatus").textContent =
            `Ready to add ${category}.`;
    }

    show($("adminEditor"));
}

$("saveContentButton")?.addEventListener("click", saveContent);

/* =========================
   SAVE CONTENT
========================= */

async function saveContent() {
    if (!state.session?.access_token) {
        return;
    }

    const title =
        $("contentTitle")?.value.trim();

    const category =
        $("contentCategory")?.value.trim();

    const contentText =
        $("contentText")?.value.trim();

    const file =
        $("contentFile")?.files?.[0];

    const status =
        $("contentStatus");

    if (!title || !category) {
        if (status) {
            status.textContent =
                "Please enter a title and category.";
        }

        return;
    }

    if (status) {
        status.textContent = "Saving content...";
    }

    let fileUrl = null;
    let fileName = null;
    let fileType = null;

    try {
        if (file) {
            const safeName =
                file.name.replace(
                    /[^a-zA-Z0-9._-]/g,
                    "_"
                );

            const filePath =
                `${Date.now()}-${safeName}`;

            const uploadResponse =
                await fetch(
                    `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${encodeURIComponent(filePath)}`,
                    {
                        method: "POST",

                        headers: {
                            apikey: SUPABASE_KEY,
                            Authorization:
                                `Bearer ${state.session.access_token}`,
                            "Content-Type":
                                file.type ||
                                "application/octet-stream"
                        },

                        body: file
                    }
                );

            if (!uploadResponse.ok) {
                const uploadError =
                    await uploadResponse.text();

                throw new Error(
                    uploadError ||
                    "File upload failed"
                );
            }

            fileUrl =
                `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${encodeURIComponent(filePath)}`;

            fileName = file.name;
            fileType = file.type;
        }

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/contents`,
                {
                    method: "POST",

                    headers: {
                        apikey: SUPABASE_KEY,
                        Authorization:
                            `Bearer ${state.session.access_token}`,
                        "Content-Type":
                            "application/json",
                        Prefer:
                            "return=representation"
                    },

                    body: JSON.stringify({
                        title,
                        category,
                        content_text: contentText || null,
                        file_url: fileUrl,
                        file_name: fileName,
                        file_type: fileType
                    })
                }
            );

        if (!response.ok) {
            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Content could not be published"
            );
        }

        if (status) {
            status.textContent =
                "Content published successfully.";
        }

        $("contentTitle").value = "";
        $("contentText").value = "";
        $("contentFile").value = "";

        await loadContents();

    } catch (error) {
        console.error(error);

        if (status) {
            status.textContent =
                error.message ||
                "There was a problem saving the content.";
        }
    }
}

/* =========================
   ADMIN CONTENT LIST
========================= */

function renderAdminContents() {
    const container =
        $("adminContentList");

    if (!container) return;

    if (!state.contents.length) {
        container.innerHTML =
            "<p>No published content.</p>";

        return;
    }

    container.innerHTML =
        state.contents.map((item) => `
            <div class="admin-content-item">

                <div>
                    <strong>
                        ${escapeHTML(item.title)}
                    </strong>

                    <span>
                        ${escapeHTML(item.category)}
                    </span>

                    <small>
                        ${formatDate(item.created_at)}
                    </small>
                </div>

                <button
                    type="button"
                    class="delete-content-button"
                    data-id="${escapeHTML(item.id)}"
                >
                    Delete
                </button>

            </div>
        `).join("");

    container
        .querySelectorAll(".delete-content-button")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const id = button.dataset.id;

                deleteContent(id);
            });
        });
}

/* =========================
   DELETE CONTENT
========================= */

async function deleteContent(id) {
    if (!state.session?.access_token) {
        return;
    }

    const item =
        state.contents.find(
            (content) =>
                String(content.id) === String(id)
        );

    const confirmed =
        window.confirm(
            "Delete this content?"
        );

    if (!confirmed) return;

    try {
        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/contents?id=eq.${encodeURIComponent(id)}`,
                {
                    method: "DELETE",

                    headers: {
                        apikey: SUPABASE_KEY,
                        Authorization:
                            `Bearer ${state.session.access_token}`
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                "Could not delete content"
            );
        }

        if (item?.file_url) {
            try {
                const publicPart =
                    `/storage/v1/object/public/${STORAGE_BUCKET}/`;

                const index =
                    item.file_url.indexOf(publicPart);

                if (index !== -1) {
                    const filePath =
                        decodeURIComponent(
                            item.file_url.substring(
                                index + publicPart.length
                            )
                        );

                    await fetch(
                        `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}`,
                        {
                            method: "DELETE",

                            headers: {
                                apikey: SUPABASE_KEY,
                                Authorization:
                                    `Bearer ${state.session.access_token}`,
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                prefixes: [filePath]
                            })
                        }
                    );
                }

            } catch (fileError) {
                console.error(fileError);
            }
        }

        await loadContents();

    } catch (error) {
        console.error(error);

        alert(
            "There was a problem deleting the content."
        );
    }
}

/* =========================
   VISITOR MESSAGES
========================= */

async function loadAdminMessages() {
    if (!state.session?.access_token) {
        return;
    }

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
            <h3>Visitor Messages</h3>

            <div
                id="adminMessagesList"
                class="admin-messages-list"
            >
                Loading messages...
            </div>
        `;

        $("logoutButton")
            ?.parentElement
            ?.insertBefore(
                section,
                $("logoutButton")
            );
    }

    const list =
        $("adminMessagesList");

    try {
        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/message?select=*&order=created_at.desc`,
                {
                    headers: {
                        apikey: SUPABASE_KEY,
                        Authorization:
                            `Bearer ${state.session.access_token}`
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                "Could not load messages"
            );
        }

        const messages =
            await response.json();

        if (!messages.length) {
            list.innerHTML =
                "<p>No visitor messages yet.</p>";

            return;
        }

        list.innerHTML =
            messages.map((item) => `
                <div
                    class="admin-message-item"
                    data-message-id="${escapeHTML(item.id)}"
                >

                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <div>
                        <small>
                            ${escapeHTML(item.email)}
                        </small>
                    </div>

                    <h4>
                        ${escapeHTML(item.subject)}
                    </h4>

                    <p>
                        ${escapeHTML(item.message)}
                    </p>

                    <small>
                        ${formatDate(item.created_at)}
                    </small>

                    <br>

                    <button
                        type="button"
                        class="delete-message-button"
                        data-id="${escapeHTML(item.id)}"
                    >
                        Delete
                    </button>

                </div>
            `).join("");

        list
            .querySelectorAll(".delete-message-button")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        deleteMessage(
                            button.dataset.id
                        );
                    }
                );
            });

    } catch (error) {
        console.error(error);

        list.innerHTML =
            "<p>Unable to load visitor messages.</p>";
    }
}

/* =========================
   DELETE MESSAGE
========================= */

async function deleteMessage(id) {
    if (!state.session?.access_token) {
        return;
    }

    const confirmed =
        window.confirm(
            "Delete this visitor message?"
        );

    if (!confirmed) return;

    try {
        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/message?id=eq.${encodeURIComponent(id)}`,
                {
                    method: "DELETE",

                    headers: {
                        apikey: SUPABASE_KEY,
                        Authorization:
                            `Bearer ${state.session.access_token}`
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                "Could not delete message"
            );
        }

        await loadAdminMessages();

    } catch (error) {
        console.error(error);

        alert(
            "There was a problem deleting the message."
        );
    }
}

/* =========================
   LOGOUT
========================= */

$("logoutButton")?.addEventListener("click", () => {
    state.session = null;

    localStorage.removeItem(
        "danielTechSession"
    );

    hide($("dashboardModal"));
    hide($("overlay"));

    if ($("adminLoginForm")) {
        $("adminLoginForm").reset();
    }

    if ($("loginMessage")) {
        $("loginMessage").textContent = "";
    }
});

/* =========================
   CLOSE MODALS
========================= */

document
    .querySelectorAll(".close-modal")
    .forEach((button) => {
        button.addEventListener("click", () => {
            const modal =
                button.closest(".modal");

            if (modal) {
                hide(modal);
            }

            hide($("overlay"));
        });
    });

/* =========================
   ESCAPE KEY
========================= */

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    document
        .querySelectorAll(
            ".modal.show, .settings-panel.show"
        )
        .forEach((element) => {
            hide(element);
        });

    hide($("overlay"));
});

/* =========================
   BACK TO TOP
========================= */

window.addEventListener("scroll", () => {
    const button = $("backTop");

    if (!button) return;

    if (window.scrollY > 400) {
        button.classList.add("show");
    } else {
        button.classList.remove("show");
    }
});

$("backTop")?.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/* =========================
   ADMIN USERNAME FIELD
========================= */

if ($("adminUsername")) {
    $("adminUsername").type = "email";
    $("adminUsername").placeholder =
        "Admin email";
}

/* =========================
   START WEBSITE
========================= */

restoreAdminSession();
loadContents();

if (state.session) {
    setupAdminDashboard();
}
