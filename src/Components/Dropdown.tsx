import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, Text, useOutsideClick } from '@chakra-ui/react';
import React, { Children, cloneElement, isValidElement, useState } from 'react'

type DropdownProps = {
    label?: string;
    value?: any;
    onSelect?: any
}
const Dropdown: React.FC<DropdownProps> = ({ children, label, value, onSelect }) => {
    const [isActive, setIsActive] = useState(false);

    const dropdownHeaderStyle = {
        border: '1px solid #EEEEEE',
        borderRadius: '12px',
    }
    const childrenWithProps = Children.map(children, child => {
        // Checking isValidElement is the safe way and avoids a typescript
        // error too.
        if (isValidElement(child)) {
            return cloneElement(child, {
                // @ts-ignore
                onselect: (val: any) => {
                    onSelect(val);
                    setIsActive(false)
                }
            });
        }
        return child;
    });

    const ref = React.useRef(null)

    useOutsideClick({
        // @ts-ignore
        ref: ref,
        handler: () => setIsActive(false),
    })



    return (
        <Box ref={ref} my={5} pos={'relative'}>
            {/* dropdown header */}
            <Flex onClick={() => setIsActive(!isActive)} cursor={'pointer'} px={4} py={3} alignItems={'center'} justifyContent={'space-between'} sx={dropdownHeaderStyle}>
                <Text fontSize={'14px'} fontWeight={'500'}>{value !== '' ? value : label}</Text>
                {
                    isActive ? <ChevronUpIcon width={'1.25em'} height={'1.25em'} /> : <ChevronDownIcon width={'1.25em'} height={'1.25em'} />
                }

            </Flex>

            {
                isActive && (

                    <Box mt={2} bg={'white'} px={4} py={3} borderRadius={'8px'} pos={'absolute'} width={'100%'} zIndex={11111} border={'1px solid #E5E5E5'}>
                        {childrenWithProps}          {

                        }</Box>
                )
            }

        </Box>
    )
}


type DropdownLabelProps = {
    onselect?: any;
    label?: any
}
export const DropdownLabel: React.FC<DropdownLabelProps> = ({ children, onselect, label }) => {

    return (
        <Box fontSize={'14px'} marginBottom={4} fontFamily='poppins' cursor={'pointer'} onClick={() => onselect(children)}>
            <Text>
                {children} {label}
            </Text>
        </Box>
    )
}


export default Dropdown;
