/* =====================================================
   DANIEL TECH - FINAL JAVASCRIPT
===================================================== */


/* =====================================================
   SUPABASE CONFIGURATION
===================================================== */

const SUPABASE_URL =
    "https://bodprzntcloioncwhpvr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";

const ADMIN_UID =
    "05fef3eb-16a3-4554-9d9b-de7d2b29144d";

const STORAGE_BUCKET =
    "daniel-files";


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let currentSession = null;

let editingContentId = null;

let selectedContentType = "news";


/* =====================================================
   SUPABASE HEADERS
===================================================== */

function supabaseHeaders(token = null) {

    const headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   SESSION STORAGE
===================================================== */

function saveAdminSession(session) {

    currentSession = session;

    sessionStorage.setItem(
        "danielTechAdminSession",
        JSON.stringify(session)
    );
}


function getSavedAdminSession() {

    const saved =
        sessionStorage.getItem(
            "danielTechAdminSession"
        );

    if (!saved) {
        return null;
    }

    try {
        return JSON.parse(saved);
    } catch (error) {

        sessionStorage.removeItem(
            "danielTechAdminSession"
        );

        return null;
    }
}


function clearAdminSession() {

    currentSession = null;

    sessionStorage.removeItem(
        "danielTechAdminSession"
    );
}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active-page");

        });


    const target =
        document.getElementById(pageId);

    if (target) {

        target.classList.add("active-page");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    document
        .querySelectorAll(".main-nav a")
        .forEach(link => {

            link.classList.remove("active");

            if (
                link.dataset.page === pageId
            ) {

                link.classList.add("active");

            }

        });


    const nav =
        document.getElementById("mainNav");

    if (nav) {
        nav.classList.remove("open");
    }
}


/* =====================================================
   PAGE BUTTON EVENTS
===================================================== */

document.addEventListener(
    "click",
    function(event) {

        const pageButton =
            event.target.closest(
                "[data-page]"
            );

        if (!pageButton) {
            return;
        }

        event.preventDefault();

        const page =
            pageButton.dataset.page;

        if (page) {
            showPage(page);
        }

    }
);


/* =====================================================
   MOBILE MENU
===================================================== */

function setupMobileMenu() {

    const menuButton =
        document.getElementById(
            "menuButton"
        );

    const mainNav =
        document.getElementById(
            "mainNav"
        );


    if (!menuButton || !mainNav) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function() {

            mainNav.classList.toggle(
                "open"
            );

        }
    );
}


/* =====================================================
   DARK MODE
===================================================== */

function applyDarkMode(enabled) {

    document.body.classList.toggle(
        "dark-mode",
        enabled
    );


    localStorage.setItem(
        "danielTechDarkMode",
        enabled ? "true" : "false"
    );


    const settingsToggle =
        document.getElementById(
            "settingsDarkMode"
        );

    if (settingsToggle) {
        settingsToggle.checked = enabled;
    }


    const button =
        document.getElementById(
            "darkModeButton"
        );

    if (button) {

        button.textContent =
            enabled
                ? "Light Mode"
                : "Dark Mode";

    }
}


function restoreDarkMode() {

    const saved =
        localStorage.getItem(
            "danielTechDarkMode"
        );

    applyDarkMode(
        saved === "true"
    );
}


function setupDarkMode() {

    const darkButton =
        document.getElementById(
            "darkModeButton"
        );

    const settingsToggle =
        document.getElementById(
            "settingsDarkMode"
        );


    if (darkButton) {

        darkButton.addEventListener(
            "click",
            function() {

                const enabled =
                    !document.body.classList.contains(
                        "dark-mode"
                    );

                applyDarkMode(enabled);

            }
        );

    }


    if (settingsToggle) {

        settingsToggle.addEventListener(
            "change",
            function() {

                applyDarkMode(
                    settingsToggle.checked
                );

            }
        );

    }
}


/* =====================================================
   SETTINGS PANEL
===================================================== */

