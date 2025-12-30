// Determine correct path to sidebar.html based on current page location
function getSidebarPath() {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(p => p && !p.includes('.html'));
    
    // Find dashboard directory index
    const dashboardIndex = pathParts.indexOf('dashboard');
    
    if (dashboardIndex !== -1) {
        // Count how many directories deep we are from dashboard (excluding dashboard itself)
        // e.g., dashboard/pages/calorie-calculator = 2 levels deep
        const levelsDeep = pathParts.length - dashboardIndex - 1;
        
        if (levelsDeep > 0) {
            // Build path: go up 'levelsDeep' levels, then to sidebar.html
            const upPath = '../'.repeat(levelsDeep);
            return upPath + 'sidebar.html';
        }
    }
    
    // We're in dashboard root or fallback
    return 'sidebar.html';
}

const sidebarPath = getSidebarPath();
fetch(sidebarPath)
    .then(res => {
        if (!res.ok) throw new Error("Sidebar not found");
        return res.text();
    })
    .then(html => {
        document.getElementById("sidebar-container").innerHTML = html;

        // Fix all links to be relative to dashboard root
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(p => p && !p.includes('.html'));
        const dashboardIndex = pathParts.indexOf('dashboard');
        
        if (dashboardIndex !== -1) {
            const levelsDeep = pathParts.length - dashboardIndex - 1;
            
            if (levelsDeep > 0) {
                // We're in a subdirectory, need to add ../ to all links
                const upPath = '../'.repeat(levelsDeep);
                
                document.querySelectorAll(".nav-item, .logout").forEach(link => {
                    const currentHref = link.getAttribute("href");
                    if (currentHref && !currentHref.startsWith('http') && !currentHref.startsWith('../') && !currentHref.startsWith('/')) {
                        // Only fix relative paths that don't already go up
                        link.setAttribute("href", upPath + currentHref);
                    }
                });
            }
        }

        // Set active link based on current page
        const page = document.body.getAttribute("data-page");
        const currentFile = currentPath.split("/").pop() || "dashboard.html";
        
        document.querySelectorAll(".nav-item").forEach(link => {
            // Check if link matches current page
            const linkPath = link.getAttribute("href");
            const linkFile = linkPath.split("/").pop();
            
            // Dashboard link special case
            if (linkFile === "dashboard.html" && (currentFile === "dashboard.html" || currentFile === "")) {
                link.classList.add("active");
            }
            // Other pages
            else if (link.dataset.page === page || currentPath.includes(linkPath) || currentFile === linkFile) {
                link.classList.add("active");
            }
        });

        // Add click handlers for smooth transitions
        document.querySelectorAll(".nav-item").forEach(item => {
            item.addEventListener("click", function(e) {
                // Remove active from all items
                document.querySelectorAll(".nav-item").forEach(link => {
                    link.classList.remove("active");
                });
                // Add active to clicked item
                this.classList.add("active");
            });
        });
    })
    .catch(err => {
        console.error("Sidebar load error:", err);
        document.getElementById("sidebar-container").innerHTML =
            "<div style='padding:20px;color:#ef4444;text-align:center'>⚠️ Sidebar failed to load</div>";
    });
