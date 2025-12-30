const heartCtx = document.getElementById("heartChart");
const stepsCtx = document.getElementById("stepsChart");

new Chart(heartCtx, {
    type: "line",
    data: {
        labels: ["6am","8am","10am","12pm","2pm","4pm","6pm","8pm"],
        datasets: [{
            data: [65,78,85,72,88,76,82,68],
            borderColor: "#2dd4bf",
            backgroundColor: "rgba(45,212,191,0.15)",
            fill: true,
            tension: 0.4
        }]
    },
    options: { plugins:{legend:{display:false}}, scales:{y:{grid:{color:"#1f2937"}}} }
});

new Chart(stepsCtx, {
    type: "line",
    data: {
        labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        datasets: [{
            data: [8200,12000,9500,11000,7800,14500,7200],
            borderColor: "#22d3ee",
            backgroundColor: "rgba(34,211,238,0.15)",
            fill: true,
            tension: 0.4
        }]
    },
    options: { plugins:{legend:{display:false}}, scales:{y:{grid:{color:"#1f2937"}}} }
});
function toggleSidebar() {
    document.body.classList.toggle("sidebar-collapsed");
}
