/* =========================================
   DANIEL TECH
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   SUPABASE CONNECTION
========================================= */

const SUPABASE_URL = "WEKA_PROJECT_URL_YAKO_HAPA";
const SUPABASE_KEY = "WEKA_PUBLISHABLE_KEY_YAKO_HAPA";


/* PAGE NAVIGATION */

const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("[data-page]");

function showPage(pageName) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageName);

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

        const page = this.dataset.page;

        if (page) {
            showPage(page);
        }

    });

});


/* BUTTONS THAT OPEN PAGES */

document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", function(event) {

        if (
            this.tagName === "BUTTON" &&
            this.dataset.page
        ) {

            event.preventDefault();

            showPage(this.dataset.page);
        }

    });

});


/* =========================================
   MOBILE MENU
========================================= */

const menuButton = document.getElementById("menuButton");
const navbar = document.querySelector(".navbar");

if (menuButton) {

    menuButton.addEventListener("click", () => {

        navbar.classList.toggle("active");

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

const themeButton = document.getElementById("themeButton");
const settingsThemeButton =
    document.getElementById("settingsThemeButton");


function updateThemeButtons() {

    if (document.body.classList.contains("dark")) {

        if (themeButton) {
            themeButton.textContent = "Light Mode";
        }

        if (settingsThemeButton) {
            settingsThemeButton.textContent = "Light Mode";
        }

    } else {

        if (themeButton) {
            themeButton.textContent = "Dark Mode";
        }

        if (settingsThemeButton) {
            settingsThemeButton.textContent = "Dark Mode";
        }

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
    themeButton.addEventListener("click", toggleTheme);
}

if (settingsThemeButton) {
    settingsThemeButton.addEventListener(
        "click",
        toggleTheme
    );
}


/* LOAD SAVED THEME */

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
   MODAL CLOSE
========================================= */

document.querySelectorAll(".modal-close")
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


document.querySelectorAll(".modal")
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


document.querySelectorAll(".read-service")
.forEach(button => {

    button.addEventListener("click", () => {

        const service =
            button.dataset.service;

        if (serviceTitle) {
            serviceTitle.textContent = service;
        }

        if (serviceDetails) {

            serviceDetails.innerHTML = `
                <p>${serviceInformation[service] || ""}</p>

                <p>
                    More tips and updates about this service
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


document.querySelectorAll(".program-button")
.forEach(button => {

    button.addEventListener("click", () => {

        const feature =
            button.dataset.feature;

        if (featureTitle) {
            featureTitle.textContent = feature;
        }

        if (featureDetails) {

            featureDetails.innerHTML = `
                <p>${featureInformation[feature] || ""}</p>

                <p>
                    New tips for this category can be added
                    from the Admin Dashboard.
                </p>
            `;

        }

        if (featureModal) {
            featureModal.classList.add("active");
        }

    });

});


/* =========================================
   CONTENT STORAGE
========================================= */

let contents =
    JSON.parse(
        localStorage.getItem("danielTechContents")
    ) || [];


function saveContents() {

    localStorage.setItem(
        "danielTechContents",
        JSON.stringify(contents)
    );

}


/* =========================================
   BLOG
========================================= */

function renderBlog() {

    const blogGrid =
        document.getElementById("blogGrid");

    const homeLatest =
        document.getElementById("homeLatest");

    if (!blogGrid || !homeLatest) {
        return;
    }

    blogGrid.innerHTML = "";

    homeLatest.innerHTML = "";


    if (contents.length === 0) {

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

        return;

    }


    const latest =
        [...contents].reverse();


    latest.forEach(item => {

        const article =
            document.createElement("article");

        article.className = "blog-card";

        article.innerHTML = `
            <div class="blog-category">
                ${item.category}
            </div>

            <div class="blog-date">
                ${item.date}
            </div>

            <h3>
                ${item.title}
            </h3>

            <p>
                ${item.text}
            </p>

            ${
                item.file
                ? `<a href="${item.file}"
                     target="_blank"
                     class="read-blog">
                     Open
                   </a>`
                : ""
            }
        `;

        blogGrid.appendChild(article);


        const latestCard =
            document.createElement("article");

        latestCard.className =
            "latest-card";

        latestCard.innerHTML = `
            <div class="blog-category">
                ${item.category}
            </div>

            <h3>
                ${item.title}
            </h3>

            <p>
                ${item.text}
            </p>

            <button class="read-blog">
                Read More
            </button>
        `;

        homeLatest.appendChild(latestCard);

    });

}


renderBlog();


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

        div.className = "comment-item";

        div.innerHTML = `
            <strong>
                ${comment.name}
            </strong>

            <p>
                ${comment.text}
            </p>
        `;

        commentsList.appendChild(div);

    });

}


if (commentForm) {

    commentForm.addEventListener("submit", event => {

        event.preventDefault();

        const name =
            document.getElementById("commentName").value;

        const text =
            document.getElementById("commentText").value;


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

    });

}


renderComments();


/* =========================================
   CONTACT FORM - SUPABASE
========================================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const form = event.target;

            /*
                These selectors work with the
                first text input, email input,
                and textarea inside the contact form.
            */

            const nameInput =
                form.querySelector(
                    'input[type="text"]'
                );

            const emailInput =
                form.querySelector(
                    'input[type="email"]'
                );

            const messageInput =
                form.querySelector("textarea");


            if (
                !nameInput ||
                !emailInput ||
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

            const message =
                messageInput.value.trim();


            if (
                !name ||
                !email ||
                !message
            ) {

                alert(
                    "Please fill in all fields."
                );

                return;

            }


            if (
                SUPABASE_URL.includes("WEKA_") ||
                SUPABASE_KEY.includes("WEKA_")
            ) {

                alert(
                    "Supabase is not configured yet."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        `${SUPABASE_URL}/rest/v1/messages`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "apikey":
                                    SUPABASE_KEY,

                                "Authorization":
                                    `Bearer ${SUPABASE_KEY}`,

                                "Prefer":
                                    "return=minimal"
                            },

                            body:
                                JSON.stringify({
                                    name: name,
                                    email: email,
                                    message: message
                                })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "Supabase error:",
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
   ADMIN LOGIN
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


if (adminButton) {

    adminButton.addEventListener("click", () => {

        closeSettingsPanel();

        if (adminModal) {
            adminModal.classList.add("active");
        }

    });

}


/*
    DEMO ADMIN LOGIN

    Username: admin
    Password: danieltech
*/


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("adminName")
                    .value
                    .trim();

            const username =
                document
                    .getElementById("adminUsername")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("adminPassword")
                    .value;


            if (
                name !== "" &&
                username === "admin" &&
                password === "danieltech"
            ) {

                localStorage.setItem(
                    "danielTechAdmin",
                    "true"
                );

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

                renderAdminContents();

            } else {

                if (loginMessage) {

                    loginMessage.textContent =
                        "Invalid admin details.";

                }

            }

        }
    );

}


/* =========================================
   ADMIN DASHBOARD
========================================= */

const saveContentButton =
    document.getElementById("saveContentButton");


if (saveContentButton) {

    saveContentButton.addEventListener(
        "click",
        () => {

            const title =
                document
                    .getElementById("contentTitle")
                    .value
                    .trim();

            const category =
                document
                    .getElementById("contentCategory")
                    .value;

            const text =
                document
                    .getElementById("contentText")
                    .value
                    .trim();

            const file =
                document
                    .getElementById("contentFile")
                    .value
                    .trim();


            if (
                title === "" ||
                text === ""
            ) {

                alert(
                    "Please enter title and content."
                );

                return;

            }


            const newContent = {

                id: Date.now(),

                title: title,

                category: category,

                text: text,

                file: file,

                date:
                    new Date()
                        .toLocaleDateString()

            };


            contents.push(newContent);

            saveContents();

            renderBlog();

            renderAdminContents();


            document.getElementById(
                "contentTitle"
            ).value = "";

            document.getElementById(
                "contentText"
            ).value = "";

            document.getElementById(
                "contentFile"
            ).value = "";


            alert(
                "Content added successfully."
            );

        }
    );

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
                ${item.title}
            </h4>

            <p>
                ${item.category}
            </p>

            <p>
                ${item.text}
            </p>

            <button
                class="logout-button delete-content"
                data-id="${item.id}">
                Delete
            </button>
        `;

        list.appendChild(div);

    });


    document
        .querySelectorAll(".delete-content")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    contents =
                        contents.filter(
                            item => item.id !== id
                        );

                    saveContents();

                    renderBlog();

                    renderAdminContents();

                }
            );

        });

}


/* =========================================
   QUICK ADMIN CATEGORY BUTTONS
========================================= */

const addNewsButton =
    document.getElementById("addNewsButton");

if (addNewsButton) {

    addNewsButton.addEventListener(
        "click",
        () => {

            document.getElementById(
                "contentCategory"
            ).value = "News";

            document.getElementById(
                "contentTitle"
            ).focus();

        }
    );

}


const addTipButton =
    document.getElementById("addTipButton");

if (addTipButton) {

    addTipButton.addEventListener(
        "click",
        () => {

            document.getElementById(
                "contentCategory"
            ).value = "Tips";

            document.getElementById(
                "contentTitle"
            ).focus();

        }
    );

}


const addVideoButton =
    document.getElementById("addVideoButton");

if (addVideoButton) {

    addVideoButton.addEventListener(
        "click",
        () => {

            document.getElementById(
                "contentCategory"
            ).value = "Video";

            document.getElementById(
                "contentTitle"
            ).focus();

        }
    );

}


const addPdfButton =
    document.getElementById("addPdfButton");

if (addPdfButton) {

    addPdfButton.addEventListener(
        "click",
        () => {

            document.getElementById(
                "contentCategory"
            ).value = "PDF";

            document.getElementById(
                "contentTitle"
            ).focus();

        }
    );

}


/* =========================================
   LOGOUT
========================================= */

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "danielTechAdmin"
            );

            if (dashboardModal) {

                dashboardModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================
   BACK TO TOP
========================================= */

const backTop =
    document.getElementById("backTop");


if (backTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            backTop.classList.add("show");

        } else {

            backTop.classList.remove("show");

        }

    });


    backTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================
   KEYBOARD ESCAPE
========================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeSettingsPanel();

        document
            .querySelectorAll(".modal.active")
            .forEach(modal => {

                modal.classList.remove("active");

            });

    }

});


/* =========================================
   START HOME
========================================= */

showPage("home");