function setupSettings() {

    const settingsButton =
        document.getElementById(
            "settingsButton"
        );

    const settingsPanel =
        document.getElementById(
            "settingsPanel"
        );

    const closeSettings =
        document.getElementById(
            "closeSettings"
        );

    const overlay =
        document.getElementById(
            "overlay"
        );


    function openSettings() {

        if (settingsPanel) {
            settingsPanel.classList.add(
                "open"
            );
        }

        if (overlay) {
            overlay.classList.add(
                "active"
            );
        }

    }


    function closePanel() {

        if (settingsPanel) {
            settingsPanel.classList.remove(
                "open"
            );
        }

        if (overlay) {
            overlay.classList.remove(
                "active"
            );
        }

    }


    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            openSettings
        );

    }


    if (closeSettings) {

        closeSettings.addEventListener(
            "click",
            closePanel
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closePanel
        );

    }


    window.closeSettingsPanel =
        closePanel;
}


/* =====================================================
   MODAL HELPERS
===================================================== */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.classList.add(
            "open"
        );

    }
}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.classList.remove(
            "open"
        );

    }
}


function setupModalCloseButtons() {

    document
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    closeModal(
                        button.dataset.closeModal
                    );

                }
            );

        });


    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target === modal
                    ) {

                        modal.classList.remove(
                            "open"
                        );

                    }

                }
            );

        });
}


/* =====================================================
   ABOUT
===================================================== */

function setupAbout() {

    const aboutButton =
        document.getElementById(
            "aboutButton"
        );


    if (!aboutButton) {
        return;
    }


    aboutButton.addEventListener(
        "click",
        function() {

            if (window.closeSettingsPanel) {
                window.closeSettingsPanel();
            }

            openModal("aboutModal");

        }
    );
}


/* =====================================================
   SERVICES
===================================================== */

const serviceInformation = {

    web: {
        title: "Web Development",
        text:
            "Daniel Tech provides modern and responsive website development for businesses, organizations, personal brands and digital projects."
    },

    graphics: {
        title: "Graphics Design",
        text:
            "Professional graphics design services for logos, posters, social media artwork, promotional materials and digital branding."
    },

    security: {
        title: "Cyber Security",
        text:
            "Learn practical cybersecurity principles, digital safety practices, account protection and responsible security awareness."
    },

    computer: {
        title: "Computer Services",
        text:
            "Computer setup, software installation, troubleshooting, maintenance and general ICT support."
    },

    software: {
        title: "Software Solutions",
        text:
            "Digital software solutions designed to improve productivity and simplify everyday technology tasks."
    },

    ai: {
        title: "AI Solutions",
        text:
            "Practical artificial intelligence solutions for learning, productivity, content creation, programming and digital projects."
    }

};


function setupServices() {

    document
        .querySelectorAll(
            ".service-view-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    const type =
                        button.dataset.service;

                    const data =
                        serviceInformation[type];

                    if (!data) {
                        return;
                    }


                    document.getElementById(
                        "serviceModalTitle"
                    ).textContent =
                        data.title;


                    document.getElementById(
                        "serviceModalText"
                    ).textContent =
                        data.text;


                    openModal(
                        "serviceModal"
                    );

                }
            );

        });
}


/* =====================================================
   FEATURES
===================================================== */

const featureInformation = {

    "computer-tips": {
        title: "Computer Tips",
        text:
            "Practical computer tips covering maintenance, performance, troubleshooting, shortcuts and productivity."
    },

    "phone-tips": {
        title: "Phone Tips",
        text:
            "Useful smartphone tips covering settings, storage, performance, privacy and everyday phone usage."
    },

    "ai-tools": {
        title: "AI Tools",
        text:
            "Discover useful AI tools for learning, writing, programming, research, design and productivity."
    },

    gaming: {
        title: "Gaming",
        text:
            "Gaming information including performance tips, software guidance, computer requirements and gaming technology."
    },

    programming: {
        title: "Programming",
        text:
            "Programming tutorials and development knowledge covering coding concepts, web development and software creation."
    },

    "software-tips": {
        title: "Software Tips",
        text:
            "Learn how to install, configure, use and troubleshoot useful computer software."
    }

};


