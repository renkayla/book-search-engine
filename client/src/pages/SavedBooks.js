import React, { useState, useEffect } from 'react';
import { Row, Container, Col, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // create state for holding returned api data
  const [userData, setUserData] = useState({});
  // create state for holding bookId to remove
 // const [removeBookId, setRemoveBookId] = useState('');

  // create mutation for removing a book
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);


  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;
  <p>User has {userDataLength} books.</p>


  const { loading, data } = useQuery(GET_ME);

  useEffect(() => {
    // upon successful login, update user data to match saved book data
    if (data?.me) {
      setUserData(data.me);
    }
  }, [data]);

  // create function to handle removing a book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);

      // set up userData to use the new list of books
      setUserData(data.removeBook);
      //setRemoveBookId('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }
  
if (error) {
  return <p>Error occurred: {error.message}</p>;
}


  return (
    <>
      <div fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
