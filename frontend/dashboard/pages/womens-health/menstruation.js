// Menstruation Page JavaScript

let currentDate = new Date();
let cycleData = {
    averageCycleLength: 28,
    averagePeriodLength: 5,
    lastPeriodStart: null,
    periods: []
};
let symptoms = {};
let flowData = {};
let cycleChart = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCycleData();
    generateCalendar();
    updateCycleInfo();
    updatePredictions();
    setupChart();
    updateQuickStats();
});

// Load Cycle Data
function loadCycleData() {
    const saved = localStorage.getItem('menstruationData');
    if (saved) {
        const data = JSON.parse(saved);
        cycleData = { ...cycleData, ...data };

        // Convert date strings back to Date objects
        if (cycleData.lastPeriodStart) {
            cycleData.lastPeriodStart = new Date(cycleData.lastPeriodStart);
        }
        cycleData.periods = cycleData.periods.map(p => ({
            ...p,
            start: new Date(p.start),
            end: new Date(p.end)
        }));
    } else {
        // Default: set last period to 5 days ago
        const defaultStart = new Date();
        defaultStart.setDate(defaultStart.getDate() - 5);
        cycleData.lastPeriodStart = defaultStart;
        cycleData.periods = [{
            start: defaultStart,
            end: new Date(defaultStart.getTime() + 4 * 24 * 60 * 60 * 1000)
        }];
    }

    // Load symptoms and flow
    symptoms = JSON.parse(localStorage.getItem('symptomsData')) || {};
    flowData = JSON.parse(localStorage.getItem('flowData')) || {};
}

// Save Cycle Data
function saveCycleData() {
    localStorage.setItem('menstruationData', JSON.stringify(cycleData));
    localStorage.setItem('symptomsData', JSON.stringify(symptoms));
    localStorage.setItem('flowData', JSON.stringify(flowData));
}

// Generate Calendar
function generateCalendar() {
    const container = document.getElementById('calendarContainer');
    if (!container) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update month/year display
    document.getElementById('monthYear').textContent =
        currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Create calendar HTML
    let calendarHTML = '<table class="calendar"><thead class="calendar-header"><tr>';
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        calendarHTML += `<th>${day}</th>`;
    });
    calendarHTML += '</tr></thead><tbody><tr>';

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarHTML += '<td class="calendar-day other-month"></td>';
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayClasses = getDayClasses(date);

        calendarHTML += `<td class="calendar-day ${dayClasses}" onclick="selectDate('${date.toISOString()}')">
            <div class="day-number">${day}</div>
            ${getDayIndicator(date)}
        </td>`;

        // Start new row on Sunday
        if ((day + startingDayOfWeek) % 7 === 0 && day < daysInMonth) {
            calendarHTML += '</tr><tr>';
        }
    }

    // Add empty cells for remaining days
    const remainingDays = 7 - ((daysInMonth + startingDayOfWeek) % 7);
    if (remainingDays < 7) {
        for (let i = 0; i < remainingDays; i++) {
            calendarHTML += '<td class="calendar-day other-month"></td>';
        }
    }

    calendarHTML += '</tr></tbody></table>';
    container.innerHTML = calendarHTML;
}

// Get Day Classes
function getDayClasses(date) {
    const classes = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    // Today
    if (checkDate.getTime() === today.getTime()) {
        classes.push('today');
    }

    // Check if date is in a period
    const isPeriod = cycleData.periods.some(period => {
        const start = new Date(period.start);
        start.setHours(0, 0, 0, 0);
        const end = new Date(period.end);
        end.setHours(0, 0, 0, 0);
        return checkDate >= start && checkDate <= end;
    });

    if (isPeriod) {
        classes.push('period');
    } else {
        // Check for predicted period
        const nextPeriod = getNextPeriodDate();
        if (nextPeriod) {
            const predictedStart = new Date(nextPeriod);
            predictedStart.setHours(0, 0, 0, 0);
            const predictedEnd = new Date(predictedStart);
            predictedEnd.setDate(predictedEnd.getDate() + cycleData.averagePeriodLength - 1);

            if (checkDate >= predictedStart && checkDate <= predictedEnd) {
                classes.push('predicted');
            }
        }

        // Check for ovulation and fertile window
        const cycleDay = getCycleDay(date);
        if (cycleDay !== null) {
            const ovulationDay = cycleData.averageCycleLength - 14;
            if (cycleDay === ovulationDay) {
                classes.push('ovulation');
            } else if (cycleDay >= ovulationDay - 3 && cycleDay <= ovulationDay + 1) {
                classes.push('fertile');
            }
        }
    }

    return classes.join(' ');
}