function setupFeatures() {

    document
        .querySelectorAll(
            ".feature-view-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    const type =
                        button.dataset.feature;

                    const data =
                        featureInformation[type];

                    if (!data) {
                        return;
                    }


                    document.getElementById(
                        "featureModalTitle"
                    ).textContent =
                        data.title;


                    document.getElementById(
                        "featureModalText"
                    ).textContent =
                        data.text;


                    openModal(
                        "featureModal"
                    );

                }
            );

        });
}


/* =====================================================
   CONTENT FILE DISPLAY
===================================================== */

function createContentMedia(content) {

    if (!content.file_url) {
        return "";
    }


    const url =
        escapeHtml(content.file_url);

    const fileType =
        content.file_type || "";


    if (
        fileType.startsWith("image/")
    ) {

        return `
            <div class="content-media">
                <img
                    src="${url}"
                    alt="${escapeHtml(content.title)}"
                    loading="lazy">
            </div>
        `;

    }


    if (
        fileType.startsWith("audio/")
    ) {

        return `
            <div class="content-media">
                <audio
                    controls
                    preload="metadata">
                    <source src="${url}">
                </audio>
            </div>
        `;

    }


    if (
        fileType.startsWith("video/")
    ) {

        return `
            <div class="content-media">
                <video
                    controls
                    preload="metadata">
                    <source src="${url}">
                </video>
            </div>
        `;

    }


    return `
        <div class="content-file">
            <a
                href="${url}"
                target="_blank"
                rel="noopener noreferrer">
                Open File
            </a>
        </div>
    `;
}


/* =====================================================
   LOAD CONTENTS
===================================================== */

async function loadContents() {

    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/contents?select=*&order=created_at.desc`,
                {
                    headers:
                        supabaseHeaders()
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not load contents."
            );

        }


        const contents =
            await response.json();


        renderLatestContent(contents);

        renderBlog(contents);

        renderAdminContent(contents);


        updateNewsBar(contents);

    } catch (error) {

        console.error(
            "Content loading error:",
            error
        );

    }
}


/* =====================================================
   LATEST CONTENT
===================================================== */

function renderLatestContent(contents) {

    const container =
        document.getElementById(
            "latestContent"
        );


    if (!container) {
        return;
    }


    if (!contents.length) {

        container.innerHTML = `
            <div class="empty-content">
                No content has been published yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        contents
            .slice(0, 6)
            .map(content => {

                return `
                    <article class="content-card">

                        ${createContentMedia(content)}

                        <span class="blog-category">
                            ${escapeHtml(content.category)}
                        </span>

                        <h3>
                            ${escapeHtml(content.title)}
                        </h3>

                        <p>
                            ${escapeHtml(
                                content.content_text || ""
                            )}
                        </p>

                        <span class="blog-date">
                            ${formatDate(
                                content.created_at
                            )}
                        </span>

                    </article>
                `;

            })
            .join("");
}


/* =====================================================
   BLOG
===================================================== */

