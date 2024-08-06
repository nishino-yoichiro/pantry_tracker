'use client'
import Image from "next/image";
import React from 'react';
import { useState, useEffect} from "react"
import {firestore} from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button, Grid} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDoc, doc, getDoc, collection, getDocs, query, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('')
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id, 
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }
  const addItem = async (item, quantity) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    
    if(docSnap.exists()){
      const {quantity : existingQuantity} = docSnap.data()
      await setDoc(docRef, {quantity: existingQuantity  + quantity})
    }
    else{
      await setDoc(docRef, {quantity})
    }

    await updateInventory()
  }

  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      } else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  const deleteItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    
    if(docSnap.exists()){
      await deleteDoc(docRef)
    }

    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return(
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e)=>{
                setItemName(e.target.value)
              }}
            />
            <TextField 
              variant='outlined'
              fullWidth
              type="number"
              value={itemQuantity}
              onChange={(e)=>{
                setItemQuantity((e.target.value))
              }}
              labeled = "Quantity"
            />
            <Button
              variant="outlined"
              onClick={()=>{
                addItem(itemName, Number(itemQuantity))
                setItemName('')
                setItemQuantity('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography variant="h3" sx= {{ fontFamily: 'Roboto, sans-serif', fontWeight: '400', fontSize: '2rem', color: '#008080'}}>What's in my Pantry?</Typography>
      <Box border="1px solid #008080">
        <Box
          width="800px"
          height="100px"
          bgcolor="#D3D3D3"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="0 16px"
        >
          <Button variant="contained" onClick={() => handleOpen()} style={{ width: '48%', height: '56px', backgroundColor: '#008080'}}>
            Add New Item
          </Button>
          <TextField
            variant="outlined"
            placeholder="SEARCH ITEMS"
            fontFamily="Roboto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '48%' }}
          />
        </Box>
        {filteredInventory.map(({ name, quantity }) => (
          <Grid item xs={12} key={name}>
            <Box
              width="100%"
              minHeight="50px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor='#f0f0f0'
              padding={3}
            >
              <Typography variant='h5' color='#333' textAlign='center' flex={1}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant='h5' color='#333' textAlign='center' flex={1}>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2} flex={1} justifyContent="center">
                <Button variant="contained" onClick={() => addItem(name)} sx={{backgroundColor: '#008080'}}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)} sx={{backgroundColor: '#FF6347'}}>
                  Remove
                </Button>
                <Button variant="contained" onClick={() => deleteItem(name)} sx={{backgroundColor: '#FF6347'}}>
                  <DeleteIcon />
                </Button>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Box>
    </Box>
  )
}
