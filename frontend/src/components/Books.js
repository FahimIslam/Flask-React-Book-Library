import React from 'react'
import {useState, useEffect} from 'react';
import Book from './Book';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Form from './Form';
import Grid from '@mui/material/Grid';

export default function Books(props) {
  
  const [books, setBooks] = useState([])
  const [editedBook, setEditedBook] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get', {
      'method' : 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(resp => resp.json())
    .then(resp => setBooks(resp))
    .catch(error => console.log(error))
  },[])

  const editBook = (book) => {
    setEditedBook(book)
  }

  const updatedBooks = (book) => {
    const updated_book = books.map (my_book  => {
      if(my_book.id === book.id){
        return book
      }
      else{
        return my_book
      }
    })
    setBooks(updated_book)
  }

  const addedBooks = (book) => {
    const new_book = [...books, book]
    setBooks(new_book)
  }

  const openForm = () => {
    setEditedBook({title:'', author:'', publisher:'', description:''})
  }

  const deletedBook = (id) => {
    const other_books = books.filter(mybook => {
      if(mybook.id === id){
        return false
      }
      else{
        return true
      }
    })
    setBooks(other_books)
  }
 
  return (
    <>
      <main> 
        <Container maxWidth="lg">
          <Grid container spacing={4}>
          <Book books={books} editBook={editBook} deletedBook={deletedBook}/>
          {editedBook ? <Form book={editedBook} updatedBooks={updatedBooks} addedBooks={addedBooks}/>:null}       
          <Grid item xs={4}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia>
                <img src={'../img/addbook.jpg'} width={165} height={264}/>
              </CardMedia>
              <CardActions><Button size="small" onClick={openForm}>Add Book</Button></CardActions>                                 
            </Card>
          </Grid>        
          </Grid>
        </Container>
      </main>     
    </>
  );
}