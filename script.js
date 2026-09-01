/* =========================================
   DANIEL TECH
   MAIN JAVASCRIPT
   FINAL SUPABASE VERSION
========================================= */


/* =========================================
   SUPABASE CONNECTION
========================================= */

const SUPABASE_URL =
    "https://bodprzntcloioncwhpvr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_x4riqGTgHI3btFxG5RXLpA_7RNBneJA";

const ADMIN_UID =
    "05fef3eb-16a3-4554-9d9b-de7d2b29144d";

const STORAGE_BUCKET =
    "daniel-files";


/* =========================================
   SUPABASE HELPERS
========================================= */

let adminSession = null;


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


function getStoredSession() {

    const saved =
        sessionStorage.getItem("danielTechSession");

    if (!saved) {
        return null;
    }

    try {
        return JSON.parse(saved);
    } catch {
        sessionStorage.removeItem("danielTechSession");
        return null;
    }

}


function saveSession(session) {

    adminSession = session;

    sessionStorage.setItem(
        "danielTechSession",
        JSON.stringify(session)
    );

}


function clearSession() {

    adminSession = null;

    sessionStorage.removeItem(
        "danielTechSession"
    );

}


/* =========================================
   PAGE NAVIGATION
========================================= */

const pages =
    document.querySelectorAll(".page");

const navLinks =
    document.querySelectorAll("[data-page]");


function showPage(pageName) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage =
        document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.dataset.page === pageName) {
            link.classList.add("active");
        }

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    closeMobileMenu();

}


navLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const page =
            this.dataset.page;

        if (page) {
            showPage(page);
        }

    });

});


/* =========================================
   MOBILE MENU
========================================= */

const menuButton =
    document.getElementById("menuButton");

const navbar =
    document.querySelector(".navbar");


if (menuButton) {

    menuButton.addEventListener("click", () => {

        if (navbar) {
            navbar.classList.toggle("active");
        }

    });

}


function closeMobileMenu() {

    if (navbar) {
        navbar.classList.remove("active");
    }

}


/* =========================================
   DARK / LIGHT MODE
========================================= */

const themeButton =
    document.getElementById("themeButton");

const settingsThemeButton =
    document.getElementById("settingsThemeButton");


function updateThemeButtons() {

    const dark =
        document.body.classList.contains("dark");

    if (themeButton) {
        themeButton.textContent =
            dark ? "Light Mode" : "Dark Mode";
    }

    if (settingsThemeButton) {
        settingsThemeButton.textContent =
            dark ? "Light Mode" : "Dark Mode";
    }

}


function toggleTheme() {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "danielTechTheme",
        isDark ? "dark" : "light"
    );

    updateThemeButtons();

}


if (themeButton) {
    themeButton.addEventListener(
        "click",
        toggleTheme
    );
}


if (settingsThemeButton) {
    settingsThemeButton.addEventListener(
        "click",
        toggleTheme
    );
}


const savedTheme =
    localStorage.getItem("danielTechTheme");


if (savedTheme === "dark") {
    document.body.classList.add("dark");
}


updateThemeButtons();


/* =========================================
   SETTINGS
========================================= */

const settingsButton =
    document.getElementById("settingsButton");

const settingsPanel =
    document.getElementById("settingsPanel");

const closeSettings =
    document.getElementById("closeSettings");

const overlay =
    document.getElementById("overlay");


function openSettings() {

    if (settingsPanel) {
        settingsPanel.classList.add("active");
    }

    if (overlay) {
        overlay.classList.add("active");
    }

}


function closeSettingsPanel() {

    if (settingsPanel) {
        settingsPanel.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
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
        closeSettingsPanel
    );

}


if (overlay) {

    overlay.addEventListener(
        "click",
        closeSettingsPanel
    );

}


/* =========================================
   ABOUT
========================================= */

const aboutButton =
    document.getElementById("aboutButton");

const aboutModal =
    document.getElementById("aboutModal");


if (aboutButton) {

    aboutButton.addEventListener("click", () => {

        closeSettingsPanel();

        if (aboutModal) {
            aboutModal.classList.add("active");
        }

    });

}


