import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteUser, fetchUsers } from './userAPI';
import { userState, User } from './userSlice';
import {
  Alert,
  AlertColor,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableSortLabel,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import UserForm from './UserForm';

const UserList = () => {
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(userState);
  const { items, status } = user;
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notify, setNotify] = useState(false);
  const [message, setMessage] = useState('');
  const [notification, setnotification] = useState<AlertColor>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortActive, setSortActive] = useState(false);

  const handleNotify = (message: string, type: AlertColor) => {
    setNotify(true);
    setMessage(message);
    setnotification(type);
  };

  const handleDelete = async () => {
    setDeleting(true);
    if (deletingUser) {
      await dispatch(deleteUser(deletingUser.id));
      handleNotify('User deleted!', 'success');
      setDeletingUser(null);
      setDeleting(false);
    }
  };

  const toggleSort = () => {
    if (sortActive) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    }
    setSortActive(true);
  };

  const sortItems = (users: User[], direction: 'asc' | 'desc') => {
    const sorted = users.sort((a, b) => {
      const auser = a.username.toLowerCase();
      const buser = b.username.toLowerCase();

      if (auser < buser) {
        return -1;
      }

      if (auser > buser) {
        return 1;
      }
      return 0;
    });

    return direction === 'asc' ? sorted : sorted.reverse();
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (sortActive) {
      setUsers(sortItems([...items], sortDirection));
    } else {
      setUsers(items);
    }
  }, [items, sortDirection, sortActive]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      {status === 'loading' ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={4} sx={{ p: 4 }}>
          <Box display="flex" mb={4}>
            <Typography variant="h5" sx={{ flex: 1 }}>
              User List
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setOpenForm(true);
                setEditingUser(null);
              }}
              startIcon={<AddIcon />}
            >
              Add new user
            </Button>
          </Box>

          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortActive}
                    direction={sortDirection}
                    onClick={toggleSort}
                  >
                    Username
                  </TableSortLabel>
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>City</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell align="center">
                    <Tooltip sx={{ mr: 2 }} title="Edit">
                      <IconButton
                        aria-label="edit"
                        component="span"
                        onClick={() => {
                          setEditingUser(row);
                          setOpenForm(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        component="span"
                        onClick={() => setDeletingUser(row)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.length === 0 && (
            <Typography sx={{ my: 2 }}>No users to show.</Typography>
          )}
        </TableContainer>
      )}

      <UserForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingUser(null);
        }}
        notify={handleNotify}
        editUser={editingUser}
      />

      <Snackbar
        open={notify}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={() => setNotify(false)}
      >
        <Alert
          elevation={6}
          onClose={() => setNotify(false)}
          severity={notification}
        >
          {message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deletingUser !== null}
        onClose={() => setDeletingUser(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete user</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want permanently delete "{deletingUser?.email}"
            from the list?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingUser(null)}>Cancel</Button>
          <LoadingButton
            onClick={handleDelete}
            loading={deleting}
            variant="contained"
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserList;
