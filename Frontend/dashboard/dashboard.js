function logout() {
    // later clear localStorage / session
    window.location.href = "../auth/login.html";
}

/* Hide menstruation if not female (demo logic) */
const isFemale = true; // later from saved profile

if (!isFemale) {
    const womenNav = document.getElementById("womenNav");
    if (womenNav) womenNav.style.display = "none";
}