function renderBlog(contents) {

    const container =
        document.getElementById(
            "blogGrid"
        );


    if (!container) {
        return;
    }


    if (!contents.length) {

        container.innerHTML = `
            <div class="empty-content">
                No blog content has been published yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        contents
            .map(content => {

                return `
                    <article class="blog-card">

                        <div class="blog-card-media">

                            ${
                                createContentMedia(
                                    content
                                ) ||
                                `
                                <span>
                                    Daniel Tech
                                </span>
                                `
                            }

                        </div>

                        <div class="blog-card-body">

                            <span class="blog-category">
                                ${escapeHtml(
                                    content.category
                                )}
                            </span>

                            <h3>
                                ${escapeHtml(
                                    content.title
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    content.content_text || ""
                                )}
                            </p>

                            <span class="blog-date">
                                ${formatDate(
                                    content.created_at
                                )}
                            </span>

                        </div>

                    </article>
                `;

            })
            .join("");
}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(dateValue) {

    if (!dateValue) {
        return "";
    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
        return "";
    }


    return date.toLocaleString(
        "en-TZ",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


/* =====================================================
   NEWS BAR
===================================================== */

function updateNewsBar(contents) {

    const newsContent =
        document.getElementById(
            "newsContent"
        );


    if (!newsContent) {
        return;
    }


    const latest =
        contents[0];


    if (!latest) {

        newsContent.textContent =
            "Welcome to Daniel Tech.";

        return;
    }


    newsContent.textContent =
        latest.title;
}


/* =====================================================
   LOCAL COMMENTS
===================================================== */

function getComments() {

    const saved =
        localStorage.getItem(
            "danielTechComments"
        );


    if (!saved) {
        return [];
    }


    try {

        return JSON.parse(saved);

    } catch (error) {

        return [];

    }
}


function saveComments(comments) {

    localStorage.setItem(
        "danielTechComments",
        JSON.stringify(comments)
    );
}


function renderComments() {

    const container =
        document.getElementById(
            "commentsList"
        );


    if (!container) {
        return;
    }


    const comments =
        getComments();


    if (!comments.length) {

        container.innerHTML = `
            <p class="empty-content">
                No comments yet.
            </p>
        `;

        return;
    }


    container.innerHTML =
        comments
            .slice()
            .reverse()
            .map(comment => {

                return `
                    <div class="comment-item">

                        <strong>
                            ${escapeHtml(
                                comment.name
                            )}
                        </strong>

                        <p>
                            ${escapeHtml(
                                comment.text
                            )}
                        </p>

                    </div>
                `;

            })
            .join("");
}


function setupComments() {

    const form =
        document.getElementById(
            "commentForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "commentName"
                ).value.trim();


            const text =
                document.getElementById(
                    "commentText"
                ).value.trim();


            if (!name || !text) {
                return;
            }


            const comments =
                getComments();


            comments.push({
                name: name,
                text: text,
                created_at:
                    new Date().toISOString()
            });


            saveComments(comments);


            form.reset();

            renderComments();

        }
    );


    renderComments();
}


/* =====================================================
   CONTACT FORM
===================================================== */

function setupContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "contactName"
                ).value.trim();


            const email =
                document.getElementById(
                    "contactEmail"
                ).value.trim();


            const subject =
                document.getElementById(
                    "contactSubject"
                ).value.trim();


            const message =
                document.getElementById(
                    "contactMessage"
                ).value.trim();


            const status =
                document.getElementById(
                    "contactStatus"
                );


            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                if (status) {
                    status.textContent =
                        "Please complete all fields.";
                }

                return;
            }


            if (status) {

                status.textContent =
                    "Sending message...";

            }


            try {

                const response =
                    await fetch(
                        `${SUPABASE_URL}/rest/v1/message`,
                        {
                            method: "POST",

                            headers:
                                supabaseHeaders(),

                            body:
                                JSON.stringify({
                                    name: name,
                                    email: email,
                                    subject: subject,
                                    message: message
                                })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        errorText
                    );

                    throw new Error(
                        "Message could not be sent."
                    );

                }


                form.reset();


                if (status) {

                    status.textContent =
                        "Your message has been sent successfully.";

                }


                if (currentSession) {
                    loadMessages();
                }


            } catch (error) {

                console.error(
                    "Contact error:",
                    error
                );


                if (status) {

                    status.textContent =
                        "Unable to send the message. Please try again.";

                }

            }

        }
    );
}


/* =====================================================
   ADMIN LOGIN
===================================================== */

function setupAdminLogin() {

    const adminButton =
        document.getElementById(
            "adminButton"
        );


    const form =
        document.getElementById(
            "adminLoginForm"
        );


    if (adminButton) {

        adminButton.addEventListener(
            "click",
            function() {

                if (window.closeSettingsPanel) {
                    window.closeSettingsPanel();
                }

                openModal(
                    "adminLoginModal"
                );

            }
        );

    }


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "adminName"
                ).value.trim();


            const username =
                document.getElementById(
                    "adminUsername"
                ).value.trim();


            const password =
                document.getElementById(
                    "adminPassword"
                ).value;


            const loginMessage =
                document.getElementById(
                    "loginMessage"
                );


            if (
                !name ||
                !username ||
                !password
            ) {

                if (loginMessage) {

                    loginMessage.textContent =
                        "Please complete all login fields.";

                }

                return;
            }


            if (loginMessage) {

                loginMessage.textContent =
                    "Signing in...";

            }


            try {

                const response =
                    await fetch(
                        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
                        {
                            method: "POST",

                            headers:
                                supabaseHeaders(),

                            body:
                                JSON.stringify({
                                    email: username,
                                    password: password
                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error_description ||
                        data.msg ||
                        "Login failed."
                    );

                }


                if (
                    !data.user ||
                    data.user.id !== ADMIN_UID
                ) {

                    throw new Error(
                        "This account is not authorized as Daniel Tech admin."
                    );

                }


                saveAdminSession(data);


                closeModal(
                    "adminLoginModal"
                );


                form.reset();


                if (loginMessage) {
                    loginMessage.textContent = "";
                }


                openModal(
                    "dashboardModal"
                );


                await loadContents();

                await loadMessages();


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                if (loginMessage) {

                    loginMessage.textContent =
                        error.message ||
                        "Login failed.";

                }

            }

        }
    );
}


/* =====================================================
   RESTORE ADMIN SESSION
===================================================== */

function restoreAdminSession() {

    const saved =
        getSavedAdminSession();


    if (!saved) {
        return;
    }


    if (
        !saved.user ||
        saved.user.id !== ADMIN_UID
    ) {

        clearAdminSession();

        return;
    }


    currentSession = saved;

    loadMessages();
}


/* =====================================================
   ADMIN UPLOAD UI
===================================================== */

function setupAdminUploadUI() {

    const original =
        document.getElementById(
            "contentFile"
        );


    if (!original) {
        return;
    }


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "upload-area";


    const fileInput =
        document.createElement(
            "input"
        );


    fileInput.type = "file";

    fileInput.id =
        "contentUpload";

    fileInput.accept =
        "image/*,audio/*,video/*,.pdf";


    original.replaceWith(
        fileInput
    );


    const external =
        document.createElement(
            "input"
        );


    external.type = "url";

    external.id =
        "contentExternalUrl";

    external.placeholder =
        "Or paste an external file URL";


    fileInput.insertAdjacentElement(
        "afterend",
        external
    );
}


/* =====================================================
   UPLOAD FILE TO SUPABASE STORAGE
===================================================== */

async function uploadFile(file, token) {

    if (!file) {
        return null;
    }


    const safeName =
        file.name
            .replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );


    const filePath =
        `${Date.now()}-${safeName}`;


    const uploadUrl =
        `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${encodeURIComponent(filePath)}`;


    const response =
        await fetch(
            uploadUrl,
            {
                method: "POST",

                headers: {
                    "apikey": SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        file.type ||
                        "application/octet-stream"
                },

                body: file
            }
        );


    if (!response.ok) {

        const error =
            await response.text();

        console.error(error);

        throw new Error(
            "File upload failed."
        );

    }


    return {
        path: filePath,

        url:
            `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${encodeURIComponent(filePath)}`
    };
}


/* =====================================================
   DELETE STORAGE FILE
===================================================== */

async function deleteStorageFile(
    filePath,
    token
) {

    if (!filePath) {
        return;
    }


    const response =
        await fetch(
            `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${filePath}`,
            {
                method: "DELETE",

                headers: {
                    "apikey": SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        console.warn(
            "Storage file could not be deleted."
        );

    }
}


/* =====================================================
   ADMIN PUBLISH CONTENT
===================================================== */

function setupContentPublishing() {

    const saveButton =
        document.getElementById(
            "saveContentButton"
        );


    if (!saveButton) {
        return;
    }


    saveButton.addEventListener(
        "click",
        publishContent
    );
}


/* =====================================================
   PUBLISH CONTENT FUNCTION
===================================================== */

async function publishContent() {

    if (!currentSession) {

        alert(
            "Please login as administrator first."
        );

        return;
    }


    const title =
        document.getElementById(
            "contentTitle"
        ).value.trim();


    const category =
        document.getElementById(
            "contentCategory"
        ).value;


    const contentText =
        document.getElementById(
            "contentText"
        ).value.trim();


    const fileInput =
        document.getElementById(
            "contentUpload"
        );


    const externalInput =
        document.getElementById(
            "contentExternalUrl"
        );


    const status =
        document.getElementById(
            "contentStatus"
        );


    if (!title) {

        if (status) {
            status.textContent =
                "Please enter a title.";
        }

        return;
    }


    if (status) {

        status.textContent =
            "Publishing content...";

    }


    try {

        let fileUrl = null;

        let fileName = null;

        let fileType = null;


        const selectedFile =
            fileInput &&
            fileInput.files &&
            fileInput.files[0];


        if (selectedFile) {

            const uploaded =
                await uploadFile(
                    selectedFile,
                    currentSession.access_token
                );


            fileUrl =
                uploaded.url;

            fileName =
                selectedFile.name;

            fileType =
                selectedFile.type;

        } else if (
            externalInput &&
            externalInput.value.trim()
        ) {

            fileUrl =
                externalInput.value.trim();

            fileName =
                fileUrl.split("/").pop() ||
                "External file";

            fileType =
                "";

        }


        const body = {

            title: title,

            category: category,

            content_text:
                contentText || null,

            file_url:
                fileUrl,

            file_name:
                fileName,

            file_type:
                fileType

        };


        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/contents`,
                {
                    method: "POST",

                    headers: {
                        ...supabaseHeaders(
                            currentSession.access_token
                        ),

                        "Prefer":
                            "return=representation"
                    },

                    body:
                        JSON.stringify(body)
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            console.error(error);

            throw new Error(
                "Content could not be published."
            );

        }


        document.getElementById(
            "contentTitle"
        ).value = "";


        document.getElementById(
            "contentText"
        ).value = "";


        if (fileInput) {
            fileInput.value = "";
        }


        if (externalInput) {
            externalInput.value = "";
        }


        if (status) {

            status.textContent =
                "Content published successfully.";

        }


        await loadContents();


    } catch (error) {

        console.error(
            "Publishing error:",
            error
        );


        if (status) {

            status.textContent =
                error.message ||
                "Publishing failed.";

        }

    }
}


