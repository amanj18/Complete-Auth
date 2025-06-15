import React from 'react'
import '../styles/Home.css' 
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import FloatAnimation from '../components/FloatAnimation'

const Home = () => {
  return (
    <>
        <FloatAnimation />
        <Navbar />
        <Header />
    </>
  )
}

export default Home