/* =========================================
   MODALS
========================================= */

document
    .querySelectorAll(".modal-close")
    .forEach(button => {

        button.addEventListener("click", () => {

            const modalId =
                button.dataset.close;

            if (modalId) {

                const modal =
                    document.getElementById(modalId);

                if (modal) {
                    modal.classList.remove("active");
                }

            } else {

                const modal =
                    button.closest(".modal");

                if (modal) {
                    modal.classList.remove("active");
                }

            }

        });

    });


document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                modal.classList.remove("active");
            }

        });

    });


/* =========================================
   SERVICES
========================================= */

const serviceInformation = {

    "Web Development":
        "We provide modern responsive website development and digital web solutions.",

    "Graphics Design":
        "Creative graphics, digital branding and visual content solutions.",

    "Cyber Security":
        "Technology awareness, security guidance and digital safety information.",

    "Computer Services":
        "Computer troubleshooting, software installation and general technology support.",

    "Software Solutions":
        "Software guidance, applications and digital technology solutions.",

    "AI Solutions":
        "Information and solutions involving modern artificial intelligence tools."

};


const serviceModal =
    document.getElementById("serviceModal");

const serviceTitle =
    document.getElementById("serviceTitle");

const serviceDetails =
    document.getElementById("serviceDetails");


document
    .querySelectorAll(".read-service")
    .forEach(button => {

        button.addEventListener("click", () => {

            const service =
                button.dataset.service;

            if (serviceTitle) {
                serviceTitle.textContent = service;
            }

            if (serviceDetails) {

                serviceDetails.innerHTML = `
                    <p>
                        ${escapeHtml(
                            serviceInformation[service] || ""
                        )}
                    </p>

                    <p>
                        More information about this service
                        can be added by the administrator.
                    </p>
                `;

            }

            if (serviceModal) {
                serviceModal.classList.add("active");
            }

        });

    });


/* =========================================
   FEATURES
========================================= */

const featureInformation = {

    "Computer Tips":
        "Useful computer tricks, maintenance information and troubleshooting guides.",

    "Phone Tips":
        "Smartphone settings, tricks and useful mobile technology information.",

    "AI Tools":
        "Useful artificial intelligence tools and practical ways to use them.",

    "Gaming":
        "Gaming technology, performance settings and useful gaming information.",

    "Programming":
        "Programming knowledge, coding tips and development resources.",

    "Software Tips":
        "Software guides, applications and useful technology tutorials."

};


const featureModal =
    document.getElementById("featureModal");

const featureTitle =
    document.getElementById("featureTitle");

const featureDetails =
    document.getElementById("featureDetails");


document
    .querySelectorAll(".program-button")
    .forEach(button => {

        button.addEventListener("click", () => {

            const feature =
                button.dataset.feature;

            if (featureTitle) {
                featureTitle.textContent = feature;
            }

            if (featureDetails) {

                featureDetails.innerHTML = `
                    <p>
                        ${escapeHtml(
                            featureInformation[feature] || ""
                        )}
                    </p>

                    <p>
                        New tips for this category can be
                        added from the Admin Dashboard.
                    </p>
                `;

            }

            if (featureModal) {
                featureModal.classList.add("active");
            }

        });

    });


/* =========================================
   CONTENT
========================================= */

let contents = [];


