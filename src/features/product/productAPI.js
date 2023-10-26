// import { fetchWithRetries } from "../comman/retryApiCall";

export function createNewProduct(product) {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/admin/product-form/add-product', {
      method: 'POST',
      body: JSON.stringify(product),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();
    resolve({ data })
  });
}
export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/admin/product-form/edit-product/' + update.id, {
      method: 'PATCH',
      body: JSON.stringify(update),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();

    resolve({ data })
  });
}
export function fetchProductById(id) {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/product/' + id, {
      method: 'GET',
      credentials: "include"
    });
    const data = await response.json();
    resolve({ data })
  });
}
export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/categories', {
      method: 'GET',
      credentials: "include"
    });
    const data = await response.json();
    resolve({ data })
  });
}
export function fetchBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/brands', {
      method: 'GET',
      credentials: "include"
    });
    const data = await response.json();
    resolve({ data })
  });
}
export function fetchProductByFilter(filter, sort, pagination) {


  return new Promise(async (resolve, reject) => {
    let queryString = '';
    for (const key in filter) {
      const categoryValues = filter[key];
      if (categoryValues.length) {
        queryString += `${key}=${categoryValues}&`;
      }
    }
    for (const key in sort) {

      queryString += `${key}=${sort[key]}&`;
    }
    for (const key in pagination) {

      queryString += `${key}=${pagination[key]}&`;
    }
    const response = await fetch('/api/product?' + queryString, {
      method: 'GET',
      credentials: "include"
    });
    if (response.status === 401) {
      reject({ message: 'unauthorized' })
    }
    const data = await response.json();
    const totalItems = response.headers.get('X-Total-Count')
    resolve({ data: { products: data, totalItems: +totalItems } })
  });
}


