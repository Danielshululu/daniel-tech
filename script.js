/* =========================================================
   DANIEL TECH
   COMPLETE SCRIPT.JS
   Supabase + Navigation + Content + Services + Features
   Admin + Messages + File Upload
   ========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
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
   APPLICATION STATE
   ========================================================= */

const state = {
    session: null,

    contents: [],

    services: [],

    features: [],

    editingContentId: null,

    editingServiceId: null,

    editingFeatureId: null
};


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}


function escapeHTML(value) {
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


function formatDate(date) {
    if (!date) {
        return "";
    }

    try {
        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    } catch {
        return "";
    }
}


function show(element) {
    if (!element) {
        return;
    }

    element.style.display = "flex";
    element.classList.add("active");
}


function hide(element) {
    if (!element) {
        return;
    }

    element.style.display = "none";
    element.classList.remove("active");
}


/* =========================================================
   OVERLAY
   ========================================================= */

function openOverlay() {
    const overlay = $("overlay");

    if (!overlay) {
        return;
    }

    overlay.style.display = "block";
    overlay.classList.add("active");
}


function closeOverlay() {
    const overlay = $("overlay");

    if (!overlay) {
        return;
    }

    overlay.style.display = "none";
    overlay.classList.remove("active");
}


/* =========================================================
   MODALS
   ========================================================= */

function closeAllModals() {

    document
        .querySelectorAll(".modal")
        .forEach(modal => {
            hide(modal);
        });

    closeOverlay();
}


document.addEventListener(
    "click",
    function (event) {

        const closeButton =
            event.target.closest(
                "[data-close-modal]"
            );

        if (!closeButton) {
            return;
        }

        closeAllModals();
    }
);


document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {
            closeAllModals();
        }
    }
);


/* =========================================================
   NAVIGATION
   ========================================================= */

function navigateTo(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.style.display = "none";

            page.classList.remove(
                "active-page"
            );
        });


    const target =
        $(pageName);

    if (!target) {
        return;
    }


    target.style.display = "block";

    target.classList.add(
        "active-page"
    );


    document
        .querySelectorAll("[data-page]")
        .forEach(button => {

            if (
                button.dataset.page ===
                pageName
            ) {

                button.classList.add(
                    "active"
                );

            } else {

                button.classList.remove(
                    "active"
                );
            }
        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    const mobileMenu =
        $("mobileMenu");

    if (mobileMenu) {
        mobileMenu.classList.remove(
            "active"
        );
    }
}


document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-page]"
            );

        if (!button) {
            return;
        }

        event.preventDefault();

        const page =
            button.dataset.page;

        if (page) {
            navigateTo(page);
        }
    }
);


/* =========================================================
   SETTINGS PANEL
   ========================================================= */

function openSettings() {

    const panel =
        $("settingsPanel");

    if (!panel) {
        return;
    }

    panel.classList.add(
        "active"
    );

    panel.style.display = "block";
}


function closeSettings() {

    const panel =
        $("settingsPanel");

    if (!panel) {
        return;
    }

    panel.classList.remove(
        "active"
    );

    panel.style.display = "none";
}


document.addEventListener(
    "click",
    function (event) {

        const settingsButton =
            event.target.closest(
                "#settingsButton"
            );

        if (
            settingsButton
        ) {

            event.preventDefault();

            openSettings();

            return;
        }


        const closeButton =
            event.target.closest(
                "#closeSettings"
            );

        if (closeButton) {

            event.preventDefault();

            closeSettings();

            return;
        }
    }
);


/* =========================================================
   MOBILE MENU
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const menuButton =
            event.target.closest(
                "#menuButton"
            );

        if (!menuButton) {
            return;
        }

        const nav =
            $("mainNav");

        if (!nav) {
            return;
        }

        nav.classList.toggle(
            "active"
        );
    }
);


/* =========================================================
   DARK MODE
   ========================================================= */

function applyDarkMode(enabled) {

    if (enabled) {

        document.body.classList.add(
            "dark-mode"
        );

    } else {

        document.body.classList.remove(
            "dark-mode"
        );
    }


    localStorage.setItem(
        "danielTechDarkMode",
        enabled ? "true" : "false"
    );


    const checkbox =
        $("settingsDarkMode");

    if (checkbox) {
        checkbox.checked =
            enabled;
    }
}


function restoreDarkMode() {

    const saved =
        localStorage.getItem(
            "danielTechDarkMode"
        );

    const enabled =
        saved === "true";

    applyDarkMode(
        enabled
    );
}


document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "#darkModeButton"
            );

        if (!button) {
            return;
        }

        const enabled =
            !document.body.classList.contains(
                "dark-mode"
            );

        applyDarkMode(
            enabled
        );
    }
);


