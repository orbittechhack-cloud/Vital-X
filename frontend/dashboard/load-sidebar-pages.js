fetch("../../sidebar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("sidebar-container").innerHTML = html;
    });
function toggleSidebar() {
    document.body.classList.toggle("sidebar-open");
}
document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        document.body.classList.remove("sidebar-open");
    });
});
fetch("../../sidebar.html")
    .then(res => {
        if (!res.ok) throw new Error("Sidebar not found");
        return res.text();
    })
    .then(html => {
        document.getElementById("sidebar-container").innerHTML = html;

        const page = document.body.getAttribute("data-page");
        document.querySelectorAll(".nav a").forEach(link => {
            if (link.dataset.page === page) {
                link.classList.add("active");
            }
        });
    })
    .catch(() => {
        document.getElementById("sidebar-container").innerHTML =
            "<p style='padding:12px;color:red'>Sidebar failed</p>";
    });