// Get Day Indicator
function getDayIndicator(date) {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const dateStr = checkDate.toISOString().split('T')[0];

    if (symptoms[dateStr] && Object.keys(symptoms[dateStr]).length > 0) {
        return '<div class="day-indicator" style="background: #ec4899;"></div>';
    }
    if (flowData[dateStr]) {
        return '<div class="day-indicator" style="background: #ef4444;"></div>';
    }
    return '';
}

// Get Cycle Day
function getCycleDay(date) {
    if (!cycleData.lastPeriodStart) return null;

    const start = new Date(cycleData.lastPeriodStart);
    start.setHours(0, 0, 0, 0);
    const check = new Date(date);
    check.setHours(0, 0, 0, 0);

    const diffTime = check - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;

    const cycleDay = (diffDays % cycleData.averageCycleLength) + 1;
    return cycleDay;
}

// Select Date
function selectDate(dateString) {
    const date = new Date(dateString);
    // Could open a modal to log period or symptoms for that date
    console.log('Selected date:', date);
}

// Previous Month
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
}

// Next Month
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
}

// Update Cycle Info
function updateCycleInfo() {
    if (cycleData.lastPeriodStart) {
        const start = new Date(cycleData.lastPeriodStart);
        document.getElementById('lastPeriodStart').textContent =
            start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const end = new Date(start);
        end.setDate(end.getDate() + cycleData.averagePeriodLength - 1);
        document.getElementById('lastPeriodEnd').textContent =
            end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    document.getElementById('avgCycle').textContent = cycleData.averageCycleLength + ' days';
    document.getElementById('avgPeriod').textContent = cycleData.averagePeriodLength + ' days';

    const ovulationDay = cycleData.averageCycleLength - 14;
    document.getElementById('ovulationDay').textContent = 'Day ' + ovulationDay;
    document.getElementById('fertileWindow').textContent =
        'Days ' + (ovulationDay - 3) + '-' + (ovulationDay + 1);
}

// Update Predictions
function updatePredictions() {
    const nextPeriod = getNextPeriodDate();
    if (nextPeriod) {
        document.getElementById('nextPeriodDate').textContent =
            nextPeriod.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const ovulation = new Date(nextPeriod);
        ovulation.setDate(ovulation.getDate() - 14);
        document.getElementById('nextOvulation').textContent =
            ovulation.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const fertileStart = new Date(ovulation);
        fertileStart.setDate(fertileStart.getDate() - 3);
        const fertileEnd = new Date(ovulation);
        fertileEnd.setDate(fertileEnd.getDate() + 1);
        document.getElementById('nextFertile').textContent =
            fertileStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' - ' +
            fertileEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

// Get Next Period Date
function getNextPeriodDate() {
    if (!cycleData.lastPeriodStart) return null;

    const lastStart = new Date(cycleData.lastPeriodStart);
    const nextStart = new Date(lastStart);
    nextStart.setDate(nextStart.getDate() + cycleData.averageCycleLength);

    return nextStart;
}

// Update Quick Stats
function updateQuickStats() {
    const today = new Date();
    const cycleDay = getCycleDay(today);

    if (cycleDay !== null) {
        document.getElementById('cycleDay').textContent = 'Day ' + cycleDay;
    }

    document.getElementById('cycleLength').textContent = cycleData.averageCycleLength + ' days';
    document.getElementById('periodDuration').textContent = cycleData.averagePeriodLength + ' days';

    const nextPeriod = getNextPeriodDate();
    if (nextPeriod) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const next = new Date(nextPeriod);
        next.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((next - today) / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            document.getElementById('nextPeriod').textContent = 'In ' + diffDays + ' days';
        } else if (diffDays === 0) {
            document.getElementById('nextPeriod').textContent = 'Today';
        } else {
            document.getElementById('nextPeriod').textContent = 'Overdue';
        }
    }
}

// Log Period
function logPeriod() {
    const startDate = prompt('Enter period start date (YYYY-MM-DD) or leave blank for today:');
    let start;

    if (startDate) {
        start = new Date(startDate);
    } else {
        start = new Date();
    }
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + cycleData.averagePeriodLength - 1);

    cycleData.lastPeriodStart = start;
    cycleData.periods.push({ start, end });

    // Keep only last 12 periods
    if (cycleData.periods.length > 12) {
        cycleData.periods.shift();
    }

    saveCycleData();
    generateCalendar();
    updateCycleInfo();
    updatePredictions();
    updateQuickStats();

    showNotification('Period logged successfully!', 'success');
}

// Edit Cycle Info
function editCycleInfo() {
    const cycleLength = prompt('Average cycle length (days):', cycleData.averageCycleLength);
    const periodLength = prompt('Average period duration (days):', cycleData.averagePeriodLength);

    if (cycleLength) cycleData.averageCycleLength = parseInt(cycleLength) || 28;
    if (periodLength) cycleData.averagePeriodLength = parseInt(periodLength) || 5;

    saveCycleData();
    updateCycleInfo();
    updatePredictions();
    generateCalendar();
    showNotification('Cycle info updated!', 'success');
}

// Toggle Symptom
function toggleSymptom(symptomName) {
    const today = new Date().toISOString().split('T')[0];

    if (!symptoms[today]) {
        symptoms[today] = {};
    }

    if (!symptoms[today][symptomName]) {
        symptoms[today][symptomName] = 'mild';
    } else if (symptoms[today][symptomName] === 'mild') {
        symptoms[today][symptomName] = 'moderate';
    } else if (symptoms[today][symptomName] === 'moderate') {
        symptoms[today][symptomName] = 'severe';
    } else {
        delete symptoms[today][symptomName];
    }

    saveCycleData();
    updateSymptomsDisplay();
    generateCalendar();
}

// Update Symptoms Display
function updateSymptomsDisplay() {
    const today = new Date().toISOString().split('T')[0];
    const todaySymptoms = symptoms[today] || {};

    const symptomNames = ['cramps', 'bloating', 'headache', 'backache', 'nausea', 'fatigue', 'mood', 'acne'];

    symptomNames.forEach(name => {
        const item = document.querySelector(`[onclick="toggleSymptom('${name}')"]`);
        if (item) {
            if (todaySymptoms[name]) {
                item.classList.add('active');
                const levelElement = document.getElementById(name + '-level');
                if (levelElement) {
                    levelElement.textContent = todaySymptoms[name];
                }
            } else {
                item.classList.remove('active');
                const levelElement = document.getElementById(name + '-level');
                if (levelElement) {
                    levelElement.textContent = '';
                }
            }
        }
    });
}

// Set Flow
function setFlow(flow) {
    const today = new Date().toISOString().split('T')[0];
    flowData[today] = flow;

    saveCycleData();
    updateFlowDisplay();
    generateCalendar();
}

// Update Flow Display
function updateFlowDisplay() {
    const today = new Date().toISOString().split('T')[0];
    const todayFlow = flowData[today];

    // Update buttons
    document.querySelectorAll('.flow-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.flow === todayFlow) {
            btn.classList.add('active');
        }
    });

    // Update display
    const display = document.getElementById('currentFlow');
    if (todayFlow) {
        display.innerHTML = `Today's flow: <strong>${todayFlow.charAt(0).toUpperCase() + todayFlow.slice(1)}</strong>`;
    } else {
        display.innerHTML = `Today's flow: <strong>Not set</strong>`;
    }
}

// Setup Chart
function setupChart() {
    const ctx = document.getElementById('cycleChart');
    if (!ctx) return;

    cycleChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Cycle Length',
                data: [],
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236,72,153,0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
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

    updateChart();
}

// Update Chart
function updateChart() {
    if (!cycleChart) return;

    // Calculate cycle lengths from periods
    const cycleLengths = [];
    const labels = [];

    for (let i = 1; i < cycleData.periods.length; i++) {
        const prev = cycleData.periods[i - 1];
        const curr = cycleData.periods[i];
        const length = Math.round((curr.start - prev.start) / (1000 * 60 * 60 * 24));
        cycleLengths.push(length);
        labels.push('Cycle ' + i);
    }

    if (cycleLengths.length === 0) {
        cycleLengths.push(cycleData.averageCycleLength);
        labels.push('Current');
    }

    cycleChart.data.labels = labels;
    cycleChart.data.datasets[0].data = cycleLengths;
    cycleChart.update();
}

// Open Settings
function openSettings() {
    alert('Settings: In a real application, this would open cycle settings and preferences.');
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
`;
document.head.appendChild(style);

// Initialize symptoms display
setTimeout(() => {
    updateSymptomsDisplay();
    updateFlowDisplay();
}, 100);

