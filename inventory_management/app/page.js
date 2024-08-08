'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { firestore } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';
import 'tailwindcss/tailwind.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: '8px',
};

export default function Home() {
  const [inventory, setInventory] = useState({});
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [shelfName, setShelfName] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateInventory = async (selectedLocation) => {
    setLoading(true);
    const q = query(collection(firestore, 'inventory'), where('location', '==', selectedLocation));
    const querySnapshot = await getDocs(q);
    const items = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { shelf, name, quantity } = data;
      if (!items[shelf]) {
        items[shelf] = [];
      }
      items[shelf].push({ name, quantity, id: doc.id });
    });
    setInventory(items);
    setLoading(false);
  };

  useEffect(() => {
    if (location) {
      updateInventory(location);
    }
  }, [location]);

  const addItem = async (item, shelf, location) => {
    const docRef = doc(collection(firestore, 'inventory'), `${location}-${item}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { name: item, quantity: quantity + 1, shelf, location });
    } else {
      await setDoc(docRef, { name: item, quantity: 1, shelf, location });
    }
    await updateInventory(location);
  };

  const removeItem = async (item, shelf, location) => {
    const docRef = doc(collection(firestore, 'inventory'), `${location}-${item}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { name: item, quantity: quantity - 1, shelf, location });
      }
    }
    await updateInventory(location);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="bg-gray-100 p-4"
    >
      <Box className="w-full max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <Box className="bg-blue-600 text-white p-6 rounded-t-lg mb-4">
          <Typography variant="h3" component="h1" className="text-center font-bold">
            Inventory Management
          </Typography>
        </Box>
        <FormControl fullWidth className="mb-6">
          <InputLabel id="location-select-label">Location</InputLabel>
          <Select
            labelId="location-select-label"
            id="location-select"
            value={location}
            label="Location"
            onChange={(e) => setLocation(e.target.value)}
            className="bg-white"
          >
            <MenuItem value="Westgate">Westgate</MenuItem>
            <MenuItem value="Glass Co">Glass Co</MenuItem>
          </Select>
        </FormControl>
        {location && (
          <>
            <Button
              variant="contained"
              color="primary"
              className="mb-6 w-full py-3 bg-blue-500 hover:bg-blue-700"
              onClick={handleOpen}
            >
              Add New Item
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} className="bg-white">
                <Typography id="modal-modal-title" variant="h6" component="h2" className="text-center mb-4">
                  Add Item
                </Typography>
                <Stack width="100%" direction="column" spacing={2}>
                  <TextField
                    id="outlined-item"
                    label="Item"
                    variant="outlined"
                    fullWidth
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="bg-white"
                  />
                  <TextField
                    id="outlined-shelf"
                    label="Shelf"
                    variant="outlined"
                    fullWidth
                    value={shelfName}
                    onChange={(e) => setShelfName(e.target.value)}
                    className="bg-white"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    className="bg-blue-500 hover:bg-blue-700"
                    onClick={() => {
                      addItem(itemName, shelfName, location);
                      setItemName('');
                      setShelfName('');
                      handleClose();
                    }}
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            </Modal>
            {Object.keys(inventory).map((shelf) => (
              <Box key={shelf} className="my-4">
                <Box
                  width="100%"
                  className="bg-blue-200 flex justify-center items-center rounded-t-lg py-4 shadow"
                >
                  <Typography variant="h5" color="#333" className="text-center font-semibold">
                    {shelf}
                  </Typography>
                </Box>
                <TableContainer component={Paper} className="rounded-b-lg shadow-lg">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventory[shelf].map(({ name, quantity, id }) => (
                        <TableRow key={id}>
                          <TableCell component="th" scope="row">
                            {name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Unknown Item'}
                          </TableCell>
                          <TableCell align="right">{quantity}</TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              color="secondary"
                              className="bg-red-500 hover:bg-red-700"
                              onClick={() => removeItem(name, shelf, location)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
}

