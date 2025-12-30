fetch("../../sidebar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("sidebar-container").innerHTML = data;

        // Auto active highlight
        const page = document.body.getAttribute("data-page");
        const links = document.querySelectorAll(".nav a");

        links.forEach(link => {
            if (link.dataset.page === page) {
                link.classList.add("active");
            }
        });
    });

fetch("sidebar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("sidebar-container").innerHTML = html;
    });
fetch("sidebar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("sidebar-container").innerHTML = html;
    })
    .catch(() => {
        document.getElementById("sidebar-container").innerHTML =
            "<p style='padding:10px'>Sidebar failed to load</p>";
    });
