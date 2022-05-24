import React from 'react'
import {useState, useEffect} from 'react';
import httpClient from '../components/httpClient';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Wishlist from './Wishlist';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

export default function Wishlists(props) {

  const [wishlists, setWishlists] = useState([])

  useEffect(() => {
    (async () => {
      try{
        await httpClient.get("http://localhost:5000/getwishlist", {withCredentials: true})
        .then(res => {
          const wish = res.data;
          setWishlists(wish)
        })
      } catch (error) {
        console.log("Not Authenticated")
      }   
    })();
  }, [])

  const removedWishlist = (id) => {
    const other_wishlist = wishlists.filter(mywishlist => {
      if(mywishlist.id === id){
        return false
      }
      else{
        return true
      }
    })
    setWishlists(other_wishlist)
  }

  return(
    <div>
      <Navbar/>
        <main>     
          <Container maxWidth="lg">
            <Grid container spacing={4}>
            <Wishlist wishlists={wishlists} removedWishlist={removedWishlist}/>
            </Grid>
          </Container>
        </main>
      <Footer/>
    </div>
  );
}