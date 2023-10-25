import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUser, loginUser, logout, checkAuth, resetPasswordRequest, resetPassword } from './authAPI';
const initialState = {
  loggedInUserToken: null,
  userChecked: false,
  error: null,
  status: 'idle',
  resetMailSend: null,
  passReseted: false

};
export const createUserAsync = createAsyncThunk(
  'auth/createUser',
  async (userData) => {
    const response = await createUser(userData);
    return response.data;
  }
);
export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error)

    }
  }
)
export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    const response = await checkAuth();
    return response.data;
  }
)

export const resetPasswordRequestAsync = createAsyncThunk(
  'auth/resetPasswordRequest',
  async (email, { rejectWithValue }) => {
    try {

      const response = await resetPasswordRequest(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
);
export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await resetPassword(data);
      return response.message;

    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    // The value we return becomes the `fulfilled` action payload
    const response = await logout();
    return response;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setErrorNull: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload.error;

      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
        state.userChecked = true;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
        state.userChecked = true;
      })
      .addCase(resetPasswordRequestAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPasswordRequestAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.resetMailSend = action.payload
      })
      .addCase(resetPasswordRequestAsync.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload
      })
      .addCase(resetPasswordAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPasswordAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.passReseted = action.payload
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload
      })
      .addCase(logoutAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = null;
      })
  },
});

// export const { increment } = counterSlice.actions;

export const selectLoggedInUserToken = (state) => state.auth.loggedInUserToken;
export const selectUserChecked = (state) => state.auth.userChecked;
export const selectError = (state) => state.auth.error;
export const selectMailSend = (state) => state.auth.resetMailSend;
export const selectPassReseted = (state) => state.auth.passReseted;
export const selectLoginStatus = (state) => state.auth.status
export const { setErrorNull } = authSlice.actions;

export default authSlice.reducer;