/* =====================================================
   ADMIN CONTENT LIST
===================================================== */

function renderAdminContent(contents) {

    const container =
        document.getElementById(
            "adminContentList"
        );


    if (!container) {
        return;
    }


    if (!contents.length) {

        container.innerHTML = `
            <p class="empty-content">
                No content available.
            </p>
        `;

        return;
    }


    container.innerHTML =
        contents
            .map(content => {

                return `
                    <div class="admin-content-item">

                        <div>

                            <h4>
                                ${escapeHtml(
                                    content.title
                                )}
                            </h4>

                            <p>
                                ${escapeHtml(
                                    content.category
                                )}
                                |
                                ${formatDate(
                                    content.created_at
                                )}
                            </p>

                        </div>

                        <button
                            type="button"
                            class="delete-content"
                            data-content-id="${content.id}"
                            data-file-url="${escapeHtml(
                                content.file_url || ""
                            )}">
                            Delete
                        </button>

                    </div>
                `;

            })
            .join("");


    container
        .querySelectorAll(
            ".delete-content"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    deleteContent(
                        button.dataset.contentId,
                        button.dataset.fileUrl
                    );

                }
            );

        });
}


/* =====================================================
   DELETE CONTENT
===================================================== */

async function deleteContent(
    id,
    fileUrl
) {

    if (!currentSession) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this content?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/contents?id=eq.${encodeURIComponent(id)}`,
                {
                    method: "DELETE",

                    headers:
                        supabaseHeaders(
                            currentSession.access_token
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                "Content could not be deleted."
            );

        }


        if (
            fileUrl &&
            fileUrl.includes(
                `/storage/v1/object/public/${STORAGE_BUCKET}/`
            )
        ) {

            const marker =
                `/storage/v1/object/public/${STORAGE_BUCKET}/`;

            const path =
                decodeURIComponent(
                    fileUrl.split(marker)[1] || ""
                );


            if (path) {

                await deleteStorageFile(
                    path,
                    currentSession.access_token
                );

            }

        }


        await loadContents();


    } catch (error) {

        console.error(
            "Delete content error:",
            error
        );


        alert(
            "Content could not be deleted."
        );

    }
}


/* =====================================================
   QUICK CONTENT BUTTONS
===================================================== */

function setupQuickContentButtons() {

    const buttons = {

        addNewsButton: "news",

        addTipButton: "tip",

        addVideoButton: "video",

        addPdfButton: "pdf"

    };


    Object.keys(buttons)
        .forEach(id => {

            const button =
                document.getElementById(id);


            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                function() {

                    const category =
                        buttons[id];


                    selectedContentType =
                        category;


                    const select =
                        document.getElementById(
                            "contentCategory"
                        );


                    if (select) {

                        select.value =
                            category;

                    }


                    const editor =
                        document.getElementById(
                            "adminEditor"
                        );


                    if (editor) {

                        editor.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        });
}


/* =====================================================
   ADMIN MESSAGES SECTION
===================================================== */

function createMessagesSection() {

    const dashboard =
        document.querySelector(
            "#dashboardModal .dashboard-box"
        );


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!dashboard || !logoutButton) {
        return;
    }


    if (
        document.getElementById(
            "messagesSection"
        )
    ) {
        return;
    }


    const section =
        document.createElement(
            "div"
        );


    section.id =
        "messagesSection";


    section.className =
        "admin-messages-section";


    section.innerHTML = `

        <h3>
            Visitor Messages
        </h3>

        <button
            type="button"
            id="refreshMessagesButton"
            class="dashboard-button">
            Refresh Messages
        </button>

        <div
            id="adminMessagesList"
            class="admin-messages-list">

            <p>
                Login to load visitor messages.
            </p>

        </div>

    `;


    dashboard.insertBefore(
        section,
        logoutButton
    );


    const refresh =
        document.getElementById(
            "refreshMessagesButton"
        );


    if (refresh) {

        refresh.addEventListener(
            "click",
            loadMessages
        );

    }
}


/* =====================================================
   LOAD VISITOR MESSAGES
===================================================== */

async function loadMessages() {

    const container =
        document.getElementById(
            "adminMessagesList"
        );


    if (!container) {
        return;
    }


    if (!currentSession) {

        container.innerHTML = `
            <p>
                Login to load visitor messages.
            </p>
        `;

        return;
    }


    container.innerHTML = `
        <p>
            Loading messages...
        </p>
    `;


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/message?select=*&order=created_at.desc`,
                {
                    method: "GET",

                    headers:
                        supabaseHeaders(
                            currentSession.access_token
                        )
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            console.error(error);

            throw new Error(
                "Messages could not be loaded."
            );

        }


        const messages =
            await response.json();


        renderMessages(messages);


    } catch (error) {

        console.error(
            "Messages error:",
            error
        );


        container.innerHTML = `
            <p>
                Unable to load messages.
            </p>
        `;

    }
}


