import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Show, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';

const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();

    const handleClick = () => setShow(!show);
    const postDeatils = (pics ) => {}
    const submithandler = () => {}

  return <VStack spacing='5px'>
    <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)} 
        ></Input>
    </FormControl>

    <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)} 
        ></Input>
    </FormControl>

    <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input type={show? "text" : "password"} placeholder="Enter Your Name"
                onChange={(e) => setPassword(e.target.value)} 
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "hide":"Show"}
                </Button>
            </InputRightElement>
        </InputGroup>
    </FormControl>

    <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
            <Input type={show? "text" : "password"} placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "hide":"Show"}
                </Button>
            </InputRightElement>
        </InputGroup>
    </FormControl>

    <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input 
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDeatils(e.target.files[0])} 
        />
    </FormControl>

    <Button 
        colorScheme="blue"
        width="100%"
        style={{marginTop :15}}
        onClick={submithandler}
        >
            Sign Up
        </Button>
  </VStack>
}

export default Signup
