// import { fetchWithRetries } from "../comman/retryApiCall";
export function addToCart(item) {
  return new Promise(async (resolve) => {
    const response = fetch('/api/cart', {
      method: "POST",
      body: JSON.stringify(item),
      credentials: "include",
      headers: {
        "Content-Type": 'application/json'
      }
    })
    const data = await response.json();
    resolve({ data })
  });
}
export function removeFromCart(itemId) {
  return new Promise(async (resolve) => {
    await fetch('/api/cart/' + itemId, {
      method: 'DELETE',
      credentials: "include",
      headers: {
        "Content-Type": 'application/json',
      }

    });
    resolve({ data: { id: itemId } })
  });
}
export function updateCart(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/cart/' + update.id, {
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
export function fetchCartItems() {
  return new Promise(async (resolve) => {

    const response = await fetch('/api/cart/Items', {
      method: 'GET',
      credentials: "include"
    })
    const data = await response.json();

    resolve({ data })

  })
}
export async function resetCart() {
  return new Promise(async (resolve) => {
    const response = await fetchCartItems()
    const products = response.data
    for (const product of products) {
      await removeFromCart(product.id)
    }
    resolve({ status: 'Cart Reset Successfully!' })
  })
}