/* =====================================================
   RENDER VISITOR MESSAGES
===================================================== */

function renderMessages(messages) {

    const container =
        document.getElementById(
            "adminMessagesList"
        );


    if (!container) {
        return;
    }


    if (!messages.length) {

        container.innerHTML = `
            <p class="empty-content">
                No visitor messages yet.
            </p>
        `;

        return;
    }


    container.innerHTML =
        messages
            .map(message => {

                return `
                    <div
                        class="admin-message-item"
                        data-message-id="${message.id}">

                        <h4>
                            ${escapeHtml(
                                message.subject ||
                                "No subject"
                            )}
                        </h4>

                        <p>
                            <strong>Name:</strong>
                            ${escapeHtml(
                                message.name
                            )}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${escapeHtml(
                                message.email
                            )}
                        </p>

                        <p>
                            <strong>Message:</strong>
                            ${escapeHtml(
                                message.message
                            )}
                        </p>

                        <small>
                            ${formatDate(
                                message.created_at
                            )}
                        </small>

                        <button
                            type="button"
                            class="delete-message delete-content"
                            data-message-id="${message.id}">
                            Delete Message
                        </button>

                    </div>
                `;

            })
            .join("");


    container
        .querySelectorAll(
            ".delete-message"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    deleteMessage(
                        button.dataset.messageId
                    );

                }
            );

        });
}


