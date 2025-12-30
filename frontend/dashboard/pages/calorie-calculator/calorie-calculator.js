let tdeeValue = 0;

function calculateTDEE() {
    const age = +document.getElementById("age").value;
    const height = +document.getElementById("height").value;
    const weight = +document.getElementById("weight").value;
    const gender = document.getElementById("gender").value;
    const activity = +document.getElementById("activity").value;

    if (!age || !height || !weight) {
        alert("Please fill all fields");
        return;
    }

    // Mifflin-St Jeor BMR
    let bmr =
        gender === "male"
            ? (10 * weight) + (6.25 * height) - (5 * age) + 5
            : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    tdeeValue = Math.round(bmr * activity);

    document.getElementById("maintenance").innerText = tdeeValue + " kcal";

    document.getElementById("mildLoss").innerText = (tdeeValue - 250) + " kcal";
    document.getElementById("loss").innerText = (tdeeValue - 500) + " kcal";
    document.getElementById("extremeLoss").innerText = (tdeeValue - 1000) + " kcal";

    document.getElementById("mildGain").innerText = (tdeeValue + 250) + " kcal";
    document.getElementById("gain").innerText = (tdeeValue + 500) + " kcal";
    document.getElementById("fastGain").innerText = (tdeeValue + 1000) + " kcal";

    // Sync with dashboard
    localStorage.setItem("dailyCalories", tdeeValue);
}

function calculateBurn() {
    const walk = +document.getElementById("walk").value || 0;
    const run = +document.getElementById("run").value || 0;
    const gym = +document.getElementById("gym").value || 0;

    const burn = (walk * 4) + (run * 10) + (gym * 8);
    document.getElementById("burn").innerText = burn + " kcal";
}
