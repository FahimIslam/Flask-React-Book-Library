import React from 'react'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';

export default function Wishlist(props) {

  const removeFromWishlist = (id) => {
    fetch(`http://127.0.0.1:5000/deletewishlist/${id}/`, {
      'method' : 'DELETE',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        id: id
      })
    }).then(resp => resp.json())
    .then(() => props.removedWishlist(id))
  }

  return (
    <>
    {props.wishlists && props.wishlists.map(wishlist => {
      return(
      <>
        <Grid item xs={12}>
          <CardActionArea component="a" href="#">
            <Card sx={{ display: 'flex' }}>
              <CardContent sx={{ flex: 1 }}>
              <CardContent>{wishlist.title}</CardContent>
              <CardContent>{wishlist.author}</CardContent>
              <CardContent>{wishlist.year}</CardContent>
              <CardContent>{wishlist.genre}</CardContent>
                <Button variant="contained" size="small" onClick={() => removeFromWishlist(wishlist.id)}>Remove from Wishlist</Button>
              </CardContent>
              <CardMedia>
                <img src={`../img/${wishlist.title}.jpg`} width={165} height={264}/>
              </CardMedia>
            </Card>
          </CardActionArea>
        </Grid>       
      </>
      )
    })}
    </>
  )
}

