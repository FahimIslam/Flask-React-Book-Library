import React from 'react'
import {useState} from 'react';
import httpClient from '../components/httpClient';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const cards = [1];

function Book(props){

  const [open, setOpen] = React.useState(false);
  const [bookTitle, setbookTitle] = useState(null);
  const [bookAuthor, setbookAuthor] = useState(null);
  const [bookYear, setbookYear] = useState(null);
  const [bookGenre, setbookGenre] = useState(null);
  const [bookPublisher, setbookPublisher] = useState(null);
  const [bookDescription, setbookDescription] = useState(null);

  const editBook = (book) => {
    props.editBook(book)
  }

  const deleteBook = (id) => {
    fetch(`http://127.0.0.1:5000/delete/${id}/`, {
      'method' : 'DELETE',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        id: id
      })
    }).then(resp => resp.json())
    .then(() => props.deletedBook(id))
  }

  const addWishlist = async () => {
    try{
      await httpClient.post("http://localhost:5000/addwishlist", {
        title: bookTitle,
        author: bookAuthor, 
        year: bookYear, 
        genre: bookGenre, 
        publisher: bookPublisher, 
        description: bookDescription
      })
        .then(resp => {
          console.log(resp.data); 
        })
    }
    catch (error) {
      alert("Not Authenticated. Please Sign In")
      window.location.href = "/signin"     
    }  
  }

  const handleClickOpen = (id) => {
    setOpen(true);
    props.books.map(
      (book)=>{
        if(book.id===id){
          setbookTitle(book.title)
          setbookAuthor(book.author)
          setbookYear(book.year)
          setbookGenre(book.genre)
          setbookPublisher(book.publisher)
          setbookDescription(book.description)
        }
      }
    )
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
  <>
    {props.books && props.books.map(book => {
      return(
      <>        
        {cards.map((card) => (
          <Grid item key={card} xs={2}>
            <Card variant="outlined" sx={{height:'100%', display:'flex', flexDirection:'column'}}>
              <CardMedia>
                <img src={`../img/${book.title}.jpg`} width={165} height={264}/>
              </CardMedia>
              <CardContent>{book.title}</CardContent>
              <CardContent>{book.author}</CardContent>
              <CardActions><Button fullWidth onClick={() => handleClickOpen(book.id)}>View</Button></CardActions>
              <CardActions><Button fullWidth onClick={() => editBook(book)}>Edit</Button></CardActions>                                                                   
              <CardActions><Button fullWidth onClick={() => deleteBook(book.id)}>Delete</Button></CardActions>                             
            </Card>
          </Grid>
        ))}
      </>
      )
    })
  }

      <>        
        <Dialog maxWidth="md" open={open} onClose={handleClose}>
          <DialogTitle><Typography variant='h5'>{bookTitle}</Typography></DialogTitle>
          <DialogContent>         
            <Card sx={{ display: 'flex' }}>
              <CardMedia>
                <img src={`../img/${bookTitle}.jpg`} width={375} height={600}/>
              </CardMedia>
              <CardContent> 
                <Typography gutterBottom>Author: {bookAuthor}</Typography>
                <Typography gutterBottom>Year: {bookYear}</Typography>
                <Typography gutterBottom>Genre: {bookGenre}</Typography>
                <Typography gutterBottom>Publisher: {bookPublisher}</Typography>
                <Divider/>
                <Typography gutterBottom sx={{textDecoration: 'underline'}}>Description</Typography>
                <Typography align='justify' gutterBottom variant="subtitle2">{bookDescription}</Typography>
                <Button variant="contained" onClick={() => addWishlist()}>Add to Wishlist</Button>
              </CardContent>
            </Card>    
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
  </>
  )
}

export default Book