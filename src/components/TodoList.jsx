// TodoList.js
import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Container,
  Text,
  Input,
  FormControl,
  Flex,
} from '@chakra-ui/react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);
 
  useEffect(() => {
    fetch('/api/todos') 
      .then((response) => response.json())
      .then((data) => {
        setTodos(data.todos);
        setLoading(false);
      });
  }, [renderKey]);

  
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo((prevTodo) => ({ ...prevTodo, [name]: value }));
  };

  const handleAddTodo = () => {
    
    setLoading(true);
  
    fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((createdTodo) => {
        // Prepend the new todo to the todos array
        setTodos((prevTodos) => [createdTodo, ...prevTodos]);
        setNewTodo({ title: '', body: '' });
        setRenderKey((prevKey) => prevKey + 1); // Increment renderKey to force a re-render
        setLoading(false); 
      })
      .catch((error) => {
        console.error('Error adding todo:', error);
        setLoading(false); 
      });
  };
  
  const handleDelete = (id) => {
    
    let deleteInProgress = true;
  
    fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 204) {
          return null;
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data && data.error) {
          console.error('Error deleting todo:', data.error);
        } else {
          
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
          setRenderKey((prevKey) => prevKey + 1);
        }
        deleteInProgress = false;
      })
      .catch((error) => {
        console.error('Error deleting todo:', error);
        deleteInProgress = false;
      })
      .finally(() => {
        setLoading(deleteInProgress);
      });
  };
  

  return (
    <Container>
      <Text fontSize="xl" mb={4}>
        Todo List
      </Text>
      <FormControl mb={4}>
       
        <Input
          type="text"
          name="body"
          value={newTodo.body}
          onChange={handleInputChange}
        />
      </FormControl>
      
      <Button colorScheme="teal" onClick={handleAddTodo}>
        Add Todo
      </Button>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        todos.map((todo) => (
          <Box key={todo.id} mb={2} p={2} borderWidth="1px">
            <Flex align="center">
            
              <Text flex="1">{todo.body}</Text>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </Button>
            </Flex>
          </Box>
        ))
      )}
    </Container>
  );
}


