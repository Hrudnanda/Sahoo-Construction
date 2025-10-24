import React from 'react'
import Nav from './Navigation/Navbar'
import Home from './Sections/Home'
import Vision from './Sections/vision'
import Experience from './Sections/Experience'

const App = () => {
  return (
    <div>
      <Nav/>
      <Home/>
      <Vision/>
      <Experience/>
    </div>
  )
}

export default App