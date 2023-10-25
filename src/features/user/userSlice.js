import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchOrdersByUser, updateUser, fetchLoggedInUserInfo } from './userAPI';

const initialState = {
  orders: null,
  status: 'idle',
  userInfo: null,
  userInfoLoaded: false,
  userOrdersLoaded: false
};
export const fetchOrdersByUserAsync = createAsyncThunk(
  'user/fetchOrderByUser',
  async () => {
    const response = await fetchOrdersByUser();
    return response.data;
  }
);
export const fetchLoggedInUserInfoAsync = createAsyncThunk(
  'user/fetchLoggedInUserInfo',
  async () => {
    const response = await fetchLoggedInUserInfo();
    return response.data;
  }
);

export const updateUserAsync = createAsyncThunk(
  'user/updateUser',
  async ({ update, toast, type }) => {
    const response = await updateUser(update);
      if (type === 'ADD') {
        toast.success('Added Successfully')

      }
      else if (type === "REMOVE") {
        toast.success('Removed Successfully', {
          icon: '🗑️'
        })

      }
      else {
        toast.success('Edited Successfully', {
          icon: '✏️'
        })

      }

    return response.data;
  }
);
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfoNull: (state) => {
      state.userInfo = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrdersByUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders = action.payload;
        state.userOrdersLoaded = true
      })
      .addCase(fetchOrdersByUserAsync.rejected, (state, action) => {
        state.userOrdersLoaded = true

      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userInfo = action.payload;
      })
      .addCase(fetchLoggedInUserInfoAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLoggedInUserInfoAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userInfo = action.payload;
        state.userInfoLoaded = true;
      })
      .addCase(fetchLoggedInUserInfoAsync.rejected, (state, action) => {
        state.userInfoLoaded = true;
      })



  },
});

export const { setUserInfoNull } = userSlice.actions;

export const selectOrdersByUser = (state) => state.user.orders;
export const selectLoggedInUserInfo = (state) => state.user.userInfo
export const selectUserInfoLoaded = (state) => state.user.userInfoLoaded
export const selectUserOrdersLoaded = (state) => state.user.userOrdersLoaded
export const fetchCartItemsSliceStatus = (state) => state.user.status

export default userSlice.reducer;
