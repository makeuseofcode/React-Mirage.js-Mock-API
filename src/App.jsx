import React from 'react';
import './App.css';
import { Box, Container } from '@chakra-ui/react';


import TodoList from './components/TodoList';

export default function App() {
  return (
      <Box p={4}>
        <Container maxW="xl" centerContent>
          <TodoList />
        </Container>
      </Box>
  
  );
}