async function loadContents() {

    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/contents?select=*&order=created_at.desc`,
                {
                    method: "GET",
                    headers: supabaseHeaders()
                }
            );

        if (!response.ok) {
            throw new Error("Could not load content.");
        }

        contents = await response.json();

        renderBlog();
        renderAdminContents();

        updateDashboardSummary();

    } catch (error) {

        console.error(
            "Content loading error:",
            error
        );

    }

}


/* =========================================
   BLOG
========================================= */

function renderBlog() {

    const blogGrid =
        document.getElementById("blogGrid");

    const homeLatest =
        document.getElementById("homeLatest");

    const newsContent =
        document.getElementById("newsContent");


    if (blogGrid) {
        blogGrid.innerHTML = "";
    }

    if (homeLatest) {
        homeLatest.innerHTML = "";
    }


    if (contents.length === 0) {

        if (blogGrid) {

            blogGrid.innerHTML = `
                <article class="blog-card">

                    <div class="blog-category">
                        DANIEL TECH
                    </div>

                    <h3>
                        Welcome to Daniel Tech
                    </h3>

                    <p>
                        New technology news, tips and articles
                        will appear here.
                    </p>

                </article>
            `;

        }


        if (homeLatest) {

            homeLatest.innerHTML = `
                <article class="latest-card">

                    <div class="blog-category">
                        WELCOME
                    </div>

                    <h3>
                        Welcome to Daniel Tech
                    </h3>

                    <p>
                        Latest updates will appear here.
                    </p>

                </article>
            `;

        }

        return;

    }


    if (newsContent) {

        const newsItems =
            contents
                .filter(item => item.category === "News")
                .slice(0, 5);

        if (newsItems.length > 0) {

            newsContent.innerHTML =
                newsItems
                    .map(item =>
                        `<span>${escapeHtml(item.title)}</span>`
                    )
                    .join("");

        }

    }


    contents.forEach(item => {

        const article =
            document.createElement("article");

        article.className =
            "blog-card";


        const fileHtml =
            createFileDisplay(item);


        article.innerHTML = `

            <div class="blog-category">
                ${escapeHtml(item.category)}
            </div>

            <div class="blog-date">
                ${new Date(item.created_at)
                    .toLocaleDateString()}
            </div>

            <h3>
                ${escapeHtml(item.title)}
            </h3>

            <p>
                ${escapeHtml(item.content_text || "")}
            </p>

            ${fileHtml}

        `;


        if (blogGrid) {
            blogGrid.appendChild(article);
        }


        const latestCard =
            document.createElement("article");

        latestCard.className =
            "latest-card";


        latestCard.innerHTML = `

            <div class="blog-category">
                ${escapeHtml(item.category)}
            </div>

            <h3>
                ${escapeHtml(item.title)}
            </h3>

            <p>
                ${escapeHtml(item.content_text || "")}
            </p>

            ${fileHtml}

        `;


        if (homeLatest) {
            homeLatest.appendChild(latestCard);
        }

    });

}


/* =========================================
   FILE DISPLAY
========================================= */

function createFileDisplay(item) {

    if (!item.file_url) {
        return "";
    }


    const url =
        escapeHtml(item.file_url);

    const name =
        escapeHtml(
            item.file_name || "Open File"
        );

    const type =
        item.file_type || "";


    if (type.startsWith("image/")) {

        return `
            <div class="content-file">

                <img
                    src="${url}"
                    alt="${name}"
                    style="max-width:100%;height:auto;"
                >

                <p>
                    <a
                        href="${url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="read-blog"
                    >
                        Open Image
                    </a>
                </p>

            </div>
        `;

    }


    if (type.startsWith("audio/")) {

        return `
            <div class="content-file">

                <audio
                    controls
                    style="width:100%;"
                >
                    <source src="${url}">
                </audio>

                <p>
                    <a
                        href="${url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="read-blog"
                    >
                        Open Audio
                    </a>
                </p>

            </div>
        `;

    }


    if (type.startsWith("video/")) {

        return `
            <div class="content-file">

                <video
                    controls
                    style="max-width:100%;width:100%;"
                >
                    <source src="${url}">
                </video>

                <p>
                    <a
                        href="${url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="read-blog"
                    >
                        Open Video
                    </a>
                </p>

            </div>
        `;

    }


    return `
        <p>
            <a
                href="${url}"
                target="_blank"
                rel="noopener noreferrer"
                class="read-blog"
            >
                Open ${name}
            </a>
        </p>
    `;

}


/* =========================================
   COMMENTS
========================================= */

let comments =
    JSON.parse(
        localStorage.getItem("danielTechComments")
    ) || [];


const commentForm =
    document.getElementById("commentForm");

const commentsList =
    document.getElementById("commentsList");


function renderComments() {

    if (!commentsList) {
        return;
    }

    commentsList.innerHTML = "";


    comments.forEach(comment => {

        const div =
            document.createElement("div");

        div.className =
            "comment-item";


        div.innerHTML = `

            <strong>
                ${escapeHtml(comment.name)}
            </strong>

            <p>
                ${escapeHtml(comment.text)}
            </p>

        `;


        commentsList.appendChild(div);

    });

}


if (commentForm) {

    commentForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("commentName")
                    .value
                    .trim();


            const text =
                document
                    .getElementById("commentText")
                    .value
                    .trim();


            if (!name || !text) {
                return;
            }


            comments.push({
                name: name,
                text: text
            });


            localStorage.setItem(
                "danielTechComments",
                JSON.stringify(comments)
            );


            commentForm.reset();

            renderComments();

        }
    );

}


renderComments();


/* =========================================
   CONTACT FORM
========================================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const form =
                event.target;


            const inputs =
                form.querySelectorAll("input");


            const nameInput =
                inputs[0];

            const emailInput =
                inputs[1];

            const subjectInput =
                inputs[2];

            const messageInput =
                form.querySelector("textarea");


            if (
                !nameInput ||
                !emailInput ||
                !subjectInput ||
                !messageInput
            ) {

                alert(
                    "Contact form fields could not be found."
                );

                return;

            }


            const name =
                nameInput.value.trim();

            const email =
                emailInput.value.trim();

            const subject =
                subjectInput.value.trim();

            const message =
                messageInput.value.trim();


            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                alert(
                    "Please fill in all fields."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        `${SUPABASE_URL}/rest/v1/message`,
                        {
                            method: "POST",

                            headers: {
                                ...supabaseHeaders(),
                                "Prefer":
                                    "return=minimal"
                            },

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
                        "Supabase contact error:",
                        errorText
                    );

                    throw new Error(
                        "Message could not be sent."
                    );

                }


                alert(
                    "Your message has been sent successfully."
                );


                form.reset();


                await loadMessages();


            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                alert(
                    "Sorry, your message could not be sent. Please try again."
                );

            }

        }
    );

}


/* =========================================
   ADMIN LOGIN ELEMENTS
========================================= */

const adminButton =
    document.getElementById("adminButton");

const adminModal =
    document.getElementById("adminModal");

const dashboardModal =
    document.getElementById("dashboardModal");

const adminLoginForm =
    document.getElementById("adminLoginForm");

const loginMessage =
    document.getElementById("loginMessage");


/* =========================================
   PREPARE LOGIN FORM
========================================= */

const adminUsernameInput =
    document.getElementById("adminUsername");


if (adminUsernameInput) {

    adminUsernameInput.type = "email";

    adminUsernameInput.placeholder =
        "Admin Email";

}


/* =========================================
   OPEN ADMIN
========================================= */

if (adminButton) {

    adminButton.addEventListener("click", () => {

        closeSettingsPanel();

        if (adminModal) {
            adminModal.classList.add("active");
        }

    });

}


/* =========================================
   SUPABASE AUTH LOGIN
========================================= */

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("adminName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("adminUsername")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("adminPassword")
                    .value;


            if (!name || !email || !password) {

                if (loginMessage) {
                    loginMessage.textContent =
                        "Please fill in all fields.";
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
                                    email: email,
                                    password: password
                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    console.error(
                        "Login error:",
                        data
                    );

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
                        "This account is not authorized as the Daniel Tech administrator."
                    );

                }


                saveSession(data);


                if (adminModal) {
                    adminModal.classList.remove("active");
                }


                if (dashboardModal) {
                    dashboardModal.classList.add("active");
                }


                adminLoginForm.reset();


                if (loginMessage) {
                    loginMessage.textContent = "";
                }


                await loadContents();

                await loadMessages();

                updateDashboardSummary();


            } catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );


                if (loginMessage) {

                    loginMessage.textContent =
                        error.message ||
                        "Invalid admin details.";

                }

            }

        }
    );

}


/* =========================================
   ADMIN FILE UPLOAD UI
========================================= */

function setupAdminUploadUI() {

    const editor =
        document.getElementById("adminEditor");


    const oldFileInput =
        document.getElementById("contentFile");


    if (!editor || !oldFileInput) {
        return;
    }


    const oldLabel =
        oldFileInput.previousElementSibling;


    if (oldLabel) {
        oldLabel.remove();
    }


    oldFileInput.remove();


    const fileLabel =
        document.createElement("label");


    fileLabel.textContent =
        "Upload File";


    fileLabel.style.display =
        "block";


    fileLabel.style.marginTop =
        "12px";


    const fileInput =
        document.createElement("input");


    fileInput.type =
        "file";


    fileInput.id =
        "contentUpload";


    fileInput.accept =
        "image/*,audio/*,video/*,.pdf";


    fileInput.style.display =
        "block";


    fileInput.style.width =
        "100%";


    fileInput.style.marginTop =
        "8px";


    const help =
        document.createElement("p");


    help.textContent =
        "Optional. Upload an image, audio, video or PDF file.";


    help.style.fontSize =
        "13px";


    help.style.marginTop =
        "6px";


    editor.appendChild(fileLabel);

    editor.appendChild(fileInput);

    editor.appendChild(help);


    const urlLabel =
        document.createElement("label");


    urlLabel.textContent =
        "Optional External File URL";


    urlLabel.style.display =
        "block";


    urlLabel.style.marginTop =
        "12px";


    const urlInput =
        document.createElement("input");


    urlInput.type =
        "url";


    urlInput.id =
        "contentExternalUrl";


    urlInput.placeholder =
        "https://example.com/file";


    editor.appendChild(urlLabel);

    editor.appendChild(urlInput);

}


/* =========================================
   SAVE CONTENT
========================================= */

const saveContentButton =
    document.getElementById("saveContentButton");


if (saveContentButton) {

    saveContentButton.addEventListener(
        "click",
        saveContent
    );

}


async function saveContent() {

    if (!adminSession ||
        !adminSession.access_token) {

        alert(
            "Please login as administrator first."
        );

        return;

    }


    const titleInput =
        document.getElementById("contentTitle");

    const categoryInput =
        document.getElementById("contentCategory");

    const textInput =
        document.getElementById("contentText");

    const uploadInput =
        document.getElementById("contentUpload");

    const externalUrlInput =
        document.getElementById("contentExternalUrl");


    const title =
        titleInput
            ? titleInput.value.trim()
            : "";


    const category =
        categoryInput
            ? categoryInput.value
            : "News";


    const text =
        textInput
            ? textInput.value.trim()
            : "";


    const externalUrl =
        externalUrlInput
            ? externalUrlInput.value.trim()
            : "";


    const file =
        uploadInput &&
        uploadInput.files &&
        uploadInput.files.length > 0
            ? uploadInput.files[0]
            : null;


    if (!title) {

        alert(
            "Please enter a title."
        );

        return;

    }


    if (!text) {

        alert(
            "Please enter content."
        );

        return;

    }


    if (!file && !externalUrl) {

        await insertContent(
            title,
            category,
            text,
            "",
            "",
            ""
        );

        return;

    }


    saveContentButton.disabled =
        true;


    saveContentButton.textContent =
        "Saving...";


    try {

        let fileUrl =
            externalUrl;

        let fileName =
            "";

        let fileType =
            "";


        if (file) {

            const uploaded =
                await uploadFile(file);


            fileUrl =
                uploaded.url;

            fileName =
                uploaded.name;

            fileType =
                uploaded.type;

        }


        await insertContent(
            title,
            category,
            text,
            fileUrl,
            fileName,
            fileType
        );


    } catch (error) {

        console.error(
            "Save content error:",
            error
        );


        alert(
            error.message ||
            "Content could not be saved."
        );

    } finally {

        saveContentButton.disabled =
            false;

        saveContentButton.textContent =
            "Save Content";

    }

}


/* =========================================
   UPLOAD FILE TO SUPABASE STORAGE
========================================= */

async function uploadFile(file) {

    if (!adminSession ||
        !adminSession.access_token) {

        throw new Error(
            "Administrator login is required."
        );

    }


    const safeName =
        file.name
            .replace(/[^a-zA-Z0-9._-]/g, "_");


    const uniqueName =
        `${Date.now()}-${safeName}`;


    const filePath =
        `uploads/${uniqueName}`;


    const uploadResponse =
        await fetch(
            `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${filePath}`,
            {
                method: "POST",

                headers: {
                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${adminSession.access_token}`,

                    "Content-Type":
                        file.type ||
                        "application/octet-stream",

                    "x-upsert":
                        "false"
                },

                body: file
            }
        );


    if (!uploadResponse.ok) {

        const errorText =
            await uploadResponse.text();

        console.error(
            "Storage upload error:",
            errorText
        );

        throw new Error(
            "File upload failed. Please check Storage settings."
        );

    }


    const publicUrl =
        `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;


    return {
        url: publicUrl,
        name: file.name,
        type: file.type
    };

}


/* =========================================
   INSERT CONTENT INTO DATABASE
========================================= */

async function insertContent(
    title,
    category,
    text,
    fileUrl,
    fileName,
    fileType
) {

    if (!adminSession ||
        !adminSession.access_token) {

        alert(
            "Please login as administrator first."
        );

        return;

    }


    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/contents`,
            {
                method: "POST",

                headers: {
                    ...supabaseHeaders(
                        adminSession.access_token
                    ),

                    "Prefer":
                        "return=representation"
                },

                body:
                    JSON.stringify({
                        title: title,
                        category: category,
                        content_text: text,
                        file_url: fileUrl || null,
                        file_name: fileName || null,
                        file_type: fileType || null
                    })
            }
        );


    if (!response.ok) {

        const errorText =
            await response.text();

        console.error(
            "Content database error:",
            errorText
        );

        throw new Error(
            "Content could not be saved."
        );

    }


    alert(
        "Content added successfully."
    );


    clearContentEditor();

    await loadContents();

}


