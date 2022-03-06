import React, { useState, useEffect } from 'react';
import {
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { User, userState } from './userSlice';
import { createUser, updateUser } from './userAPI';

interface Fields {
  name: string;
  username: string;
  city: string;
  email: string;
}

interface UserFormProps {
  open: boolean;
  editUser: User | null;
  onClose: () => void;
  notify: (message: string, type: AlertColor) => void;
}

const UserForm = (props: UserFormProps) => {
  const { open, editUser, onClose, notify } = props;
  const title = editUser ? 'Edit user' : 'Add new user';
  const dispatch = useAppDispatch();
  const user = useAppSelector(userState);
  const [loading, setLoading] = useState(false);

  const schema = z
    .object({
      name: z.string().nonempty({ message: 'Name is required.' }),
      username: z.string().nonempty({ message: 'Username is required.' }),
      city: z.string().nonempty({ message: 'City is required.' }),
      email: z.string().email({ message: 'Enter a valid email address.' }),
    })
    .refine(
      (data) => {
        if (editUser) {
          let filtered = user.items.filter(
            (v) => v.username !== editUser.username,
          );
          return !filtered.some((v) => v.username === data.username);
        }
        return !user.items.some((v) => v.username === data.username);
      },
      {
        message: 'Username is already taken',
        path: ['username'],
      },
    )
    .refine(
      (data) => {
        if (editUser) {
          let filtered = user.items.filter((v) => v.email !== editUser.email);
          return !filtered.some((v) => v.email === data.email);
        }
        return !user.items.some((v) => v.email === data.email);
      },
      {
        message: 'Email is already taken',
        path: ['email'],
      },
    );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: '',
      username: '',
      city: '',
      email: '',
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (editUser) {
      setValue('name', editUser.name);
      setValue('username', editUser.username);
      setValue('city', editUser.city);
      setValue('email', editUser.email);
    }
  }, [editUser, setValue]);

  const onSubmit = async (data: Fields) => {
    const { name, username, city, email } = data;
    setLoading(true);

    if (editUser) {
      // update user
      await dispatch(
        updateUser({
          id: editUser.id,
          name: data.name,
          username: data.username,
          city: data.city,
          email: data.email,
        }),
      );

      setLoading(false);
      handleClose();
      notify('User updated!', 'success');
    } else {
      const id =
        user.items.length > 0 ? user.items[user.items.length - 1].id + 1 : 1;

      // new user
      const newUser = {
        id,
        name,
        username,
        city,
        email,
      };

      await dispatch(createUser(newUser));

      setLoading(false);
      handleClose();
      notify('User added!', 'success');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Name"
                variant="outlined"
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                {...field}
              />
            )}
          />

          <Controller
            name="username"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Username"
                variant="outlined"
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.username}
                helperText={errors.username?.message}
                fullWidth
                {...field}
              />
            )}
          />

          <Controller
            name="city"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="City"
                variant="outlined"
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.city}
                helperText={errors.city?.message}
                fullWidth
                {...field}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Email"
                variant="outlined"
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                {...field}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Submit
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;
