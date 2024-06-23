import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Show, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import {useHistory} from 'react-router-dom'

const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show);

    const postDeatils = (pic) => {
        setLoading(true);
        if(pic === undefined){
            toast({
                title: 'Please select and Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position : 'bottom'
            })
            return;
        }
        
        if(pic.type == 'image/jpeg' || pic.type == 'image/png'){
            const data = new FormData;
            data.append("file", pic)
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", 'da6opsaxn');
            fetch("https://api.cloudinary.com/v1_1/da6opsaxn/upload", {
                method : "post",
                body : data
            })
            .then((res) => res.json())
            .then(data => {
                setPic(data.url.toString())
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            }); 
        }else{
            toast({
                title: 'Please select and Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position : 'bottom'
            })
            setLoading(false);
            return;
        }
        
    }

    const submithandler = async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
            toast({
                title: 'Please fill all Fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position : 'bottom'
            })
            setLoading(false);
            return;
        }

        if(password !== confirmpassword){
            toast({
                title: 'Password Do Not Match!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position : 'bottom'
            })
            setLoading(false);
            return;
        }

        try{
            const config = {
                headers : {
                    "Content-type" : "application/json"
                }
            }
            
            const {data} = await axios.post("/api/user/signup", {name, email, password, pic}, config);
            
            toast({
                title: 'Registration Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position : 'bottom'
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push('/chats');
        }catch(error){
            toast({
                title: 'Error Occured',
                description : error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position : 'bottom'
            });
            setLoading(false);
        }
    }


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
        isLoading = {loading}
        >
            Sign Up
        </Button>
  </VStack>
}

export default Signup
