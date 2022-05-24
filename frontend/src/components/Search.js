import React from 'react'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

export default function Search(props){

  return(
    <main>     
      <Container maxWidth="lg">
        <Grid container spacing={4}>
        {props.books && props.books.map(book => {
          return(
          <>
            <Grid item xs={12}>
              <CardActionArea component="a" href="#">
                <Card sx={{ display: 'flex' }}>
                  <CardContent sx={{ flex: 1 }}>
                  <CardContent>{book.title}</CardContent>
                  <CardContent>{book.author}</CardContent>
                  <CardContent>{book.year}</CardContent>
                  <CardContent>{book.genre}</CardContent>
                  </CardContent>
                  <CardMedia>
                    <img src={`../img/${book.title}.jpg`} width={165} height={264}/>
                  </CardMedia>
                </Card>
              </CardActionArea>
            </Grid>
          </>
          )
        })}     
        </Grid>
      </Container>
    </main>
  );
}