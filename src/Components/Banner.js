import { Container, Typography } from '@mui/material'
import React from 'react'
import Carousel from './Carousel'

const Banner = () => {
  return (
    <div class="banner">
      <Container class="bannerContext">
        <div class="tagline">
          <Typography variant='h2' style={{
            fontWeight: "bold",
            marginBottom: 15,
            fontFamily: "Montserrat",
          }}>Skrypto Hub
          </Typography>
          <Typography variant='subtitle2' style={{
            color: 'darkgray',
            textTransform: 'capitalize',
            fontFamily : "Montserrat",
          }}>All the information you need regarding your Crypto
          </Typography>
        </div>
        <Carousel />
      </Container>
    </div>
  )
}

export default Banner