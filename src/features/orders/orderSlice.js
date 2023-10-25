import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addOrder, fetchAllOrders, updateOrderById } from './orderAPI';

const initialState = {
  orders: [],
  currentOrder: null,
  status: 'idle',
  totalOrders: null,
  ordersLoaded: false
};
export const addOrderAsync = createAsyncThunk(
  'order/addOrder',
  async (orderDetail) => {
    const response = await addOrder(orderDetail);
    return response.data;
  }
);
export const fetchAllOrdersAsync = createAsyncThunk(
  'order/fetchAllOrders',
  async (pagination) => {
    const response = await fetchAllOrders(pagination);
    return response.data;
  }
);
export const updateOrderByIdAsync = createAsyncThunk(
  'order/updateOrderById',
  async (update) => {
    const response = await updateOrderById(update);
    return response.data;
  }
);


export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetCurrentOrder: (state) => {
      state.currentOrder = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addOrderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders.push(action.payload)
        state.currentOrder = action.payload
      })
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders = action.payload.allOrders
        state.totalOrders = action.payload.totalOrders
        state.ordersLoaded = true
      })
      .addCase(updateOrderByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrderByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.orders.findIndex(order => order.id === action.payload.id)
        state.orders[index] = action.payload
      });
  },
});

export const { resetCurrentOrder } = orderSlice.actions;
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectAllOrders = (state) => state.order.orders
export const selectTotalOrders = (state) => state.order.totalOrders
export const selectOrdersLoaded =  (state) => state.order.ordersLoaded

export default orderSlice.reducer;
