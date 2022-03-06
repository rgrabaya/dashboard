import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchUsers, createUser, updateUser, deleteUser } from './userAPI';

export interface User {
  id: number;
  name: string;
  username: string;
  city: string;
  email: string;
}

export interface UserState {
  items: User[];
  status: 'idle' | 'loading';
}

export const initialState: UserState = {
  items: [],
  status: 'idle',
};

const updateLocalData = (items: User[]) => {
  localStorage.setItem('users', JSON.stringify(items));
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
        updateLocalData(state.items);
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
        updateLocalData(state.items);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedItems = state.items.map((v) => {
          if (v.id === action.payload.id) {
            return action.payload;
          }
          return v;
        });
        state.items = updatedItems;
        updateLocalData(state.items);
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const filteredItems = state.items.filter(
          (v) => v.id !== action.payload,
        );
        state.items = filteredItems;
        updateLocalData(state.items);
      });
  },
});

export const userState = (state: RootState) => state.user;

export default userSlice.reducer;