/* =========================================
   CLEAR CONTENT EDITOR
========================================= */

function clearContentEditor() {

    const title =
        document.getElementById("contentTitle");

    const text =
        document.getElementById("contentText");

    const upload =
        document.getElementById("contentUpload");

    const external =
        document.getElementById("contentExternalUrl");


    if (title) {
        title.value = "";
    }

    if (text) {
        text.value = "";
    }

    if (upload) {
        upload.value = "";
    }

    if (external) {
        external.value = "";
    }

}


/* =========================================
   ADMIN CONTENT LIST
========================================= */

function renderAdminContents() {

    const list =
        document.getElementById("adminContentList");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (contents.length === 0) {

        list.innerHTML = `
            <p>
                No content has been added yet.
            </p>
        `;

        return;

    }


    contents.forEach(item => {

        const div =
            document.createElement("div");


        div.className =
            "admin-content-item";


        div.innerHTML = `

            <h4>
                ${escapeHtml(item.title)}
            </h4>

            <p>
                ${escapeHtml(item.category)}
            </p>

            <p>
                ${escapeHtml(item.content_text || "")}
            </p>

            ${
                item.file_url
                ? `
                    <p>
                        <a
                            href="${escapeHtml(item.file_url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open File
                        </a>
                    </p>
                `
                : ""
            }

            <button
                class="logout-button delete-content"
                data-id="${item.id}"
            >
                Delete
            </button>

        `;


        list.appendChild(div);

    });


    list
        .querySelectorAll(".delete-content")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        button.dataset.id;


                    const confirmed =
                        confirm(
                            "Delete this content?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    await deleteContent(id);

                }
            );

        });

}


