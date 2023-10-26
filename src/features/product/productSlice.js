import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCategories, fetchBrands, fetchProductByFilter, fetchProductById, createNewProduct, updateProduct } from './productAPI';

const initialState = {
  products: [],
  categories: [],
  brands: [],
  totalItems: 0,
  selectedProduct: null,
  status: 'idle',

};

export const createNewProductAsync = createAsyncThunk(
  'product/createNewProduct',
  async ({ product, toast }) => {
    const response = await createNewProduct(product);
    toast.success('Product Added Successfully')
    return response.data;
  }
);
export const updateProductAsync = createAsyncThunk(
  'product/updateProduct',
  async ({ update, toast, type }) => {
    const response = await updateProduct(update);
      if (type === 'DELETE') {

        toast.success(`Deleted Successfully`, { icon: '🗑️' });
      }
      else {
        toast.success(`updated Successfully`);

      }
    return response.data;
  }
);
export const fetchProductByIdAsync = createAsyncThunk(
  'product/fetchProductById',
  async (id) => {
    const response = await fetchProductById(id);
    return response.data;
  }
);
export const fetchCategoriesAsync = createAsyncThunk(
  'product/fetchCategories',
  async () => {
    const response = await fetchCategories();
    return response.data;
  }
);
export const fetchBrandsAsync = createAsyncThunk(
  'product/fetchBrands',
  async () => {
    const response = await fetchBrands();
    return response.data;
  }
);
export const fetchProductByFilterAsync = createAsyncThunk(
  'product/fetchProductByFilter',
  async ({ filter, sort, pagination }, { rejectWithValue }) => {
    try {

      const response = await fetchProductByFilter(filter, sort, pagination);
      return response.data;
    }
    catch (err) {
      rejectWithValue(err)
    }
  }
);


export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchProductByFilterAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductByFilterAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems
      })

      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.categories = action.payload;
      })
      .addCase(fetchBrandsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.brands = action.payload;
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedProduct = action.payload;
      })
      .addCase(createNewProductAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewProductAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products.push(action.payload)
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.products.findIndex(product => product.id === action.payload.id)
        state.products[index] = action.payload
      })

  },
});


export const { clearSelectedProduct } = productSlice.actions
export const selectAllProducts = (state) => state.product.products;
export const selectTotalItems = (state) => state.product.totalItems;
export const selectCategory = (state) => state.product.categories;
export const selectBrand = (state) => state.product.brands;
export const selectedProductById = (state) => state.product.selectedProduct;
export const selectProductSliceStatus = (state) => state.product.status;


export default productSlice.reducer;
