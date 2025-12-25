'use client'
 import { Wrap, WrapItem, Center, Box, Heading, Flex, Text, Stack, Badge } from '@chakra-ui/react'
 import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
 import { Image } from '@chakra-ui/react'



const Login = () => {
  return (
    <Flex direction='row-reverse' mt='2rem' mr='4rem' alignItems="center">
      <Box ml='3'>
        <Text color='white' fontWeight='bold'>
          Stéphane Aboukrat
        </Text>
        <Text color='white' fontSize='sm'>Déconnexion</Text>
      </Box>
      <Avatar name='Stéphane Aboukrat' src='' bg='pink.600' />
    </Flex>
  )
}

export default Login