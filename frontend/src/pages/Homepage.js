import React from 'react'
import {useState} from 'react';
import Container from '@mui/material/Container';
import Books from '../components/Books';
import Intro from '../components/Intro';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Search from '../components/Search';

export default function HomePage(props){

  const [searchedbooks, setSearchedbooks] = useState(null)

  const searchedBook = (books) => {
    setSearchedbooks(books)
  }

  return(   
    <div>
      <Navbar searchedBook={searchedBook}/>
      {searchedbooks ? (
        <>
        <Container component="main" maxWidth="sm">
        <h1>Search Results</h1>
        <h1>{' '}</h1>
        </Container>   
        <Search books={searchedbooks}/>
        </>
      ) : (
      <>
      <Intro/>
      <Books/>
      </>
      )}
      <Footer/>
    </div>
  );
}
