import React from 'react'
import Box from '@mui/material/Box';

export default function Footer(){
  return(
    <div>      
    <Box sx={{bgcolor: 'background.paper', p:6}} component="footer">
      <h3 align="center">Footer</h3>
      <h4 align="center">Copyright ©BookLibrary 2022.</h4>
    </Box>
    </div>
  )
};

