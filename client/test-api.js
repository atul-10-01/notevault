// Test script to verify API endpoints
const API_BASE_URL = 'http://localhost:5000/api';

async function testSignup() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        dateOfBirth: '1990-01-01'
      })
    });

    const data = await response.json();
    console.log('Signup Response:', data);
    return data;
  } catch (error) {
    console.error('Signup Error:', error);
  }
}

async function testLogin() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });

    const data = await response.json();
    console.log('Login Response:', data);
    return data;
  } catch (error) {
    console.error('Login Error:', error);
  }
}

// Test both endpoints
console.log('Testing API endpoints...');
testSignup().then(() => {
  console.log('Signup test completed');
});