document.addEventListener(
    "change",
    function (event) {

        if (
            event.target.id !==
            "settingsDarkMode"
        ) {
            return;
        }

        applyDarkMode(
            event.target.checked
        );
    }
);


/* =========================================================
   ABOUT
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "#aboutButton"
            );

        if (!button) {
            return;
        }

        const modal =
            $("aboutModal");

        if (!modal) {
            return;
        }

        show(modal);

        openOverlay();
    }
);


/* =========================================================
   SUPABASE HEADERS
   ========================================================= */

function getHeaders(authenticated = false) {

    const headers = {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json"
    };


    if (
        authenticated &&
        state.session &&
        state.session.access_token
    ) {

        headers.Authorization =
            `Bearer ${state.session.access_token}`;
    }


    return headers;
}


/* =========================================================
   ADMIN CHECK
   ========================================================= */

function isAdmin() {

    return (
        state.session &&
        state.session.user &&
        state.session.user.id ===
        ADMIN_UID
    );
}


/* =========================================================
   REFRESH ADMIN SESSION
   ========================================================= */

async function refreshAdminSession() {

    if (
        !state.session ||
        !state.session.refresh_token
    ) {
        return false;
    }


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
                {
                    method: "POST",

                    headers: {
                        apikey:
                            SUPABASE_KEY,

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            refresh_token:
                                state.session.refresh_token
                        })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.access_token ||
            !data.user
        ) {

            state.session =
                null;

            localStorage.removeItem(
                "danielTechSession"
            );

            return false;
        }


        state.session = {

            access_token:
                data.access_token,

            refresh_token:
                data.refresh_token ||
                state.session.refresh_token,

            user:
                data.user
        };


        localStorage.setItem(
            "danielTechSession",
            JSON.stringify(
                state.session
            )
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
   ENSURE ADMIN SESSION
   ========================================================= */

async function ensureAdminSession() {

    if (!isAdmin()) {
        return false;
    }

    return await refreshAdminSession();
}


/* =========================================================
   SUPABASE REQUEST
   ========================================================= */

async function supabaseRequest(
    endpoint,
    options = {},
    authenticated = false
) {

    let headers = {
        ...getHeaders(
            authenticated
        ),

        ...(options.headers || {})
    };


    let response =
        await fetch(
            `${SUPABASE_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );


    if (
        authenticated &&
        (
            response.status === 401 ||
            response.status === 403
        )
    ) {

        const refreshed =
            await refreshAdminSession();


        if (refreshed) {

            headers = {
                ...getHeaders(true),

                ...(options.headers || {})
            };


            response =
                await fetch(
                    `${SUPABASE_URL}${endpoint}`,
                    {
                        ...options,
                        headers
                    }
                );
        }
    }


    return response;
}


/* =========================================================
   LOGIN
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const adminButton =
            event.target.closest(
                "#adminButton"
            );

        if (!adminButton) {
            return;
        }

        event.preventDefault();


        if (isAdmin()) {

            openDashboard();

            return;
        }


        const modal =
            $("adminLoginModal");

        if (!modal) {
            return;
        }


        show(modal);

        openOverlay();
    }
);


/* =========================================================
   ADMIN LOGIN FORM
   ========================================================= */

document.addEventListener(
    "submit",
    async function (event) {

        const form =
            event.target.closest(
                "#adminLoginForm"
            );

        if (!form) {
            return;
        }

        event.preventDefault();


        const username =
            $("adminUsername")
                ?.value
                .trim();

        const password =
            $("adminPassword")
                ?.value;


        const message =
            $("loginMessage");


        if (
            !username ||
            !password
        ) {

            if (message) {
                message.textContent =
                    "Please enter your login details.";
            }

            return;
        }


        if (message) {
            message.textContent =
                "Logging in...";
        }


        try {

            const response =
                await fetch(
                    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
                    {
                        method: "POST",

                        headers: {
                            apikey:
                                SUPABASE_KEY,

                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                email:
                                    username,

                                password:
                                    password
                            })
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.access_token ||
                !data.user
            ) {

                throw new Error(
                    data.error_description ||
                    data.msg ||
                    "Login failed."
                );
            }


            state.session = {

                access_token:
                    data.access_token,

                refresh_token:
                    data.refresh_token,

                user:
                    data.user
            };


            if (!isAdmin()) {

                state.session =
                    null;

                throw new Error(
                    "This account is not the Daniel Tech administrator account."
                );
            }


            localStorage.setItem(
                "danielTechSession",
                JSON.stringify(
                    state.session
                )
            );


            if (message) {
                message.textContent =
                    "Login successful.";
            }


            form.reset();

            closeAllModals();

            openDashboard();


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            if (message) {
                message.textContent =
                    error.message ||
                    "Login failed.";
            }
        }
    }
);


/* =========================================================
   RESTORE SESSION
   ========================================================= */

async function restoreAdminSession() {

    const saved =
        localStorage.getItem(
            "danielTechSession"
        );


    if (!saved) {
        return;
    }


    try {

        state.session =
            JSON.parse(saved);


        if (!isAdmin()) {

            state.session =
                null;

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


        state.session =
            null;

        localStorage.removeItem(
            "danielTechSession"
        );
    }
}


/* =========================================================
   OPEN ADMIN DASHBOARD
   ========================================================= */

function openDashboard() {

    if (!isAdmin()) {

        const modal =
            $("adminLoginModal");

        if (modal) {

            show(modal);

            openOverlay();
        }

        return;
    }


    const dashboard =
        $("dashboardModal");


    if (!dashboard) {

        console.error(
            "dashboardModal not found."
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
   SERVICES - LOAD
   ========================================================= */

async function loadServices() {

    try {

        const response =
            await supabaseRequest(
                "/rest/v1/services?select=*&order=display_order.asc,created_at.asc",
                {},
                false
            );


        if (!response.ok) {

            console.error(
                "Services error:",
                await response.text()
            );

            return;
        }


        state.services =
            await response.json();


        renderServicesOnWebsite();

        renderAdminServices();


    } catch (error) {

        console.error(
            "Could not load services:",
            error
        );
    }
}


/* =========================================================
   SERVICES - WEBSITE
   ========================================================= */

function renderServicesOnWebsite() {

    const buttons =
        document.querySelectorAll(
            ".service-view-button"
        );


    buttons.forEach(button => {

        const key =
            button.dataset.service;


        const service =
            state.services.find(
                item =>
                    String(
                        item.icon || ""
                    ).toLowerCase() ===
                    String(
                        key || ""
                    ).toLowerCase()
            );


        if (!service) {
            return;
        }


        button.textContent =
            "View Service";


        button.onclick =
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                openServiceDetails(
                    service
                );
            };
    });
}


/* =========================================================
   SERVICE DETAILS
   ========================================================= */

function openServiceDetails(service) {

    const modal =
        $("serviceModal");

    const title =
        $("serviceModalTitle");

    const text =
        $("serviceModalText");


    if (title) {

        title.textContent =
            service.title ||
            "Service";
    }


    if (text) {

        text.textContent =
            service.description ||
            "No service information available.";
    }


    if (modal) {

        show(modal);

        openOverlay();
    }
}


/* =========================================================
   FEATURES - LOAD
   ========================================================= */

async function loadFeatures() {

    try {

        const response =
            await supabaseRequest(
                "/rest/v1/features?select=*&order=display_order.asc,created_at.asc",
                {},
                false
            );


        if (!response.ok) {

            console.error(
                "Features error:",
                await response.text()
            );

            return;
        }


        state.features =
            await response.json();


        renderFeaturesOnWebsite();

        renderAdminFeatures();


    } catch (error) {

        console.error(
            "Could not load features:",
            error
        );
    }
}


/* =========================================================
   FEATURES - WEBSITE
   ========================================================= */

function renderFeaturesOnWebsite() {

    const buttons =
        document.querySelectorAll(
            ".feature-view-button"
        );


    buttons.forEach(button => {

        const key =
            button.dataset.feature;


        const feature =
            state.features.find(
                item =>
                    String(
                        item.icon || ""
                    ).toLowerCase() ===
                    String(
                        key || ""
                    ).toLowerCase()
            );


        if (!feature) {
            return;
        }


        button.textContent =
            "Explore";


        button.onclick =
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                openFeatureDetails(
                    feature
                );
            };
    });
}


/* =========================================================
   FEATURE DETAILS
   ========================================================= */

function openFeatureDetails(feature) {

    const modal =
        $("featureModal");

    const title =
        $("featureModalTitle");

    const text =
        $("featureModalText");


    if (title) {

        title.textContent =
            feature.title ||
            "Feature";
    }


    if (text) {

        text.textContent =
            feature.description ||
            "No feature information available.";
    }


    if (modal) {

        show(modal);

        openOverlay();
    }
}


/* =========================================================
   CONTENT - LOAD
   ========================================================= */

async function loadContents() {

    try {

        const response =
            await supabaseRequest(
                "/rest/v1/contents?select=*&order=created_at.desc",
                {},
                false
            );


        if (!response.ok) {

            console.error(
                "Contents error:",
                await response.text()
            );

            return;
        }


        state.contents =
            await response.json();


        renderLatestContent();

        renderBlog();

        updateNewsBar();

        renderAdminContent();


    } catch (error) {

        console.error(
            "Could not load contents:",
            error
        );
    }
}


/* =========================================================
   CONTENT DESCRIPTION HELPER
   ========================================================= */

function getContentText(item) {

    return (
        item.description ||
        item.content ||
        item.text ||
        ""
    );
}


/* =========================================================
   LATEST CONTENT
   ========================================================= */

function renderLatestContent() {

    const container =
        $("latestContent");


    if (!container) {
        return;
    }


    if (!state.contents.length) {

        container.innerHTML = `
            <div class="empty-content">
                No content has been published yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        state.contents
            .slice(0, 6)
            .map(item => {

                return `
                    <article class="content-card">

                        <div class="card-number">
                            ${escapeHTML(
                                String(
                                    item.id || ""
                                )
                            )}
                        </div>

                        <h3>
                            ${escapeHTML(
                                item.title || ""
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                getContentText(
                                    item
                                )
                            )}
                        </p>

                        <small>
                            ${formatDate(
                                item.created_at
                            )}
                        </small>

                    </article>
                `;

            })
            .join("");
}


/* =========================================================
   BLOG
   ========================================================= */

function renderBlog() {

    const container =
        $("blogGrid");


    if (!container) {
        return;
    }


    const blogItems =
        state.contents.filter(
            item => {

                const type =
                    String(
                        item.type ||
                        item.category ||
                        ""
                    ).toLowerCase();

                return (
                    type === "news" ||
                    type === "blog"
                );
            }
        );


    if (!blogItems.length) {

        container.innerHTML = `
            <div class="empty-content">
                No blog content has been published yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        blogItems
            .map(item => {

                return `
                    <article class="blog-card">

                        <p class="modal-label">
                            ${escapeHTML(
                                item.type ||
                                "NEWS"
                            )}
                        </p>

                        <h3>
                            ${escapeHTML(
                                item.title || ""
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                getContentText(
                                    item
                                )
                            )}
                        </p>

                        <small>
                            ${formatDate(
                                item.created_at
                            )}
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

    const newsContainer =
        $("newsContent");


    if (!newsContainer) {
        return;
    }


    const news =
        state.contents.filter(
            item =>
                String(
                    item.type ||
                    item.category ||
                    ""
                ).toLowerCase() ===
                "news"
        );


    if (!news.length) {

        newsContainer.textContent =
            "Welcome to Daniel Tech.";

        return;
    }


    newsContainer.textContent =
        news
            .slice(0, 5)
            .map(
                item =>
                    item.title
            )
            .filter(Boolean)
            .join("   |   ");
}


/* =========================================================
   COMMENTS
   ========================================================= */

function loadComments() {

    const container =
        $("commentsList");


    if (!container) {
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
            .map(comment => {

                return `
                    <div class="comment-item">

                        <strong>
                            ${escapeHTML(
                                comment.name
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                comment.text
                            )}
                        </p>

                    </div>
                `;

            })
            .join("");
}


/* =========================================================
   COMMENT FORM
   ========================================================= */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "#commentForm"
            );


        if (!form) {
            return;
        }


        event.preventDefault();


        const nameInput =
            $("commentName");

        const textInput =
            $("commentText");


        const name =
            nameInput?.value.trim();

        const text =
            textInput?.value.trim();


        if (!name || !text) {

            alert(
                "Please enter your name and comment."
            );

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

            created_at:
                new Date().toISOString()
        });


        localStorage.setItem(
            "danielTechComments",
            JSON.stringify(
                comments
            )
        );


        form.reset();

        loadComments();
    }
);


