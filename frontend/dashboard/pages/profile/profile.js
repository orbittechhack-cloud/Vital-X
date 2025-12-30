// Profile Page JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    loadSettings();
    setupEventListeners();
});

// Load Profile Data
function loadProfileData() {
    // In a real application, this would load from backend
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {
        name: 'Rishabh',
        email: 'rishabh@example.com',
        fullName: 'Rishabh',
        dateOfBirth: 'January 1, 1990',
        gender: 'Male',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345',
        height: '175 cm',
        weight: '70 kg',
        bloodType: 'O+',
        bmi: '22.9',
        activityLevel: 'Moderate',
        allergies: 'None known',
        medications: 'None',
        conditions: 'None',
        surgeries: 'None',
        familyHistory: 'No significant family history',
        memberSince: '2024',
        healthScore: '92',
        daysActive: '127'
    };

    // Update profile header
    document.getElementById('profileName').textContent = profileData.name;
    document.getElementById('profileEmail').textContent = profileData.email;
    document.getElementById('memberSince').textContent = profileData.memberSince;
    document.getElementById('healthScore').textContent = profileData.healthScore;
    document.getElementById('daysActive').textContent = profileData.daysActive;

    // Update avatar
    const initials = profileData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('profileAvatar').textContent = initials;

    // Update personal information
    document.getElementById('fullName').textContent = profileData.fullName;
    document.getElementById('dateOfBirth').textContent = profileData.dateOfBirth;
    document.getElementById('gender').textContent = profileData.gender;
    document.getElementById('phone').textContent = profileData.phone;
    document.getElementById('address').textContent = profileData.address;

    // Update health information
    document.getElementById('height').textContent = profileData.height;
    document.getElementById('weight').textContent = profileData.weight;
    document.getElementById('bloodType').textContent = profileData.bloodType;
    document.getElementById('bmi').textContent = profileData.bmi;
    document.getElementById('activityLevel').textContent = profileData.activityLevel;

    // Update medical history
    document.getElementById('allergies').textContent = profileData.allergies;
    document.getElementById('medications').textContent = profileData.medications;
    document.getElementById('conditions').textContent = profileData.conditions;
    document.getElementById('surgeries').textContent = profileData.surgeries;
    document.getElementById('familyHistory').textContent = profileData.familyHistory;
}

// Load Settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('profileSettings')) || {
        emailNotifications: true,
        smsNotifications: false,
        healthMonitoring: true,
        dataSharing: false
    };

    document.getElementById('emailNotifications').checked = settings.emailNotifications;
    document.getElementById('smsNotifications').checked = settings.smsNotifications;
    document.getElementById('healthMonitoring').checked = settings.healthMonitoring;
    document.getElementById('dataSharing').checked = settings.dataSharing;
}

// Setup Event Listeners
function setupEventListeners() {
    // Settings toggles
    document.getElementById('emailNotifications').addEventListener('change', saveSettings);
    document.getElementById('smsNotifications').addEventListener('change', saveSettings);
    document.getElementById('healthMonitoring').addEventListener('change', saveSettings);
    document.getElementById('dataSharing').addEventListener('change', saveSettings);
}

// Save Settings
function saveSettings() {
    const settings = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        smsNotifications: document.getElementById('smsNotifications').checked,
        healthMonitoring: document.getElementById('healthMonitoring').checked,
        dataSharing: document.getElementById('dataSharing').checked
    };

    localStorage.setItem('profileSettings', JSON.stringify(settings));
    showNotification('Settings saved!', 'success');
}

// Edit Profile
function editProfile() {
    const currentName = document.getElementById('profileName').textContent;
    const currentEmail = document.getElementById('profileEmail').textContent;

    const name = prompt('Enter your name:', currentName) || currentName;
    const email = prompt('Enter your email:', currentEmail) || currentEmail;

    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email;

    // Update avatar
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('profileAvatar').textContent = initials;

    // Save to localStorage
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
    profileData.name = name;
    profileData.email = email;
    localStorage.setItem('profileData', JSON.stringify(profileData));

    showNotification('Profile updated!', 'success');
}

// Change Avatar
function changeAvatar() {
    // In a real application, this would open a file picker
    const initials = prompt('Enter your initials:', document.getElementById('profileAvatar').textContent);
    if (initials && initials.length <= 3) {
        document.getElementById('profileAvatar').textContent = initials.toUpperCase();
        showNotification('Avatar updated!', 'success');
    }
}

