// import { fetchWithRetries } from "../comman/retryApiCall";

export function fetchOrdersByUser() {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/orders/', {
      method: 'GET',
      credentials: "include"
    })
    const data = await response.json();
    resolve({ data })

  })
}
export function updateUser(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/users/', {
      method: 'PATCH',
      body: JSON.stringify(update),
      credentials: "include",
      headers: {
        "Content-Type": 'application/json',
      }

    });
    const data = await response.json();
    resolve({ data })
  });
}
export function fetchLoggedInUserInfo() {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/users/', {
      method: "GET",
      credentials: "include"
    });
    const data = await response.json();
    resolve({ data })
  });
}




