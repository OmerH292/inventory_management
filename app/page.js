'use client';
import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { Box, Stack, TextField, Modal, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { firestore } from '@/firebase'; // Ensure the path is correct

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore,'inventory'));
    const inventoryList = [];

    snapshot.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item); 
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const quantity = data.quantity || 0;
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item); 
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      gap={2}
    >
      <Typography variant='h1'>Inventory Management</Typography>
      <Button variant='contained' onClick={handleOpen}>Add New Item</Button>
      <Stack spacing={2} mt={2}>
        {inventory.map((item) => (
          <Box 
            key={item.name} 
            p={2} 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            bgcolor="#f0f0f0" 
            width="400px" 
            border="1px solid #ccc"
          >
            <Box display="flex" flexDirection="column">
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="h6">Quantity: {item.quantity}</Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => addItem(item.name)}
              >
                Add
              </Button>
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={() => removeItem(item.name)}
              >
                Remove
              </Button>
            </Box>
          </Box>
        ))}
      </Stack>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute" top="50%" left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant='h6'>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant='outlined'
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