/* =========================================
   DELETE CONTENT
========================================= */

async function deleteContent(id) {

    if (!adminSession ||
        !adminSession.access_token) {

        alert(
            "Administrator login is required."
        );

        return;

    }


    const item =
        contents.find(
            content =>
                String(content.id) === String(id)
        );


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/contents?id=eq.${encodeURIComponent(id)}`,
                {
                    method: "DELETE",

                    headers:
                        supabaseHeaders(
                            adminSession.access_token
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Delete content error:",
                errorText
            );

            throw new Error(
                "Content could not be deleted."
            );

        }


        if (
            item &&
            item.file_url &&
            item.file_url.includes(
                `/storage/v1/object/public/${STORAGE_BUCKET}/`
            )
        ) {

            await deleteStorageFile(
                item.file_url
            );

        }


        await loadContents();


    } catch (error) {

        console.error(
            error
        );


        alert(
            error.message ||
            "Content could not be deleted."
        );

    }

}


/* =========================================
   DELETE STORAGE FILE
========================================= */

async function deleteStorageFile(publicUrl) {

    try {

        const marker =
            `/storage/v1/object/public/${STORAGE_BUCKET}/`;


        const index =
            publicUrl.indexOf(marker);


        if (index === -1) {
            return;
        }


        const filePath =
            publicUrl.substring(
                index + marker.length
            );


        const response =
            await fetch(
                `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${filePath}`,
                {
                    method: "DELETE",

                    headers: {
                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${adminSession.access_token}`
                    }
                }
            );


        if (!response.ok) {

            console.warn(
                "Storage file could not be deleted."
            );

        }

    } catch (error) {

        console.warn(
            "Storage delete error:",
            error
        );

    }

}


