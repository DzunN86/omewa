import {
  Alert,
  AlertIcon,
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const LoginView = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const [error, setError] = React.useState<string | null>(null);

  const [state, setState] = React.useState<'loading' | 'success' | 'error' | 'idle'>(
    'idle'
  );

  const handleShowClick = () => setShowPassword(!showPassword);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState('loading');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setState('success');
        navigate('/');
      } else {
        setError(data.message);
        setState('error');
      }
      
    } catch (err: any) {
      setState('error');
      setError(err.message);
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Box minW={{ base: '70%', md: '3xs' }}>
        {state === 'error' && (
          <Alert status="error" mb="6">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <form onSubmit={onLogin}>
          <Stack
            spacing={4}
            p="1rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
            rounded="md"
          >
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input
                  type="tex"
                  placeholder="Username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  children={<CFaLock color="gray.300" />}
                />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              type="submit"
              variant="solid"
              colorScheme="blue"
              width="full"
              isLoading={state === 'loading'}
            >
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginView;
