import { SunIcon } from '@chakra-ui/icons';
import { Box, Button, Checkbox, Container, Flex, Grid, GridItem, Heading, Image, Input, Select, Text, useOutsideClick } from '@chakra-ui/react';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import CustomRadio from '../Components/CustomRadio';
import Dropdown, { DropdownLabel } from '../Components/Dropdown';
import Steps, { Step } from '../Components/Steps';
import { createEstimate } from '../lib/db';



var axios = require("axios").default;


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const HouseType = ({ imageUrl, label, isActive, handleClick }) => {

    const defaultStyle = {
        borderRadius: '8px',
        padding: ' 20px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid currentColor',
        color: '#E5E5E5',
        textAlign: 'center',
        flex: 1

    };
    const activeStyle = {
        border: '1px solid currentColor',
        color: '#212529'
    };

    return (
        <Box onClick={handleClick} cursor={'pointer'} mr={2} sx={{ ...defaultStyle, ...(isActive && activeStyle) }}>
            <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path style={{
                    fill: 'currentcolor'
                }} d="M21.8332 19.75H0.166504V17.5833H1.24984V1.33333C1.24984 1.04602 1.36397 0.770465 1.56714 0.567301C1.7703 0.364137 2.04585 0.25 2.33317 0.25H17.4998C17.7872 0.25 18.0627 0.364137 18.2659 0.567301C18.469 0.770465 18.5832 1.04602 18.5832 1.33333V6.75H20.7498V17.5833H21.8332V19.75ZM16.4165 17.5833H18.5832V8.91667H12.0832V17.5833H14.2498V11.0833H16.4165V17.5833ZM16.4165 6.75V2.41667H3.4165V17.5833H9.9165V6.75H16.4165ZM5.58317 8.91667H7.74984V11.0833H5.58317V8.91667ZM5.58317 13.25H7.74984V15.4167H5.58317V13.25ZM5.58317 4.58333H7.74984V6.75H5.58317V4.58333Z" fill="#212529" />
            </svg>

            <Text mt={3} lineHeight="21px" fontSize={'14px'}>{label}</Text>
        </Box>
    )
}

const locationObject = {
    'Resort': 5,
    'Lake front': 10,
    'Ocean view': 2,
    'Ocean front': 5,
    'River front': 10,
    'Sky in/out': 5,
}

