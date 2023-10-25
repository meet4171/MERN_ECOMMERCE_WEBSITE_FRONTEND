// import { fetchWithRetries } from "../comman/retryApiCall";

export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }

    });
    const data = await response.json();
    resolve({ data })
  });
}
export function loginUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(userData),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }

      });
      if (response.status === 200) {
        const data = await response.json()
        resolve({ data })
      }
      else {
        const error = await response.text()
        reject({ error })
      }
    } catch (error) {
      reject({ error })
    }

  });
}
export function checkAuth() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('/api/auth/checkAuth', {
        method: "GET",
        credentials: "include"

      });
      if (response.status === 200) {
        const data = await response.json()
        resolve({ data })
      }
      else {
        const error = await response.text()
        reject({ error })
      }
    } catch (error) {
      reject({ error })
    }

  });
}

export function resetPasswordRequest(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('/api/auth/reset-password-request', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(email)
      })
      const data = await response.json()
      if (response.ok) {
        resolve(data);
      } else {
        reject(data);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function resetPassword(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const responseData = await response.json()
      if (response.ok) {
        resolve(responseData);
      } else {
        reject(responseData);
      }
    } catch (error) {
      reject(error);
    }
  });
}


export function logout() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        credentials: "include"
      });
      if (response.ok) {
        resolve({ data: 'success' });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

