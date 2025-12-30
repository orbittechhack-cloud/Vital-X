// Diet & Nutrition Page JavaScript

let meals = [];
let currentMealTab = 'breakfast';
let nutritionGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 67,
    water: 8
};
let macroChart = null;
let nutritionChart = null;

// Food database (simplified)
const foodDatabase = {
    apple: { calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
    banana: { calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
    chicken: { calories: 231, protein: 43.5, carbs: 0, fats: 5 },
    rice: { calories: 130, protein: 2.7, carbs: 28, fats: 0.3 }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadMeals();
    loadGoals();
    updateNutritionSummary();
    setupCharts();
    updateMealList();
});

// Load Meals
function loadMeals() {
    const saved = localStorage.getItem('dietMeals');
    if (saved) {
        meals = JSON.parse(saved);
        // Convert date strings back to Date objects
        meals = meals.map(meal => ({
            ...meal,
            date: new Date(meal.date)
        }));
    }
}

// Save Meals
function saveMeals() {
    localStorage.setItem('dietMeals', JSON.stringify(meals));
}

// Load Goals
function loadGoals() {
    const saved = localStorage.getItem('nutritionGoals');
    if (saved) {
        nutritionGoals = JSON.parse(saved);
    }
    updateGoalsDisplay();
}

// Save Goals
function saveGoals() {
    localStorage.setItem('nutritionGoals', JSON.stringify(nutritionGoals));
}

// Update Goals Display
function updateGoalsDisplay() {
    document.getElementById('goalCalories').textContent = nutritionGoals.calories.toLocaleString() + ' kcal';
    document.getElementById('goalProtein').textContent = nutritionGoals.protein + 'g';
    document.getElementById('goalCarbs').textContent = nutritionGoals.carbs + 'g';
    document.getElementById('goalFats').textContent = nutritionGoals.fats + 'g';
    document.getElementById('goalWater').textContent = nutritionGoals.water + ' glasses';
}

// Update Nutrition Summary
function updateNutritionSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMeals = meals.filter(meal => {
        const mealDate = new Date(meal.date);
        mealDate.setHours(0, 0, 0, 0);
        return mealDate.getTime() === today.getTime();
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalWater = 0;

    todayMeals.forEach(meal => {
        totalCalories += meal.calories * meal.quantity;
        totalProtein += meal.protein * meal.quantity;
        totalCarbs += meal.carbs * meal.quantity;
        totalFats += meal.fats * meal.quantity;
        if (meal.type === 'water') {
            totalWater += meal.quantity;
        }
    });

    // Update displays
    document.getElementById('caloriesConsumed').textContent = Math.round(totalCalories).toLocaleString();
    document.getElementById('proteinConsumed').textContent = Math.round(totalProtein) + 'g';
    document.getElementById('carbsConsumed').textContent = Math.round(totalCarbs) + 'g';
    document.getElementById('fatsConsumed').textContent = Math.round(totalFats) + 'g';
    document.getElementById('waterConsumed').textContent = Math.round(totalWater);

    // Update progress bars
    updateProgress('caloriesProgress', totalCalories, nutritionGoals.calories);
    updateProgress('proteinProgress', totalProtein, nutritionGoals.protein);
    updateProgress('carbsProgress', totalCarbs, nutritionGoals.carbs);
    updateProgress('fatsProgress', totalFats, nutritionGoals.fats);
    updateProgress('waterProgress', totalWater, nutritionGoals.water);

    // Update macro percentages
    const totalMacros = totalProtein + totalCarbs + totalFats;
    if (totalMacros > 0) {
        document.getElementById('macroProtein').textContent = Math.round((totalProtein / totalMacros) * 100) + '%';
        document.getElementById('macroCarbs').textContent = Math.round((totalCarbs / totalMacros) * 100) + '%';
        document.getElementById('macroFats').textContent = Math.round((totalFats / totalMacros) * 100) + '%';
    } else {
        document.getElementById('macroProtein').textContent = '0%';
        document.getElementById('macroCarbs').textContent = '0%';
        document.getElementById('macroFats').textContent = '0%';
    }

    // Update charts
    updateMacroChart();
    updateNutritionChart();
}

// Update Progress Bar
function updateProgress(elementId, current, target) {
    const percentage = Math.min((current / target) * 100, 100);
    document.getElementById(elementId).style.width = percentage + '%';
}

// Switch Meal Tab
function switchMealTab(tab) {
    currentMealTab = tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    updateMealList();
}

// Update Meal List
function updateMealList() {
    const mealList = document.getElementById('mealList');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMeals = meals.filter(meal => {
        const mealDate = new Date(meal.date);
        mealDate.setHours(0, 0, 0, 0);
        return mealDate.getTime() === today.getTime() && meal.type === currentMealTab;
    });

    if (todayMeals.length === 0) {
        mealList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🍽️</div>
                <p>No ${currentMealTab} meals logged yet</p>
                <button class="btn-add-meal" onclick="openMealLog()">Add Meal</button>
            </div>
        `;
        return;
    }

    mealList.innerHTML = todayMeals.map((meal, index) => `
        <div class="meal-item">
            <div class="meal-info">
                <div class="meal-name">${meal.name}</div>
                <div class="meal-details">
                    ${meal.protein > 0 ? meal.protein.toFixed(1) + 'g protein' : ''}
                    ${meal.carbs > 0 ? ' • ' + meal.carbs.toFixed(1) + 'g carbs' : ''}
                    ${meal.fats > 0 ? ' • ' + meal.fats.toFixed(1) + 'g fats' : ''}
                    ${meal.quantity > 1 ? ' • x' + meal.quantity : ''}
                </div>
            </div>
            <div style="display: flex; align-items: center;">
                <span class="meal-calories">${Math.round(meal.calories * meal.quantity)} kcal</span>
                <div class="meal-actions">
                    <button class="btn-delete" onclick="deleteMeal(${meals.indexOf(meal)})">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Open Meal Log Modal
function openMealLog() {
    document.getElementById('mealModal').style.display = 'flex';
    document.getElementById('mealType').value = currentMealTab;
    // Clear form
    document.getElementById('foodName').value = '';
    document.getElementById('foodCalories').value = '';
    document.getElementById('foodQuantity').value = '1';
    document.getElementById('foodProtein').value = '';
    document.getElementById('foodCarbs').value = '';
    document.getElementById('foodFats').value = '';
}

// Close Meal Log Modal
function closeMealLog() {
    document.getElementById('mealModal').style.display = 'none';
}

// Save Meal
function saveMeal() {
    const name = document.getElementById('foodName').value.trim();
    const calories = parseFloat(document.getElementById('foodCalories').value) || 0;
    const quantity = parseFloat(document.getElementById('foodQuantity').value) || 1;
    const protein = parseFloat(document.getElementById('foodProtein').value) || 0;
    const carbs = parseFloat(document.getElementById('foodCarbs').value) || 0;
    const fats = parseFloat(document.getElementById('foodFats').value) || 0;
    const type = document.getElementById('mealType').value;

    if (!name) {
        showNotification('Please enter a food name', 'error');
        return;
    }

    const meal = {
        name,
        calories,
        quantity,
        protein,
        carbs,
        fats,
        type,
        date: new Date()
    };

    meals.push(meal);
    saveMeals();
    updateNutritionSummary();
    updateMealList();
    closeMealLog();

    showNotification('Meal logged successfully!', 'success');
}

// Delete Meal
function deleteMeal(index) {
    if (confirm('Delete this meal?')) {
        meals.splice(index, 1);
        saveMeals();
        updateNutritionSummary();
        updateMealList();
        showNotification('Meal deleted', 'success');
    }
}

// Quick Add Water
function quickAddWater() {
    const meal = {
        name: 'Water',
        calories: 0,
        quantity: 1,
        protein: 0,
        carbs: 0,
        fats: 0,
        type: 'water',
        date: new Date()
    };

    meals.push(meal);
    saveMeals();
    updateNutritionSummary();
    showNotification('Water added!', 'success');
}

// Quick Add Food
function quickAddFood(foodName) {
    const food = foodDatabase[foodName];
    if (!food) return;

    const meal = {
        name: foodName.charAt(0).toUpperCase() + foodName.slice(1),
        calories: food.calories,
        quantity: 1,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        type: currentMealTab,
        date: new Date()
    };

    meals.push(meal);
    saveMeals();
    updateNutritionSummary();
    updateMealList();
    showNotification(`${meal.name} added!`, 'success');
}

// Edit Goals
function editGoals() {
    const calories = prompt('Daily Calories Goal:', nutritionGoals.calories);
    const protein = prompt('Daily Protein Goal (g):', nutritionGoals.protein);
    const carbs = prompt('Daily Carbs Goal (g):', nutritionGoals.carbs);
    const fats = prompt('Daily Fats Goal (g):', nutritionGoals.fats);
    const water = prompt('Daily Water Goal (glasses):', nutritionGoals.water);

    if (calories) nutritionGoals.calories = parseInt(calories) || 2000;
    if (protein) nutritionGoals.protein = parseInt(protein) || 150;
    if (carbs) nutritionGoals.carbs = parseInt(carbs) || 250;
    if (fats) nutritionGoals.fats = parseInt(fats) || 67;
    if (water) nutritionGoals.water = parseInt(water) || 8;

    saveGoals();
    updateGoalsDisplay();
    updateNutritionSummary();
    showNotification('Goals updated!', 'success');
}

// Setup Charts
function setupCharts() {
    setupMacroChart();
    setupNutritionChart();
}

// Setup Macro Chart
function setupMacroChart() {
    const ctx = document.getElementById('macroChart');
    if (!ctx) return;

    macroChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Protein', 'Carbs', 'Fats'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(59,130,246,0.8)',
                    'rgba(34,197,94,0.8)',
                    'rgba(245,158,11,0.8)'
                ],
                borderColor: [
                    '#3b82f6',
                    '#22c55e',
                    '#f59e0b'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update Macro Chart
function updateMacroChart() {
    if (!macroChart) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMeals = meals.filter(meal => {
        const mealDate = new Date(meal.date);
        mealDate.setHours(0, 0, 0, 0);
        return mealDate.getTime() === today.getTime();
    });

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    todayMeals.forEach(meal => {
        totalProtein += meal.protein * meal.quantity;
        totalCarbs += meal.carbs * meal.quantity;
        totalFats += meal.fats * meal.quantity;
    });

    macroChart.data.datasets[0].data = [
        Math.round(totalProtein),
        Math.round(totalCarbs),
        Math.round(totalFats)
    ];
    macroChart.update();
}

// Setup Nutrition Chart
function setupNutritionChart() {
    const ctx = document.getElementById('nutritionChart');
    if (!ctx) return;

    nutritionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Calories',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Protein',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'rgba(255,255,255,0.7)'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    }
                }
            }
        }
    });
}