/* =====================================================
   DELETE MESSAGE
===================================================== */

async function deleteMessage(id) {

    if (!currentSession) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this message?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/message?id=eq.${encodeURIComponent(id)}`,
                {
                    method: "DELETE",

                    headers:
                        supabaseHeaders(
                            currentSession.access_token
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                "Message could not be deleted."
            );

        }


        await loadMessages();


    } catch (error) {

        console.error(
            "Delete message error:",
            error
        );


        alert(
            "Message could not be deleted."
        );

    }
}


/* =====================================================
   LOGOUT
===================================================== */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function() {

            clearAdminSession();

            closeModal(
                "dashboardModal"
            );


            const message =
                document.getElementById(
                    "loginMessage"
                );


            if (message) {
                message.textContent = "";
            }

        }
    );
}


/* =====================================================
   BACK TO TOP
===================================================== */

function setupBackToTop() {

    const button =
        document.getElementById(
            "backTop"
        );


    if (!button) {
        return;
    }


    window.addEventListener(
        "scroll",
        function() {

            if (
                window.scrollY > 400
            ) {

                button.classList.add(
                    "show"
                );

            } else {

                button.classList.remove(
                    "show"
                );

            }

        }
    );


    button.addEventListener(
        "click",
        function() {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );
}


/* =====================================================
   ESC KEY
===================================================== */

function setupEscapeKey() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            document
                .querySelectorAll(
                    ".modal.open"
                )
                .forEach(modal => {

                    modal.classList.remove(
                        "open"
                    );

                });


            if (
                window.closeSettingsPanel
            ) {

                window.closeSettingsPanel();

            }

        }
    );
}


/* =====================================================
   ADMIN USERNAME FIELD
===================================================== */

function setupAdminUsernameField() {

    const input =
        document.getElementById(
            "adminUsername"
        );


    if (!input) {
        return;
    }


    input.type = "email";

    input.placeholder =
        "Admin email";

    input.autocomplete =
        "username";
}


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        setupMobileMenu();

        restoreDarkMode();

        setupDarkMode();

        setupSettings();

        setupModalCloseButtons();

        setupAbout();

        setupServices();

        setupFeatures();

        setupComments();

        setupContactForm();

        setupAdminLogin();

        setupAdminUsernameField();

        setupContentPublishing();

        setupQuickContentButtons();

        setupLogout();

        setupBackToTop();

        setupEscapeKey();

        setupAdminUploadUI();

        createMessagesSection();

        restoreAdminSession();

        await loadContents();

        showPage("home");

    }
);