/* =========================================
   QUICK ADMIN BUTTONS
========================================= */

function setAdminCategory(category) {

    const categoryInput =
        document.getElementById("contentCategory");


    if (categoryInput) {
        categoryInput.value =
            category;
    }


    const titleInput =
        document.getElementById("contentTitle");


    if (titleInput) {
        titleInput.focus();
    }

}


const addNewsButton =
    document.getElementById("addNewsButton");


if (addNewsButton) {

    addNewsButton.addEventListener(
        "click",
        () => setAdminCategory("News")
    );

}


const addTipButton =
    document.getElementById("addTipButton");


if (addTipButton) {

    addTipButton.addEventListener(
        "click",
        () => setAdminCategory("Tips")
    );

}


const addVideoButton =
    document.getElementById("addVideoButton");


if (addVideoButton) {

    addVideoButton.addEventListener(
        "click",
        () => setAdminCategory("Video")
    );

}


const addPdfButton =
    document.getElementById("addPdfButton");


if (addPdfButton) {

    addPdfButton.addEventListener(
        "click",
        () => setAdminCategory("PDF")
    );

}


/* =========================================
   MESSAGES SECTION
========================================= */

function createMessagesSection() {

    const dashboard =
        document.querySelector(
            "#dashboardModal .dashboard-box"
        );


    if (!dashboard) {
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
        document.createElement("div");


    section.id =
        "messagesSection";


    section.className =
        "admin-messages-section";


    section.innerHTML = `

        <div
            style="
                margin-top:30px;
                padding-top:20px;
                border-top:1px solid rgba(128,128,128,.25);
            "
        >

            <h3>
                Visitor Messages
            </h3>

            <button
                id="refreshMessagesButton"
                class="dashboard-button"
            >
                Refresh Messages
            </button>

            <div
                id="adminMessagesList"
                class="admin-messages-list"
                style="margin-top:15px;"
            >
                <p>
                    Login to load visitor messages.
                </p>
            </div>

        </div>

    `;


    const logout =
        document.getElementById(
            "logoutButton"
        );


    if (logout) {
        dashboard.insertBefore(
            section,
            logout
        );
    } else {
        dashboard.appendChild(section);
    }


    const refreshButton =
        document.getElementById(
            "refreshMessagesButton"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadMessages
        );

    }

}