// Update Nutrition Chart
function updateNutritionChart() {
    if (!nutritionChart) return;

    // Get last 7 days
    const labels = [];
    const caloriesData = [];
    const proteinData = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dayMeals = meals.filter(meal => {
            const mealDate = new Date(meal.date);
            mealDate.setHours(0, 0, 0, 0);
            return mealDate.getTime() === date.getTime();
        });

        let dayCalories = 0;
        let dayProtein = 0;

        dayMeals.forEach(meal => {
            dayCalories += meal.calories * meal.quantity;
            dayProtein += meal.protein * meal.quantity;
        });

        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        caloriesData.push(Math.round(dayCalories));
        proteinData.push(Math.round(dayProtein));
    }

    nutritionChart.data.labels = labels;
    nutritionChart.data.datasets[0].data = caloriesData;
    nutritionChart.data.datasets[1].data = proteinData;
    nutritionChart.update();
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.9));
        border: 1px solid var(--border-glass);
        border-radius: 12px;
        backdrop-filter: blur(18px);
        box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        z-index: 1000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    .notification-success {
        border-left: 4px solid var(--success);
    }
    .notification-error {
        border-left: 4px solid var(--danger);
    }
`;
document.head.appendChild(style);

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('mealModal');
    if (event.target === modal) {
        closeMealLog();
    }
});