// Edit Personal Info
function editPersonalInfo() {
    const currentData = {
        fullName: document.getElementById('fullName').textContent,
        dateOfBirth: document.getElementById('dateOfBirth').textContent,
        gender: document.getElementById('gender').textContent,
        phone: document.getElementById('phone').textContent,
        address: document.getElementById('address').textContent
    };

    const fullName = prompt('Full Name:', currentData.fullName) || currentData.fullName;
    const dateOfBirth = prompt('Date of Birth:', currentData.dateOfBirth) || currentData.dateOfBirth;
    const gender = prompt('Gender:', currentData.gender) || currentData.gender;
    const phone = prompt('Phone:', currentData.phone) || currentData.phone;
    const address = prompt('Address:', currentData.address) || currentData.address;

    document.getElementById('fullName').textContent = fullName;
    document.getElementById('dateOfBirth').textContent = dateOfBirth;
    document.getElementById('gender').textContent = gender;
    document.getElementById('phone').textContent = phone;
    document.getElementById('address').textContent = address;

    // Save to localStorage
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
    profileData.fullName = fullName;
    profileData.dateOfBirth = dateOfBirth;
    profileData.gender = gender;
    profileData.phone = phone;
    profileData.address = address;
    localStorage.setItem('profileData', JSON.stringify(profileData));

    showNotification('Personal information updated!', 'success');
}

// Edit Health Info
function editHealthInfo() {
    const currentData = {
        height: document.getElementById('height').textContent,
        weight: document.getElementById('weight').textContent,
        bloodType: document.getElementById('bloodType').textContent,
        activityLevel: document.getElementById('activityLevel').textContent
    };

    const height = prompt('Height (cm):', currentData.height) || currentData.height;
    const weight = prompt('Weight (kg):', currentData.weight) || currentData.weight;
    const bloodType = prompt('Blood Type:', currentData.bloodType) || currentData.bloodType;
    const activityLevel = prompt('Activity Level:', currentData.activityLevel) || currentData.activityLevel;

    document.getElementById('height').textContent = height;
    document.getElementById('weight').textContent = weight;
    document.getElementById('bloodType').textContent = bloodType;
    document.getElementById('activityLevel').textContent = activityLevel;

    // Calculate BMI
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    if (heightNum && weightNum) {
        const bmi = (weightNum / ((heightNum / 100) ** 2)).toFixed(1);
        document.getElementById('bmi').textContent = bmi;
    }

    // Save to localStorage
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
    profileData.height = height;
    profileData.weight = weight;
    profileData.bloodType = bloodType;
    profileData.activityLevel = activityLevel;
    if (heightNum && weightNum) {
        profileData.bmi = (weightNum / ((heightNum / 100) ** 2)).toFixed(1);
    }
    localStorage.setItem('profileData', JSON.stringify(profileData));

    showNotification('Health information updated!', 'success');
}

// Edit Medical History
function editMedicalHistory() {
    const currentData = {
        allergies: document.getElementById('allergies').textContent,
        medications: document.getElementById('medications').textContent,
        conditions: document.getElementById('conditions').textContent,
        surgeries: document.getElementById('surgeries').textContent,
        familyHistory: document.getElementById('familyHistory').textContent
    };

    const allergies = prompt('Allergies:', currentData.allergies) || currentData.allergies;
    const medications = prompt('Current Medications:', currentData.medications) || currentData.medications;
    const conditions = prompt('Chronic Conditions:', currentData.conditions) || currentData.conditions;
    const surgeries = prompt('Previous Surgeries:', currentData.surgeries) || currentData.surgeries;
    const familyHistory = prompt('Family History:', currentData.familyHistory) || currentData.familyHistory;

    document.getElementById('allergies').textContent = allergies;
    document.getElementById('medications').textContent = medications;
    document.getElementById('conditions').textContent = conditions;
    document.getElementById('surgeries').textContent = surgeries;
    document.getElementById('familyHistory').textContent = familyHistory;

    // Save to localStorage
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
    profileData.allergies = allergies;
    profileData.medications = medications;
    profileData.conditions = conditions;
    profileData.surgeries = surgeries;
    profileData.familyHistory = familyHistory;
    localStorage.setItem('profileData', JSON.stringify(profileData));

    showNotification('Medical history updated!', 'success');
}

// Edit Emergency Contacts
function editEmergencyContacts() {
    // In a real application, this would open a modal or navigate to emergency contacts page
    showNotification('Navigate to Emergency page to edit contacts', 'info');
    // Could also redirect: window.location.href = '../emergency/emergency.html';
}

// Change Password
function changePassword() {
    const currentPassword = prompt('Enter current password:');
    if (!currentPassword) return;

    const newPassword = prompt('Enter new password:');
    if (!newPassword) return;

    const confirmPassword = prompt('Confirm new password:');
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // In a real application, this would send to backend
    showNotification('Password changed successfully!', 'success');
}

// Enable 2FA
function enable2FA() {
    const enable = confirm('Enable Two-Factor Authentication?');
    if (enable) {
        // In a real application, this would initiate 2FA setup
        showNotification('Two-Factor Authentication enabled!', 'success');
    }
}

// Download Data
function downloadData() {
    // In a real application, this would generate and download user data
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'profile-data.json';
    link.click();
    URL.revokeObjectURL(url);

    showNotification('Data downloaded!', 'success');
}

// Delete Account
function deleteAccount() {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
        const finalConfirm = prompt('Type "DELETE" to confirm:');
        if (finalConfirm === 'DELETE') {
            // In a real application, this would send delete request to backend
            showNotification('Account deletion requested. You will receive a confirmation email.', 'info');
        } else {
            showNotification('Account deletion cancelled', 'info');
        }
    }
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