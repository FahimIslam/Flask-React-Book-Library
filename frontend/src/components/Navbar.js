import React from 'react'
import {useState, useEffect} from 'react';
import httpClient from '../components/httpClient';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';

export default function Navbar(props){
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    (async () => {
      try{ 
        const resp = await httpClient.get("http://localhost:5000/@me")
        setUser(resp.data)
      } catch (error) {
        console.log("Not Authenticated")
      }   
    })();
  }, [])

  const logoutUser = async () => {
    await httpClient.post("http://localhost:5000/logout")
    window.location.href = "/"
    alert("Successfully Logged Out")
  }

  const searchBook = () => {
    fetch(`http://127.0.0.1:5000/search`, {
        'method' : 'POST', 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({search})
    }).then(resp => resp.json())
    .then(resp => props.searchedBook(resp))
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return(
    <AppBar position="static" color="default">
      <Toolbar>
        <Link href="/" variant="h6" color="text.primary" noWrap sx={{flexGrow: 1}}>BOOK LIBRARY</Link>
        <TextField variant="standard" placeholder="Search By Title Author Genre" sx={{mx:1.5}} value={search}
        onChange={(e) => setSearch(e.target.value)}/>
        <Link variant="button" color="text.primary" onClick={() => searchBook()} sx={{mx:1.5}}><SearchIcon/></Link>     
        <Link variant="button" color="text.primary" href="/wishlist" sx={{mx:1.5}}>Wishlist</Link>     
        {user != null ? (
        <>
          <IconButton color="success" onClick={handleMenu}>
            <AccountCircleIcon/>
          </IconButton>

          <Menu id="menu-appbar" anchorEl={anchorEl} 
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}>
                <MenuItem><AccountCircleIcon/>{user.name}</MenuItem>
                <MenuItem>{user.email}</MenuItem>      
                <Divider/>
                <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </Menu>
        </>
        ) : (
        <>
          <Button href="/register" variant="outlined" sx={{mx:1.5}}>Register</Button>
          <Button href="/signin" variant="outlined" sx={{mx:1.5}}>Sign In</Button>
        </>
        )}
      </Toolbar>
    </AppBar>
  )
}

