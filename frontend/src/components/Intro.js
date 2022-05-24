import React from 'react'
import Container from '@mui/material/Container';

export default function Intro(){
  return (
  <>
    <Container component="main" maxWidth="sm">
      <h1>Book Library</h1>
      <h2>This is my Book Library App that has been created using Flask for Backend and React for Frontend.</h2>
      <h1>{' '}</h1>
    </Container>   
  </>
  )
}