/* =========================================================
   CONTACT FORM
   ========================================================= */

document.addEventListener(
    "submit",
    async function (event) {

        const form =
            event.target.closest(
                "#contactForm"
            );


        if (!form) {
            return;
        }


        event.preventDefault();


        const name =
            $("contactName")
                ?.value.trim();

        const email =
            $("contactEmail")
                ?.value.trim();

        const subject =
            $("contactSubject")
                ?.value.trim();

        const message =
            $("contactMessage")
                ?.value.trim();

        const status =
            $("contactStatus");


        if (
            !name ||
            !email ||
            !subject ||
            !message
        ) {

            if (status) {
                status.textContent =
                    "Please fill in all fields.";
            }

            return;
        }


        if (status) {
            status.textContent =
                "Sending...";
        }


        try {

            const response =
                await supabaseRequest(
                    "/rest/v1/message",
                    {
                        method: "POST",

                        headers: {
                            Prefer:
                                "return=minimal"
                        },

                        body:
                            JSON.stringify({

                                name,

                                email,

                                subject,

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


            if (status) {
                status.textContent =
                    "Message sent successfully.";
            }


            form.reset();


        } catch (error) {

            console.error(
                "Contact error:",
                error
            );


            if (status) {
                status.textContent =
                    "Failed to send message. Please try again.";
            }
        }
    }
);


/* =========================================================
   ADMIN MANAGEMENT PANEL
   ========================================================= */

function createManagementPanel() {

    if (!isAdmin()) {
        return;
    }


    const dashboard =
        $("dashboardModal");


    if (!dashboard) {
        return;
    }


    if (
        dashboard.querySelector(
            ".management-panel"
        )
    ) {
        return;
    }


    const panel =
        document.createElement(
            "div"
        );


    panel.className =
        "management-panel";


    panel.innerHTML = `

        <div class="management-header">

            <p class="modal-label">
                WEBSITE MANAGEMENT
            </p>

            <h2>
                Services & Features
            </h2>

        </div>


        <!-- SERVICES -->

        <section class="management-section">

            <div class="management-section-header">

                <h3>
                    Services
                </h3>

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

                <div class="form-group">

                    <label>
                        Service Title
                    </label>

                    <input
                        type="text"
                        id="serviceTitle"
                        placeholder="Example: Web Development">

                </div>


                <div class="form-group">

                    <label>
                        Service Description
                    </label>

                    <textarea
                        id="serviceDescription"
                        placeholder="Describe the service"></textarea>

                </div>


                <div class="form-group">

                    <label>
                        Service Key
                    </label>

                    <input
                        type="text"
                        id="serviceIcon"
                        placeholder="Example: web">

                </div>


                <div class="form-group">

                    <label>
                        Display Order
                    </label>

                    <input
                        type="number"
                        id="serviceOrder"
                        value="0">

                </div>


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


        <!-- FEATURES -->

        <section class="management-section">

            <div class="management-section-header">

                <h3>
                    Features
                </h3>

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

                <div class="form-group">

                    <label>
                        Feature Title
                    </label>

                    <input
                        type="text"
                        id="featureTitle"
                        placeholder="Example: Programming">

                </div>


                <div class="form-group">

                    <label>
                        Feature Description
                    </label>

                    <textarea
                        id="featureDescription"
                        placeholder="Describe the feature"></textarea>

                </div>


                <div class="form-group">

                    <label>
                        Feature Key
                    </label>

                    <input
                        type="text"
                        id="featureIcon"
                        placeholder="Example: programming">

                </div>


                <div class="form-group">

                    <label>
                        Display Order
                    </label>

                    <input
                        type="number"
                        id="featureOrder"
                        value="0">

                </div>


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


    if (
        logout &&
        logout.parentNode
    ) {

        logout.parentNode.insertBefore(
            panel,
            logout
        );

    } else {

        const box =
            dashboard.querySelector(
                ".dashboard-box"
            );

        if (box) {
            box.appendChild(panel);
        }
    }


    setupManagementButtons();
}


/* =========================================================
   SERVICE ADMIN LIST
   ========================================================= */

function renderAdminServices() {

    const container =
        $("adminServicesList");


    if (!container) {
        return;
    }


    if (!state.services.length) {

        container.innerHTML = `
            <p class="empty-content">
                No services available.
            </p>
        `;

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
   FEATURE ADMIN LIST
   ========================================================= */

function renderAdminFeatures() {

    const container =
        $("adminFeaturesList");


    if (!container) {
        return;
    }


    if (!state.features.length) {

        container.innerHTML = `
            <p class="empty-content">
                No features available.
            </p>
        `;

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

        addService.onclick =
            function () {

                state.editingServiceId =
                    null;


                $("serviceTitle").value =
                    "";

                $("serviceDescription").value =
                    "";

                $("serviceIcon").value =
                    "";

                $("serviceOrder").value =
                    "0";


                show(
                    $("serviceEditor")
                );
            };
    }


    if (cancelService) {

        cancelService.onclick =
            function () {

                state.editingServiceId =
                    null;

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

        addFeature.onclick =
            function () {

                state.editingFeatureId =
                    null;


                $("featureTitle").value =
                    "";

                $("featureDescription").value =
                    "";

                $("featureIcon").value =
                    "";

                $("featureOrder").value =
                    "0";


                show(
                    $("featureEditor")
                );
            };
    }


    if (cancelFeature) {

        cancelFeature.onclick =
            function () {

                state.editingFeatureId =
                    null;

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

    if (
        !(await ensureAdminSession())
    ) {

        alert(
            "Admin session expired. Please login again."
        );

        return;
    }


    const title =
        $("serviceTitle")
            ?.value
            .trim();

    const description =
        $("serviceDescription")
            ?.value
            .trim();

    const icon =
        $("serviceIcon")
            ?.value
            .trim();

    const order =
        Number(
            $("serviceOrder")
                ?.value || 0
        );


    if (
        !title ||
        !description ||
        !icon
    ) {

        alert(
            "Please fill in title, description and service key."
        );

        return;
    }


    const data = {

        title,

        description,

        icon,

        display_order:
            order
    };


    try {

        let response;


        if (
            state.editingServiceId
        ) {

            response =
                await supabaseRequest(
                    `/rest/v1/services?id=eq.${state.editingServiceId}`,
                    {
                        method: "PATCH",

                        headers: {
                            Prefer:
                                "return=representation"
                        },

                        body:
                            JSON.stringify(
                                data
                            )
                    },
                    true
                );

        } else {

            response =
                await supabaseRequest(
                    "/rest/v1/services",
                    {
                        method: "POST",

                        headers: {
                            Prefer:
                                "return=representation"
                        },

                        body:
                            JSON.stringify(
                                data
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


        state.editingServiceId =
            null;


        hide(
            $("serviceEditor")
        );


        await loadServices();


        alert(
            "Service saved successfully."
        );


    } catch (error) {

        console.error(
            "Save service error:",
            error
        );


        alert(
            "Could not save service:\n" +
            error.message
        );
    }
}


/* =========================================================
   SAVE FEATURE
   ========================================================= */

async function saveFeatureToDatabase() {

    if (
        !(await ensureAdminSession())
    ) {

        alert(
            "Admin session expired. Please login again."
        );

        return;
    }


    const title =
        $("featureTitle")
            ?.value
            .trim();

    const description =
        $("featureDescription")
            ?.value
            .trim();

    const icon =
        $("featureIcon")
            ?.value
            .trim();

    const order =
        Number(
            $("featureOrder")
                ?.value || 0
        );


    if (
        !title ||
        !description ||
        !icon
    ) {

        alert(
            "Please fill in title, description and feature key."
        );

        return;
    }


    const data = {

        title,

        description,

        icon,

        display_order:
            order
    };


    try {

        let response;


        if (
            state.editingFeatureId
        ) {

            response =
                await supabaseRequest(
                    `/rest/v1/features?id=eq.${state.editingFeatureId}`,
                    {
                        method: "PATCH",

                        headers: {
                            Prefer:
                                "return=representation"
                        },

                        body:
                            JSON.stringify(
                                data
                            )
                    },
                    true
                );

        } else {

            response =
                await supabaseRequest(
                    "/rest/v1/features",
                    {
                        method: "POST",

                        headers: {
                            Prefer:
                                "return=representation"
                        },

                        body:
                            JSON.stringify(
                                data
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


        state.editingFeatureId =
            null;


        hide(
            $("featureEditor")
        );


        await loadFeatures();


        alert(
            "Feature saved successfully."
        );


    } catch (error) {

        console.error(
            "Save feature error:",
            error
        );


        alert(
            "Could not save feature:\n" +
            error.message
        );
    }
}


/* =========================================================
   EDIT / DELETE SERVICE
   ========================================================= */

document.addEventListener(
    "click",
    async function (event) {

        const editButton =
            event.target.closest(
                ".edit-service-button"
            );


        const deleteButton =
            event.target.closest(
                ".delete-service-button"
            );


        /* EDIT */

        if (editButton) {

            const id =
                editButton.dataset.id;


            const service =
                state.services.find(
                    item =>
                        String(item.id) ===
                        String(id)
                );


            if (!service) {
                return;
            }


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


        /* DELETE */

        if (deleteButton) {

            const id =
                deleteButton.dataset.id;


            if (
                !confirm(
                    "Are you sure you want to delete this service?"
                )
            ) {
                return;
            }


            if (
                !(await ensureAdminSession())
            ) {

                alert(
                    "Admin session expired. Please login again."
                );

                return;
            }


            try {

                const response =
                    await supabaseRequest(
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
                    "Could not delete service:\n" +
                    error.message
                );
            }
        }
    }
);


/* =========================================================
   EDIT / DELETE FEATURE
   ========================================================= */

document.addEventListener(
    "click",
    async function (event) {

        const editButton =
            event.target.closest(
                ".edit-feature-button"
            );


        const deleteButton =
            event.target.closest(
                ".delete-feature-button"
            );


        /* EDIT */

        if (editButton) {

            const id =
                editButton.dataset.id;


            const feature =
                state.features.find(
                    item =>
                        String(item.id) ===
                        String(id)
                );


            if (!feature) {
                return;
            }


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


        /* DELETE */

        if (deleteButton) {

            const id =
                deleteButton.dataset.id;


            if (
                !confirm(
                    "Are you sure you want to delete this feature?"
                )
            ) {
                return;
            }


            if (
                !(await ensureAdminSession())
            ) {

                alert(
                    "Admin session expired. Please login again."
                );

                return;
            }


            try {

                const response =
                    await supabaseRequest(
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
                    "Could not delete feature:\n" +
                    error.message
                );
            }
        }
    }
);


/* =========================================================
   ADMIN CONTENT EDITOR
   ========================================================= */

function prepareContentEditor(
    content = null,
    type = "news"
) {

    state.editingContentId =
        content?.id || null;


    const editor =
        $("adminEditor");


    if (!editor) {
        return;
    }


    const title =
        $("contentTitle");

    const category =
        $("contentCategory");

    const text =
        $("contentText");

    const file =
        $("contentFile");


    if (title) {

        title.value =
            content?.title || "";
    }


    if (category) {

        category.value =
            content?.type ||
            content?.category ||
            type;
    }


    if (text) {

        text.value =
            content
                ? getContentText(content)
                : "";
    }


    if (file) {
        file.value = "";
    }


    show(editor);
}


/* =========================================================
   ADD CONTENT BUTTONS
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const newsButton =
            event.target.closest(
                "#addNewsButton"
            );


        const tipButton =
            event.target.closest(
                "#addTipButton"
            );


        const videoButton =
            event.target.closest(
                "#addVideoButton"
            );


        const pdfButton =
            event.target.closest(
                "#addPdfButton"
            );


        if (newsButton) {

            prepareContentEditor(
                null,
                "news"
            );

            return;
        }


        if (tipButton) {

            prepareContentEditor(
                null,
                "tip"
            );

            return;
        }


        if (videoButton) {

            prepareContentEditor(
                null,
                "video"
            );

            return;
        }


        if (pdfButton) {

            prepareContentEditor(
                null,
                "pdf"
            );

            return;
        }
    }
);


/* =========================================================
   SAVE CONTENT BUTTON
   ========================================================= */

document.addEventListener(
    "click",
    async function (event) {

        const button =
            event.target.closest(
                "#saveContentButton"
            );


        if (!button) {
            return;
        }


        if (
            !(await ensureAdminSession())
        ) {

            alert(
                "Admin session expired. Please login again."
            );

            return;
        }


        const title =
            $("contentTitle")
                ?.value
                .trim();


        const type =
            $("contentCategory")
                ?.value ||
            "news";


        const text =
            $("contentText")
                ?.value
                .trim();


        const fileInput =
            $("contentFile");


        const file =
            fileInput?.files?.[0] ||
            null;


        const status =
            $("contentStatus");


        if (!title || !text) {

            if (status) {
                status.textContent =
                    "Please enter title and content.";
            }

            return;
        }


        if (status) {
            status.textContent =
                "Saving...";
        }


        try {

            let fileUrl = null;


            if (file) {

                if (status) {
                    status.textContent =
                        "Uploading file...";
                }


                fileUrl =
                    await uploadFile(
                        file
                    );
            }


            const payload = {

                title,

                type,

                description:
                    text
            };


            if (fileUrl) {

                payload.file_url =
                    fileUrl;
            }


            let response;


            if (
                state.editingContentId
            ) {

                response =
                    await supabaseRequest(
                        `/rest/v1/contents?id=eq.${state.editingContentId}`,
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
                    await supabaseRequest(
                        "/rest/v1/contents",
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


            state.editingContentId =
                null;


            $("contentTitle").value =
                "";

            $("contentText").value =
                "";

            $("contentFile").value =
                "";


            if (status) {
                status.textContent =
                    "Content published successfully.";
            }


            await loadContents();


        } catch (error) {

            console.error(
                "Save content error:",
                error
            );


            if (status) {

                status.textContent =
                    "Could not save content: " +
                    error.message;
            }
        }
    }
);


/* =========================================================
   ADMIN CONTENT LIST
   ========================================================= */

function renderAdminContent() {

    const container =
        $("adminContentList");


    if (!container) {
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
                                    item.type ||
                                    item.category ||
                                    ""
                                )}
                                -
                                ${formatDate(
                                    item.created_at
                                )}
                            </small>

                        </div>


                        <div class="management-actions">

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


/* =========================================================
   EDIT / DELETE CONTENT
   ========================================================= */

document.addEventListener(
    "click",
    async function (event) {

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

                prepareContentEditor(
                    content,
                    content.type ||
                    "news"
                );
            }


            return;
        }


        if (deleteButton) {

            const id =
                deleteButton.dataset.id;


            if (
                !confirm(
                    "Are you sure you want to delete this content?"
                )
            ) {
                return;
            }


            if (
                !(await ensureAdminSession())
            ) {

                alert(
                    "Admin session expired. Please login again."
                );

                return;
            }


            try {

                const response =
                    await supabaseRequest(
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
                    "Could not delete content:\n" +
                    error.message
                );
            }
        }
    }
);


/* =========================================================
   FILE UPLOAD
   ========================================================= */

async function uploadFile(file) {

    if (!file) {

        throw new Error(
            "No file selected."
        );
    }


    if (
        !(await ensureAdminSession())
    ) {

        throw new Error(
            "Admin session expired."
        );
    }


    const safeName =
        file.name
            .replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );


    const path =
        `${Date.now()}-${safeName}`;


    const response =
        await supabaseRequest(
            `/storage/v1/object/${STORAGE_BUCKET}/${path}`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        file.type ||
                        "application/octet-stream",

                    "x-upsert":
                        "false"
                },

                body:
                    file
            },
            true
        );


    if (!response.ok) {

        throw new Error(
            await response.text()
        );
    }


    return (
        `${SUPABASE_URL}/storage/v1/object/public/` +
        `${STORAGE_BUCKET}/${path}`
    );
}


/* =========================================================
   ADMIN MESSAGES
   ========================================================= */

async function loadAdminMessages() {

    if (!isAdmin()) {
        return;
    }


    const dashboard =
        $("dashboardModal");


    if (!dashboard) {
        return;
    }


    let section =
        dashboard.querySelector(
            ".admin-messages-section"
        );


    if (!section) {

        section =
            document.createElement(
                "section"
            );


        section.className =
            "admin-messages-section";


        section.innerHTML = `

            <div class="management-section-header">

                <h2>
                    Visitor Messages
                </h2>

            </div>

            <div id="adminMessagesList"></div>

        `;


        const management =
            dashboard.querySelector(
                ".management-panel"
            );


        if (management) {

            management.after(
                section
            );

        } else {

            const box =
                dashboard.querySelector(
                    ".dashboard-box"
                );

            if (box) {
                box.appendChild(
                    section
                );
            }
        }
    }


    const container =
        $("adminMessagesList");


    if (!container) {
        return;
    }


    try {

        const response =
            await supabaseRequest(
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

            container.innerHTML = `
                <p class="empty-content">
                    No messages available.
                </p>
            `;

            return;
        }


        container.innerHTML =
            messages
                .map(message => {

                    return `

                        <div class="admin-message-item">

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        message.name ||
                                        ""
                                    )}
                                </strong>

                                <small>
                                    ${escapeHTML(
                                        message.email ||
                                        ""
                                    )}

                                    -

                                    ${formatDate(
                                        message.created_at
                                    )}
                                </small>

                                ${
                                    message.subject
                                    ? `
                                        <strong>
                                            ${escapeHTML(
                                                message.subject
                                            )}
                                        </strong>
                                    `
                                    : ""
                                }

                                <p>
                                    ${escapeHTML(
                                        message.message ||
                                        ""
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

                })
                .join("");


    } catch (error) {

        console.error(
            "Messages error:",
            error
        );


        container.innerHTML = `
            <p class="empty-content">
                Unable to load messages.
            </p>
        `;
    }
}


/* =========================================================
   DELETE MESSAGE
   ========================================================= */

document.addEventListener(
    "click",
    async function (event) {

        const button =
            event.target.closest(
                ".delete-message-button"
            );


        if (!button) {
            return;
        }


        const id =
            button.dataset.id;


        if (
            !confirm(
                "Are you sure you want to delete this message?"
            )
        ) {
            return;
        }


        if (
            !(await ensureAdminSession())
        ) {

            alert(
                "Admin session expired. Please login again."
            );

            return;
        }


        try {

            const response =
                await supabaseRequest(
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
                "Could not delete message:\n" +
                error.message
            );
        }
    }
);


/* =========================================================
   LOGOUT
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "#logoutButton"
            );


        if (!button) {
            return;
        }


        state.session =
            null;

        state.editingContentId =
            null;

        state.editingServiceId =
            null;

        state.editingFeatureId =
            null;


        localStorage.removeItem(
            "danielTechSession"
        );


        closeAllModals();


        alert(
            "You have been logged out."
        );
    }
);


/* =========================================================
   BACK TO TOP
   ========================================================= */

window.addEventListener(
    "scroll",
    function () {

        const button =
            $("backTop");


        if (!button) {
            return;
        }


        if (
            window.scrollY >
            400
        ) {

            button.style.display =
                "block";

        } else {

            button.style.display =
                "none";
        }
    }
);


document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "#backTop"
            );


        if (!button) {
            return;
        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


/* =========================================================
   OVERLAY CLICK
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.id ===
            "overlay"
        ) {

            closeAllModals();

            closeSettings();
        }
    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Daniel Tech starting..."
        );


        restoreDarkMode();


        navigateTo(
            "home"
        );


        loadComments();


        await restoreAdminSession();


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
            "Daniel Tech loaded successfully."
        );
    }
);
