// import { fetchWithRetries } from "../comman/retryApiCall";

export function addOrder(orderDetail) {
  return new Promise(async (resolve) => {
    const response = await fetch('api/orders/', {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify(orderDetail)
    });
    const data = await response.json();
    resolve({ data })
  });
}
export function fetchAllOrders(pagination) {

  return new Promise(async (resolve) => {
    let queryString = '';
    for (const key in pagination) {
      // pagination = {_page:3,_limit:10}
      queryString += `${key}=${pagination[key]}&`
    }

    const response = await fetch('api/admin/orders?' + queryString, {
      method: 'GET',
      credentials: "include"
    });
    const data = await response.json();
    const totalOrders = response.headers.get('X-Total-Count')
    resolve({ data: { allOrders: data, totalOrders: +totalOrders } })
  });
}
export function updateOrderById(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/admin/orders/' + update.id, {
      method: 'PATCH',
      body: JSON.stringify({ status: update.status }),
      credentials: "include",
      headers: {
        "Content-Type": 'application/json',
      }

    });
    const data = await response.json();
    resolve({ data })
  });
}


