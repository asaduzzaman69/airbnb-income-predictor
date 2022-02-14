import { Box } from '@chakra-ui/react';
import React from 'react'

const CustomRadio = ({ isSelected, setIsSelected }) => {
    return (
        <Box height={'20px'} width={'20px'} p={'2px'} onClick={() => setIsSelected()} color={isSelected ? '#2B95F7' : '#E5E5E5'} cursor={'pointer'} display={'flex'} alignItems={'center'} justifyContent={'center'} border={'1px solid currentColor'}
            borderRadius={'4px'}>
            <Box width={'100%'} borderRadius={'2px'} height='100%' bg={'currentColor'} />
        </Box>
    )
}

export default CustomRadio;
