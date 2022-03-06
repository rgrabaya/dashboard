import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../app/http';
import { User } from './userSlice';

export const fetchUsers = createAsyncThunk('user/fetch', async () => {
  const storage = localStorage.getItem('users');

  if (storage) {
    const fakeAPI = await new Promise((resolve) =>
      setTimeout(() => {
        resolve(JSON.parse(storage));
      }, 1000),
    );
    return fakeAPI;
  } else {
    const response = await http.get('/data');
    const users = response.data.map((user: any) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      city: user.address.city,
      email: user.email,
    }));
    return users;
  }
});

export const createUser = createAsyncThunk(
  'user/create',
  async (user: User) => {
    return new Promise<User>((resolve) =>
      setTimeout(() => resolve(user), 1000),
    );
  },
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: User) => {
    return new Promise<User>((resolve) =>
      setTimeout(() => resolve(user), 1000),
    );
  },
);

export const deleteUser = createAsyncThunk(
  'user/delete',
  async (id: number) => {
    return new Promise<number>((resolve) =>
      setTimeout(() => resolve(id), 1000),
    );
  },
);
