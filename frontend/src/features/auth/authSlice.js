// Here our reducers and initial state will be
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Get user from local storage
const user = JSON.parse(localStorage.getItem("user"));

// Initial state that pertains to the user part of authentication
const initialState = {
	// If there is a user in local storage then have the value of that user if not have value of null.
	user: user ? user : null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: "",
};

// Register user - this is an asycn thunk function
// creatAsyncThunk takes 3, a string wtih the action, an async function with two params: user which comes from the register component and second argument thunkAPI
export const register = createAsyncThunk(
	"auth/register",
	async (user, thunkAPI) => {
		try {
			// makre request
			return await authService.register(user);
		} catch (error) {
			// save erros to message variable... if any of the following exist then save to const message
			const message =
				(error.response && error.response.data & error.response.data.message) ||
				error.message ||
				error.toString();
			// use thunkapi method rejectWithValue and pass in the message to send the message as payload
			return thunkAPI.rejectWithValue(message);
		}
	}
);

// Logout
export const logout = createAsyncThunk("auth/logout", async (thunkAPI) => {
  try {
    return authService.logout();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Login User
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
	try {
		// makre request
		return await authService.login(user);
	} catch (error) {
		// save erros to message variable... if any of the following exist then save to const message
		const message =
			(error.response && error.response.data & error.response.data.message) ||
			error.message ||
			error.toString();
		// use thunkapi method rejectWithValue and pass in the message to send the message as payload
		return thunkAPI.rejectWithValue(message);
	}
});

// slice
export const authSlice = createSlice({
	// name of slice
	name: "auth",
	// Slice initial state will be the initial state we have above
	initialState: initialState,
	// Define reducers. All reducers here will not be asynchronous / thunkfunctions. They will be inside extra reducers.
	reducers: {
		// The only regular reducer we want is a function called reset to reset the state to our default values.
		reset: (state) => {
			state.isLoading = false;
			state.isSuccess = false;
			state.isError = false;
			state.message = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.user = null;
			})
			.addCase(login.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.user = null;
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = null;
			});
	},
});
// To export reset reducer we need to use authslice.actions
export const { reset } = authSlice.actions;
// Export the authslice reducer
export default authSlice.reducer;
