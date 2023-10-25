import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addToCart, fetchCartItems, removeFromCart, updateCart, resetCart } from './cartAPI';

const initialState = {
  items: [],
  status: 'idle',
  cartLoaded: false
};
export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ item, toast }) => {
    const response = await addToCart(item);
    toast.success('Added Successfully', {

      icon: '🛒'
    });
    return response.data;
  }
);
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async ({ itemId, toast }) => {
    const response = await removeFromCart(itemId);
      toast.success('Product Deleted Successfully', {
        icon: '🗑️'
      })
    return response.data;
  }
);
export const updateCartAsync = createAsyncThunk(
  'cart/updateCart',
  async (update) => {
    const response = await updateCart(update);
    return response.data;
  }
);

export const fetchCartItemsAsync = createAsyncThunk(
  'cart/fetchCartItems',
  async () => {
    const response = await fetchCartItems();
    return response.data;
  }
);
export const resetCartAsync = createAsyncThunk(
  'cart/resetCart',
  async () => {
    const response = await resetCart();
    return response.data;
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items.push(action.payload);
      })
      .addCase(fetchCartItemsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItemsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
        state.cartLoaded = true;
      })
      .addCase(fetchCartItemsAsync.rejected, (state, action) => {
        state.cartLoaded = true;
      })
      .addCase(removeFromCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.items.findIndex(item => item.id === action.payload.id)
        state.items.splice(index, 1)
      })
      .addCase(updateCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.items.findIndex(item => item.id === action.payload.id)
        state.items[index] = action.payload
      })
      .addCase(resetCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = []
      })
  },
});

// export const { increment } = counterSlice.actions;

export const selectItems = (state) => state.cart.items;
export const selectCartSliceStatus = (state) => state.cart.status;
export const selectCartLoaded = (state) => state.cart.cartLoaded;
export default cartSlice.reducer;
