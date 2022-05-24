import React from 'react'
import {useState} from 'react';
import Navbar from './Navbar';
import httpClient from './httpClient';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';

export default function Register(){

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const registerUser = async () => {
    try{ 
      const resp = await httpClient.post("http://localhost:5000/register", {name, email, password})
      console.log(resp.data)
      window.location.href = "/"
      alert("Successfully Registered User")
    } catch (error) {
      if (error.response.status === 401){
        alert("Incorrect Email or Password")
      }
    }   
  }

  return ( 
  <>       
    <Navbar/>
      <Container component="main" maxWidth="xs">
        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>           
          <h2>Register</h2>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField fullWidth label="Name" value={name}                           
            onChange={(e) => setName(e.target.value)}/>
            
            <TextField margin="normal" fullWidth label="Email Address" value={email}
            onChange={(e) => setEmail(e.target.value)}/>
              
            <TextField margin="normal" fullWidth label="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}/>
              
            <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}
            onClick={registerUser}>Register</Button>

            <Link href="/signin">{"Already have an account? Sign In"}</Link>                       
          </Box>
        </Box>
      </Container>
  </>
  );
}