/* =========================================
   LOAD MESSAGES
========================================= */

async function loadMessages() {

    const list =
        document.getElementById(
            "adminMessagesList"
        );


    if (!list) {
        return;
    }


    if (!adminSession ||
        !adminSession.access_token) {

        list.innerHTML = `
            <p>
                Please login as administrator.
            </p>
        `;

        return;

    }


    list.innerHTML = `
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
                            adminSession.access_token
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Messages error:",
                errorText
            );

            throw new Error(
                "Messages could not be loaded."
            );

        }


        const messages =
            await response.json();


        renderMessages(messages);


        updateMessageCount(
            messages.length
        );


    } catch (error) {

        console.error(
            "Load messages error:",
            error
        );


        list.innerHTML = `
            <p>
                Could not load messages.
            </p>
        `;

    }

}


/* =========================================
   RENDER MESSAGES
========================================= */

function renderMessages(messages) {

    const list =
        document.getElementById(
            "adminMessagesList"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (messages.length === 0) {

        list.innerHTML = `
            <p>
                No visitor messages yet.
            </p>
        `;

        return;

    }


    messages.forEach(message => {

        const item =
            document.createElement("div");


        item.className =
            "admin-message-item";


        item.style.padding =
            "15px";


        item.style.marginBottom =
            "12px";


        item.style.border =
            "1px solid rgba(128,128,128,.25)";


        item.style.borderRadius =
            "8px";


        item.innerHTML = `

            <h4>
                ${escapeHtml(message.name)}
            </h4>

            <p>
                <strong>Email:</strong>
                ${escapeHtml(message.email)}
            </p>

            <p>
                <strong>Subject:</strong>
                ${escapeHtml(message.subject || "No subject")}
            </p>

            <p>
                ${escapeHtml(message.message)}
            </p>

            <small>
                ${message.created_at
                    ? new Date(message.created_at)
                        .toLocaleString()
                    : ""}
            </small>

            <br><br>

            <button
                class="logout-button delete-message"
                data-id="${message.id}"
            >
                Delete Message
            </button>

        `;


        list.appendChild(item);

    });


    list
        .querySelectorAll(".delete-message")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        button.dataset.id;


                    const confirmed =
                        confirm(
                            "Delete this message?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    await deleteMessage(id);

                }
            );

        });

}


/* =========================================
   DELETE MESSAGE
========================================= */

async function deleteMessage(id) {

    if (!adminSession ||
        !adminSession.access_token) {

        alert(
            "Administrator login is required."
        );

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
                            adminSession.access_token
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Delete message error:",
                errorText
            );

            throw new Error(
                "Message could not be deleted."
            );

        }


        await loadMessages();


    } catch (error) {

        console.error(
            error
        );


        alert(
            error.message ||
            "Message could not be deleted."
        );

    }

}


/* =========================================
   DASHBOARD SUMMARY
========================================= */

function updateDashboardSummary() {

    const contentCount =
        document.getElementById(
            "contentCount"
        );


    if (contentCount) {
        contentCount.textContent =
            contents.length;
    }

}


function updateMessageCount(count) {

    const messageCount =
        document.getElementById(
            "messageCount"
        );


    if (messageCount) {
        messageCount.textContent =
            count;
    }

}


/* =========================================
   LOGOUT
========================================= */

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                if (
                    adminSession &&
                    adminSession.access_token
                ) {

                    await fetch(
                        `${SUPABASE_URL}/auth/v1/logout`,
                        {
                            method: "POST",

                            headers:
                                supabaseHeaders(
                                    adminSession.access_token
                                )
                        }
                    );

                }

            } catch (error) {

                console.warn(
                    "Logout error:",
                    error
                );

            }


            clearSession();


            if (dashboardModal) {

                dashboardModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================
   RESTORE ADMIN SESSION
========================================= */

async function restoreAdminSession() {

    const saved =
        getStoredSession();


    if (
        !saved ||
        !saved.access_token ||
        !saved.user
    ) {

        return;

    }


    if (
        saved.user.id !== ADMIN_UID
    ) {

        clearSession();

        return;

    }


    adminSession =
        saved;


    if (dashboardModal) {
        dashboardModal.classList.add("active");
    }


    await loadContents();

    await loadMessages();

}


/* =========================================
   BACK TO TOP
========================================= */

const backTop =
    document.getElementById("backTop");


if (backTop) {

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 400) {

                backTop.classList.add("show");

            } else {

                backTop.classList.remove("show");

            }

        }
    );


    backTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeSettingsPanel();


            document
                .querySelectorAll(".modal.active")
                .forEach(modal => {

                    modal.classList.remove(
                        "active"
                    );

                });

        }

    }
);


/* =========================================
   START APPLICATION
========================================= */

setupAdminUploadUI();

createMessagesSection();

loadContents();

restoreAdminSession();

showPage("home");
