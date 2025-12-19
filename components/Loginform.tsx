'use client'
  import React, { useState } from 'react';
  import { Input, Button, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';
  
  const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    // Faites quelque chose avec les données du formulaire, comme une requête API pour vérifier les informations de connexion
    console.log('Username:', username);
    console.log('Password:', password);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button type="submit" mt={4} colorScheme="teal">Login</Button>
      </form>
    );
  };
  
  export default LoginForm;