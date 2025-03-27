const API_URL = 'http://localhost:3001';

// Helper function for making API requests
async function makeRequest(url, method = 'GET', body = null, headers = {}) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (parseError) {
                throw new Error(response.statusText || 'Network response was not ok');
            }
            throw new Error((errorData && errorData.message) || response.statusText || 'Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
}

// Registration
async function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const messageElement = document.getElementById('registerMessage');

    // Clear previous error message
    messageElement.textContent = ''; // Add this line
    messageElement.style.color = '';

    try {
        const response = await makeRequest(`${API_URL}/auth/register`, 'POST', { username, password });
        messageElement.textContent = response.message || 'Registration successful!';
        messageElement.style.color = 'green';
        clearForm('registerForm');
    } catch (error) {
        messageElement.textContent = error.message || 'Registration failed.';
        messageElement.style.color = 'red';
    }
}

// Login
async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const protectedArea = document.querySelector('#protectedArea');
    const authForms = document.getElementById('authForms');
    const logoutButton = document.querySelector('[onclick="logout()"]');
    const messageElement = document.getElementById('loginMessage');

    // Clear previous error message
    messageElement.textContent = ''; // Add this line
    messageElement.style.color = '';

    try {
        const response = await makeRequest(`${API_URL}/auth/login`, 'POST', { username, password });
        const token = response.token;
        localStorage.setItem('token', token);
        authForms.style.display = 'none'; // Hide auth forms
        logoutButton.style.display = 'block'; // Show logout button
        if (protectedArea) { // Add this check
           protectedArea.style.display = 'block';
        }
        clearForm('loginForm'); // Clear the login form
    } catch (error) {
        const messageElement = document.getElementById('loginMessage');
        messageElement.textContent = error.message || 'Login failed.';
        messageElement.style.color = 'red';
    }
}

// Get Protected Data
async function getProtectedData() {
    const messageElement = document.getElementById('protectedMessage');
    const dataElement = document.getElementById('protectedData');
    const token = localStorage.getItem('token');

    if (!token) {
        messageElement.textContent = 'Please log in first.';
        messageElement.style.color = 'red';
        return;
    }

    try {
        const response = await makeRequest(`${API_URL}/protected/data`, 'GET', null, {
            'Authorization': `Bearer ${token}`
        });
        messageElement.textContent = 'Data retrieved successfully!';
        messageElement.style.color = 'green';
        dataElement.textContent = JSON.stringify(response, null, 2);
    } catch (error) {
        messageElement.textContent = error.message || 'Failed to retrieve data.';
        messageElement.style.color = 'red';
        if (error.message === 'Invalid token' || error.message === 'No token provided') {
            localStorage.removeItem('token');
        }
        dataElement.textContent = '';
    }
}
// Logout
function logout() {
    localStorage.removeItem('token'); // Remove token from local storage
    const protectedArea = document.querySelector('#protectedArea');
    const protectedMessage = document.getElementById('protectedMessage'); // Find the message element
    const authForms = document.getElementById('authForms');
    const logoutButton = document.querySelector('[onclick="logout()"]');
    if (protectedArea) {  // Add this check
        protectedArea.style.display = 'none';
    }
    authForms.style.display = 'block'; // Show auth forms
    logoutButton.style.display = 'none'; // Hide logout button

    if (protectedMessage) {
        protectedMessage.textContent = 'Logged out successfully.'; // update logout Message
      }
  
      if (protectedData) {
          protectedData.textContent = '';  // Clear the data
      }
  
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
    }
}