const Home = () => {
    const [homeType, setHomeType] = useState('Town Home')
    const [step, setStep] = useState(0);
    const [value, setValue] = useState<any>({});
    const [value1, setValue1] = useState<any>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<any>('');
    const [totalPercent, setTotalPercent] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState();
    const [isEstimatedSent, setIsEstimatedSent] = useState(false);

    const { lat, lng, code } = value;

    const [propertyStatState, setPropertyStatState] = useState({
        bedrooms: 2,
        bathrooms: 2,
        hasPool: false,
        isCondo: true,
        location: '',
        coordination: {
            lat: '',
            long: ''
        }
    });

    const [propertyExtraFeatures, setPropertiesExtraFeatures] = useState({
        amenities: {
            'Air conditioning': false,
            'gym': false,
            'Hot Tub': false,
            'Pet friendly': false,
            'Swimming pool': false,
        },
        location: {
            'resort': false,
            'lake front': false,
            'ocean view': false,
            'ocean front': false,
            'river front': false,
            'Sky in/out': false,
        }
    })

    const [userCredentials, setUserCredentials] = useState({
        firstName: '',
        lastName: '',
        email: '',
        number: '',
    });


    const { firstName, lastName, email, number } = userCredentials;

    const [propertyEstimate, setPropertyEstimate] = useState<any>({})

    const { bedrooms, bathrooms, hasPool, isCondo } = propertyStatState;

    const setState = (name, val) => {
        setPropertyStatState({
            ...propertyStatState,
            [name]: val
        })
    }

    const arr = [1, 2, 3];

    const updateData = () => {
        setIsCalculating(true);

        console.log({ lat, lng, code, })
        var options = {
            method: 'GET',
            url: 'https://airbnb-income-prediction.p.rapidapi.com/getIncomeHistory',
            params: {
                coordinate: `(${lat},${lng})`,
                countryCode: 'US', // Code
                bedrooms,
                bathrooms,
                hasPool,
                isCondo,
            },
            headers: {
                'x-rapidapi-host': 'airbnb-income-prediction.p.rapidapi.com',
                'x-rapidapi-key': '2296d55f65mshf88a20cd74a3c69p17aa1ejsnae76cc48da6b'
            }
        };

        axios.request(options).then(function (response) {
            if (response.data.message.error_reason) {
                setError(response.data.message.error_reason)
            } else {

                setPropertyEstimate({ ...response.data.message });
                setError('')
            }
            setIsCalculating(false)
        }).catch(function (error) {
            console.log(error)
            setError(error)
        });
    }

    /*     useEffect(() => {
    
            if (!Object.keys(value).length) return;
    
            updateData();
        }, [value, propertyStatState]);
     */
    const updateAmenitiesLocation = (type, field, value) => {
        console.log(value)

        if (type === 'location') {
            setPropertiesExtraFeatures({
                ...propertyExtraFeatures,
                [type]: {

                    'resort': false,
                    'lake front': false,
                    'ocean view': false,
                    'ocean front': false,
                    'river front': false,
                    'Sky in/out': false,

                    [field]: value
                }
            })

            if (value) {
                const getLastLocation = Object.keys(propertyExtraFeatures.location).filter((el) => propertyExtraFeatures.location[el] === value);

                if (getLastLocation.length) {
                    setTotalPercent((totalPercent - locationObject[getLastLocation[0]]) + locationObject[field])
                } else {
                    setTotalPercent(totalPercent + locationObject[field])
                }

            } else {
                setTotalPercent(totalPercent - locationObject[field])

            }

            return
        }

        setPropertiesExtraFeatures({
            ...propertyExtraFeatures,
            [type]: {
                ...propertyExtraFeatures[type],
                [field]: value
            }
        })

    }

    const updateUserCredentials = (name, value) => {
        setUserCredentials({
            ...userCredentials,
            [name]: value
        })

    }


    const labelStyle = {
        fontSize: '16px',
        fontWeight: 500,
        color: '#212529',
        marginBottom: '10px'
    }


    const inputStyle = {
        background: '#F6F8FF',
        borderRadius: '10px',
        border: 'none',
        marginBottom: '24px',
        fontWeight: 500,
        color: '#1F466A !important'

    }


    const getIncreasedAmount = (lowAmount: number, highAmount: number) => {

        let lowNumberWithPercentage = lowAmount;
        let highNumberWithPercentage = highAmount;


        if (totalPercent > 0) {
            lowNumberWithPercentage = lowAmount + ((totalPercent * lowAmount) / 100);
            highNumberWithPercentage = highAmount + ((totalPercent * highAmount) / 100)
        }



        return `${numberWithCommas(lowNumberWithPercentage)}  - ${numberWithCommas(highNumberWithPercentage)}`


    }

    const updateAmenities = (val: number) => {
        setTotalPercent(totalPercent + val)
    };


    useEffect(() => {

        if (isEstimatedSent) {

            setTimeout(() => {

                setStep(step + 1);
                updateData();
            }, 1500)
        }

    }, [isEstimatedSent])
    return (

        <Flex height={'100vh'} alignItems={'center'} justifyContent={'center'}>

            <Box className='main-container' boxShadow={' 0px 0px 50px rgba(198, 217, 225, 0.3)'} px={"64px"} py={'20px'} borderRadius={'24px'} height={'645px'} width={'80vw'} maxW={'1100px'}>
                <Grid className='main-grid' height={'100%'} gridTemplateColumns={'1fr minmax(330px, 1fr)'}>
                    <GridItem className='grid-main-1' display={'flex'} alignItems={'center'}>
                        <Text className='main-text' fontSize={'55px'} fontWeight={'bold'}> {
                            step === 2 ? 'Here’s what you could earn!' : (
                                <>
                                    Let’s find out how much you  can <br /> make off of  Airbnb
                                </>
                            )
                        }
                        </Text>
                    </GridItem>
                    <GridItem className='grid-main-2' display={'flex'} alignItems={'center'} >

                        <Steps value={step}>
                            <Step>
                                <Box>
                                    <Text mb={'10px'} fontSize={'16px'} fontWeight={'500'}>Address</Text>
                                    <GooglePlacesAutocomplete

                                        apiKey='AIzaSyCTML2-mH6P3dxY1POJ5h-maV6tLCaE7Vw'
                                        selectProps={{
                                            styles: {

                                                control: (provided) => ({
                                                    ...provided,
                                                    border: 'none',
                                                    background: '#F6F8FF !important',
                                                    borderRadius: '8px',
                                                    paddingLeft: '8px',
                                                    paddingRight: '8px',
                                                    fontWeight: '500',
                                                    color: '#1F466A',
                                                    fontSize: '16px',
                                                    paddingTop: '4px',
                                                    paddingBottom: '4px',
                                                }),
                                                singleValue: (provided) => ({
                                                    ...provided,
                                                    color: '#1F466A'
                                                })



                                            },
                                            value1,
                                            onChange: (val) => {
                                                geocodeByPlaceId(val.value.place_id)
                                                    .then(res => {
                                                        const place = res[0];
                                                        const code = place.address_components[place.address_components.length - 1].short_name;

                                                        const lat = place.geometry.location.lat();
                                                        const lng = place.geometry.location.lng();

                                                        setValue({ code, lat, lng })
                                                        setValue1(val)
                                                    })
                                            },
                                        }}

                                    />

                                </Box>

                                <Grid gridTemplateColumns={'1fr 1fr'}>
                                    <GridItem >
                                        <Dropdown onSelect={(val) => {
                                            setPropertyStatState({
                                                ...propertyStatState,
                                                bedrooms: parseInt(val)
                                            })
                                        }} value={`${bedrooms} bed`} label={'0 baths'}>
                                            <DropdownLabel label={'bed'}>1</DropdownLabel>
                                            <DropdownLabel label={'beds'}>2</DropdownLabel>
                                            <DropdownLabel label={'beds'}>3</DropdownLabel>
                                            <DropdownLabel label={'beds'}>4</DropdownLabel>
                                            <DropdownLabel label={'beds'}>5</DropdownLabel>
                                        </Dropdown>
                                    </GridItem>
                                    <GridItem marginLeft={'10px'}>
                                        <Dropdown onSelect={(val) => {
                                            setPropertyStatState({
                                                ...propertyStatState,
                                                bathrooms: parseInt(val)
                                            })
                                        }} value={`${bathrooms} baths`} label={'0 baths'}>
                                            <DropdownLabel label={'bath'}>1</DropdownLabel>
                                            <DropdownLabel label={'baths'} >2</DropdownLabel>
                                            <DropdownLabel label={'baths'}>3</DropdownLabel>
                                            <DropdownLabel label={'baths'}>4</DropdownLabel>
                                            <DropdownLabel label={'baths'}>5</DropdownLabel>
                                        </Dropdown>
                                    </GridItem>
                                </Grid>

                                <Flex>
                                    <HouseType
                                        isActive={homeType === 'Town Home'}
                                        handleClick={() => setHomeType('Town Home')}
                                        label={'Town home'}
                                        imageUrl=''

                                    />
                                    <HouseType
                                        isActive={homeType === 'Private Town'}
                                        handleClick={() => setHomeType('Private Town')}
                                        label={'Private Town'}
                                        imageUrl=''

                                    />
                                    <HouseType
                                        isActive={homeType === 'Condo'}
                                        handleClick={() => setHomeType('Condo')}
                                        label={'Condo'}
                                        imageUrl=''

                                    />
                                </Flex>
                                <Box>
                                    <Dropdown value={'Highlights'} label={'s'}>

                                        <Box>
                                            <Grid gridTemplateColumns={'1fr 1fr'}>
                                                <Box>
                                                    <Text>House features</Text>
                                                    <Flex my={2}>
                                                        <CustomRadio isSelected={propertyExtraFeatures.amenities['Air conditioning']} setIsSelected={() => {
                                                            updateAmenitiesLocation('amenities', 'Air conditioning', !propertyExtraFeatures.amenities['Air conditioning'])
                                                            if (!propertyExtraFeatures.amenities['Air conditioning']) {

                                                                updateAmenities(5)
                                                            } else {
                                                                updateAmenities(-5)

                                                            }
                                                        }} />
                                                        <Text ml={2}>Air Conditioning</Text>
                                                    </Flex>
                                                    <Flex my={2}>
                                                        <CustomRadio isSelected={propertyExtraFeatures.amenities['Gym']} setIsSelected={() => {
                                                            updateAmenitiesLocation('amenities', 'Gym', !propertyExtraFeatures.amenities['Gym'])

                                                            if (!propertyExtraFeatures.amenities['Gym']) {

                                                                updateAmenities(5)
                                                            } else {
                                                                updateAmenities(-5)

                                                            }
                                                        }} />
                                                        <Text ml={2}>Gym</Text>
                                                    </Flex>
                                                    <Flex my={2}>
                                                        <CustomRadio isSelected={propertyExtraFeatures.amenities['Hot tub']} setIsSelected={() => {
                                                            updateAmenitiesLocation('amenities', 'Hot tub', !propertyExtraFeatures.amenities['Hot tub'])



                                                            if (!propertyExtraFeatures.amenities['Hot tub']) {

                                                                updateAmenities(5)
                                                            } else {
                                                                updateAmenities(-5)

                                                            }
                                                        }} />
                                                        <Text ml={2}>Hot Tub</Text>
                                                    </Flex>
                                                    <Flex my={2}>
                                                        <CustomRadio isSelected={propertyExtraFeatures.amenities['Pet friendly']} setIsSelected={() => {
                                                            updateAmenitiesLocation('amenities', 'Pet friendly', !propertyExtraFeatures.amenities['Pet friendly'])
                                                            if (!propertyExtraFeatures.amenities['Pet friendly']) {

                                                                updateAmenities(5)
                                                            } else {
                                                                updateAmenities(-5)

                                                            }

                                                        }} />
                                                        <Text ml={2}>Pet friendly</Text>
                                                    </Flex>
                                                    <Flex my={2}>
                                                        <CustomRadio isSelected={propertyExtraFeatures.amenities['Swimming pool']} setIsSelected={() => {
                                                            updateAmenitiesLocation('amenities', 'Swimming pool', !propertyExtraFeatures.amenities['Swimming pool'])
                                                            if (!propertyExtraFeatures.amenities['Swimming pool']) {

                                                                updateAmenities(5)
                                                            } else {
                                                                updateAmenities(-5)

                                                            }

                                                        }} />
                                                        <Text ml={2}>Swimming pool</Text>
                                                    </Flex>
                                                </Box>

                                                {/* Location start */}
                                                <Box>
                                                    <Text>Location</Text>
                                                    <Flex my={2}>
                                                        <CustomRadio isSelected={propertyExtraFeatures.location['Resort']} setIsSelected={() => {
                                                            updateAmenitiesLocation('location', 'Resort', !propertyExtraFeatures.location['Resort'])
                                                        }} />
                                                        <Text ml={2}>Resort</Text>
                                                    </Flex>
                                                    <Flex my={2}>
                                                        <CustomRadio isSelected={propertyExtraFeatures.location['Lake front']} setIsSelected={() => {
                                                            updateAmenitiesLocation('location', 'Lake front', !propertyExtraFeatures.location['Lake front'])
                                                        }} />
                                                        <Text ml={2}>Lake front</Text>
                                                    </Flex>
                                                    <Flex my={2}>
                                                        <CustomRadio isSelected={propertyExtraFeatures.location['Ocean view']} setIsSelected={() => {
                                                            updateAmenitiesLocation('location', 'Ocean view', !propertyExtraFeatures.location['Ocean view'])
                                                        }} />
                                                        <Text ml={2}>Ocean view</Text>
                                                    </Flex>
                                                    <Flex my={2}>
                                                        <CustomRadio isSelected={propertyExtraFeatures.location['Ocean front']} setIsSelected={() => {
                                                            updateAmenitiesLocation('location', 'Ocean front', !propertyExtraFeatures.location['Ocean front'])
                                                        }} />
                                                        <Text ml={2}>Ocean front</Text>
                                                    </Flex>
                                                    <Flex my={2}>
                                                        <CustomRadio isSelected={propertyExtraFeatures.location['River front']} setIsSelected={() => {
                                                            updateAmenitiesLocation('location', 'River front', !propertyExtraFeatures.location['River front'])
                                                        }} />
                                                        <Text ml={2}>River front</Text>
                                                    </Flex>
                                                    <Flex my={2}>
                                                        <CustomRadio isSelected={propertyExtraFeatures.location['Sky in/out']} setIsSelected={() => {
                                                            updateAmenitiesLocation('location', 'Sky in/out', !propertyExtraFeatures.location['Sky in/out'])
                                                        }} />
                                                        <Text ml={2}>Sky in/out</Text>
                                                    </Flex>
                                                </Box>
                                            </Grid>
                                        </Box>
                                    </Dropdown>
                                </Box>
                                <Flex mt={'10px'} alignItems={'center'} justifyContent={'flex-end'}>
                                    <Button disabled={Object.keys(value).length > 0 ? false : true} bg={'#15CBCB'} color={'white'} borderRadius={'12px'} px={5} onClick={() => setStep(step + 1)}>
                                        Next
                                    </Button>
                                </Flex>
                            </Step>
                            <Step>

                                <Grid gridTemplateColumns={'1fr 1fr'}>
                                    <GridItem mr={5}>
                                        <Box>
                                            <Text sx={labelStyle}>First Name</Text>
                                            <Input color={'#1F466A '} value={firstName} onChange={(e) => updateUserCredentials('firstName', e.currentTarget.value)} sx={inputStyle} />
                                        </Box>
                                    </GridItem>
                                    <GridItem>
                                        <Box>
                                            <Text sx={labelStyle}>Last Name</Text>
                                            <Input value={lastName} onChange={(e) => updateUserCredentials('lastName', e.currentTarget.value)} sx={inputStyle} />
                                        </Box>
                                    </GridItem>
                                </Grid>
                                <Box>
                                    <Text sx={labelStyle}>Email</Text>
                                    <Input value={email} onChange={(e) => updateUserCredentials('email', e.currentTarget.value)} sx={inputStyle} />
                                </Box>
                                <Box>
                                    <Text sx={labelStyle}>Phone Number</Text>
                                    <Box sx={inputStyle}>
                                        <PhoneInput
                                            defaultCountry='US'
                                            international
                                            placeholder="Enter phone number"
                                            value={phoneNumber}
                                            // @ts-ignore
                                            onChange={setPhoneNumber} />

                                    </Box>

                                    {/*     <Input value={number} onChange={(e) => updateUserCredentials('number', e.currentTarget.value)} sx={inputStyle} /> */}
                                </Box>
                                <Flex mt={'10px'} alignItems={'center'} justifyContent={'flex-end'}>
                                    <Button isLoading={isEstimatedSent} fontSize={'15px'} padding={'24px 20px'} bg={'#15CBCB'} color={'white'} borderRadius={'12px'} onClick={() => {
                                        createEstimate({ ...userCredentials, number: phoneNumber }, (val) => setIsEstimatedSent(val))
                                    }}>
                                        Estimate
                                    </Button>
                                </Flex>                            </Step>
                            <Step>

                                <Box fontWeight={'500'} color={'#1F466A'} textAlign={'center'} py={2} px={7} backgroundColor={'#F6F8FF'} borderRadius={'8px'}>
                                    Estimated annual income range
                                </Box>

                                {/*      {
                                    error !== '' && (<Text>{JSON.stringify(error)}</Text>)
                                } */}
                                {
                                    isCalculating && <Text mt={2} textAlign={'center'}>Calculating...</Text>
                                }

                                {
                                    error === '' && Object.keys(propertyEstimate).length ? (
                                        <Box textAlign={'center'}>
                                            <Text fontSize={'46px'} fontWeight={'bold'} color={'#2EC5C5'}> <Text mt={4} display={'inline-block'} color={'black'}>$</Text>{getIncreasedAmount(propertyEstimate.average.revenue * 12, propertyEstimate.percentile75.revenue * 12)}  </Text>

                                            <Flex alignItems={'center'} justifyContent={'center'}>
                                                <svg width="13" height="19" viewBox="0 0 13 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.5 0.75C3.11375 0.75 0.375 3.48875 0.375 6.875C0.375 11.4688 6.5 18.25 6.5 18.25C6.5 18.25 12.625 11.4688 12.625 6.875C12.625 3.48875 9.88625 0.75 6.5 0.75ZM6.5 9.0625C5.2925 9.0625 4.3125 8.0825 4.3125 6.875C4.3125 5.6675 5.2925 4.6875 6.5 4.6875C7.7075 4.6875 8.6875 5.6675 8.6875 6.875C8.6875 8.0825 7.7075 9.0625 6.5 9.0625Z" fill="#6B6B6B" />
                                                </svg>
                                                <Text mt={1} color={'#6B6B6B'} fontSize={'14px'} fontWeight='500' textAlign={'center'} ml={3}> {value1.label} </Text>
                                            </Flex>
                                            <Text mb={6} mt={10} fontSize={'18px'} fontWeight={'bold'}>Schedule to unlock monthly breakdown</Text>
                                            <Flex display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                                <Button borderRadius={'8px'} w={'130px'} fontSize={'14px'} fontWeight={'600'} bg={'#15CBCB'} color={'white'} px={5} >Unlock</Button>
                                            </Flex>
                                        </Box>
                                    ) : ''
                                }





                            </Step>
                        </Steps>

                    </GridItem>
                </Grid>


            </Box>

        </Flex>
    )
}

export default Home;