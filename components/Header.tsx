'use client'
import { Box } from '@chakra-ui/react'

const Header = () => {
  return (
    <Box 
      w={["50%", null, "30%"]}  // mobile → tablette → desktop
      h="100vh" 
    />
  )
}

export default Header
