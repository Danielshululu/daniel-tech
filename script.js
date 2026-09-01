/* =========================================
   DANIEL TECH
   MAIN JAVASCRIPT
========================================= */


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


/* MOBILE MENU */

const menuButton = document.getElementById("menuButton");
const navbar = document.querySelector(".navbar");

menuButton.addEventListener("click", () => {

    navbar.classList.toggle("active");

});


function closeMobileMenu() {

    navbar.classList.remove("active");

}


/* =========================================
   DARK / LIGHT MODE
========================================= */

const themeButton = document.getElementById("themeButton");
const settingsThemeButton =
    document.getElementById("settingsThemeButton");


function updateThemeButtons() {

    if (document.body.classList.contains("dark")) {

        themeButton.textContent = "Light Mode";

        settingsThemeButton.textContent = "Light Mode";

    } else {

        themeButton.textContent = "Dark Mode";

        settingsThemeButton.textContent = "Dark Mode";

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


themeButton.addEventListener("click", toggleTheme);

settingsThemeButton.addEventListener(
    "click",
    toggleTheme
);


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

    settingsPanel.classList.add("active");

    overlay.classList.add("active");

}


function closeSettingsPanel() {

    settingsPanel.classList.remove("active");

    overlay.classList.remove("active");

}


settingsButton.addEventListener(
    "click",
    openSettings
);

closeSettings.addEventListener(
    "click",
    closeSettingsPanel
);

overlay.addEventListener(
    "click",
    closeSettingsPanel
);


/* =========================================
   ABOUT
========================================= */

const aboutButton =
    document.getElementById("aboutButton");

const aboutModal =
    document.getElementById("aboutModal");


aboutButton.addEventListener("click", () => {

    closeSettingsPanel();

    aboutModal.classList.add("active");

});


/* =========================================
   MODAL CLOSE
========================================= */

document.querySelectorAll(".modal-close")
.forEach(button => {

    button.addEventListener("click", () => {

        const modalId =
            button.dataset.close;

        if (modalId) {

            document
                .getElementById(modalId)
                .classList.remove("active");

        } else {

            button.closest(".modal")
                .classList.remove("active");

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

        serviceTitle.textContent = service;

        serviceDetails.innerHTML = `
            <p>${serviceInformation[service]}</p>

            <p>
                More tips and updates about this service
                can be added by the administrator.
            </p>
        `;

        serviceModal.classList.add("active");

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

        featureTitle.textContent = feature;

        featureDetails.innerHTML = `
            <p>${featureInformation[feature]}</p>

            <p>
                New tips for this category can be added
                from the Admin Dashboard.
            </p>
        `;

        featureModal.classList.add("active");

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


        /* HOME LATEST */

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


renderComments();


/* =========================================
   CONTACT FORM
========================================= */

document
    .getElementById("contactForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        alert(
            "Your message has been received."
        );

        event.target.reset();

    });


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


adminButton.addEventListener("click", () => {

    closeSettingsPanel();

    adminModal.classList.add("active");

});


/*
    DEMO ADMIN LOGIN

    Username: admin
    Password: danieltech
*/


adminLoginForm.addEventListener("submit", event => {

    event.preventDefault();


    const name =
        document.getElementById("adminName").value.trim();

    const username =
        document.getElementById("adminUsername").value.trim();

    const password =
        document.getElementById("adminPassword").value;


    if (
        name !== "" &&
        username === "admin" &&
        password === "danieltech"
    ) {

        localStorage.setItem(
            "danielTechAdmin",
            "true"
        );

        adminModal.classList.remove("active");

        dashboardModal.classList.add("active");

        adminLoginForm.reset();

        loginMessage.textContent = "";

        renderAdminContents();

    } else {

        loginMessage.textContent =
            "Invalid admin details.";

    }

});


/* =========================================
   ADMIN DASHBOARD
========================================= */

const saveContentButton =
    document.getElementById("saveContentButton");


saveContentButton.addEventListener("click", () => {

    const title =
        document.getElementById("contentTitle").value.trim();

    const category =
        document.getElementById("contentCategory").value;

    const text =
        document.getElementById("contentText").value.trim();

    const file =
        document.getElementById("contentFile").value.trim();


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

        date: new Date().toLocaleDateString()

    };


    contents.push(newContent);

    saveContents();

    renderBlog();

    renderAdminContents();


    document.getElementById("contentTitle").value = "";

    document.getElementById("contentText").value = "";

    document.getElementById("contentFile").value = "";


    alert(
        "Content added successfully."
    );

});


/* ADMIN CONTENT LIST */

function renderAdminContents() {

    const list =
        document.getElementById("adminContentList");

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

document
    .getElementById("addNewsButton")
    .addEventListener("click", () => {

        document.getElementById(
            "contentCategory"
        ).value = "News";

        document.getElementById(
            "contentTitle"
        ).focus();

    });


document
    .getElementById("addTipButton")
    .addEventListener("click", () => {

        document.getElementById(
            "contentCategory"
        ).value = "Tips";

        document.getElementById(
            "contentTitle"
        ).focus();

    });


document
    .getElementById("addVideoButton")
    .addEventListener("click", () => {

        document.getElementById(
            "contentCategory"
        ).value = "Video";

        document.getElementById(
            "contentTitle"
        ).focus();

    });


document
    .getElementById("addPdfButton")
    .addEventListener("click", () => {

        document.getElementById(
            "contentCategory"
        ).value = "PDF";

        document.getElementById(
            "contentTitle"
        ).focus();

    });


/* =========================================
   LOGOUT
========================================= */

document
    .getElementById("logoutButton")
    .addEventListener("click", () => {

        localStorage.removeItem(
            "danielTechAdmin"
        );

        dashboardModal.classList.remove(
            "active"
        );

    });


/* =========================================
   BACK TO TOP
========================================= */

const backTop =
    document.getElementById("backTop");


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