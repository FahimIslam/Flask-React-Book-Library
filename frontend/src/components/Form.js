import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import axios from "axios";

const cards = [1];

function Form(props) {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [year, setYear] = useState('')
    const [genre, setGenre] = useState('')
    const [publisher, setPublisher] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
      setTitle(props.book.title)
      setAuthor(props.book.author)
      setYear(props.book.year)
      setGenre(props.book.genre)
      setPublisher(props.book.publisher)
      setDescription(props.book.description)
    },[props.book])

  const updateBook = (id, body) => {
    fetch(`http://127.0.0.1:5000/update/${id}/`, {
        method : 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body)
      }).then(resp => resp.json())
      .then(resp => props.updatedBooks(resp))
  }

  const addBook = () => {
      fetch(`http://127.0.0.1:5000/add`, {
          'method' : 'POST', 
          headers: {'Content-Type':'application/json'}, 
          body: JSON.stringify({title, author, year, genre, publisher, description})
      }).then(resp => resp.json())
      .then(resp => props.addedBooks(resp))
  }

  return (
    <>
      { props.book ? (
      <>        
        {cards.map((card) => (
          <Grid item key={card} xs={4}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia>
                <img src={'../img/editbook.jpg'} width={370} height={264}/>
              </CardMedia>
              <CardContent>

                <TextField fullWidth label="Enter Title" value={title}
                onChange={(e) => setTitle(e.target.value)}/>

                <TextField fullWidth label="Enter Author" value={author}
                onChange={(e) => setAuthor(e.target.value)}/>

                <TextField fullWidth label="Enter Year" value={year}
                onChange={(e) => setYear(e.target.value)}/>

                <TextField fullWidth label="Enter Genre" value={genre}
                onChange={(e) => setGenre(e.target.value)}/>

                <TextField fullWidth label="Enter Publisher" value={publisher}
                onChange={(e) => setPublisher(e.target.value)}/>
                
                <TextField fullWidth label="Enter Description" value={description}
                onChange={(e) => setDescription(e.target.value)}/>
              </CardContent>
              <CardActions>{
                props.book.id ? <Button fullWidth variant="contained"  onClick={() => updateBook(props.book.id, {title, author, year, genre, publisher, description})}>Update</Button>
                : <Button fullWidth variant="contained" onClick={addBook}>Add</Button>
              }</CardActions>
            </Card>
          </Grid>
        ))}
      </>
      ):null}
    </>
  )
}

export default Form