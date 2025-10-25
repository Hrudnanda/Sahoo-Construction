
import Nav from './Navigation/Navbar'
import Home from './Sections/Home'

import Experience from './Sections/Experience'
import Service from './Sections/Service'
import Contact from './Sections/Contact'
import Works from './Sections/Works'
import Whatsapp from './Sections/Whatsapp'

const App = () => {
  return (
    <div>
      <Nav/>
      <Home/>
      <Service/>
      <Works/>
      <Contact/>
      <Experience/>
      <Whatsapp/>
    </div>
  )
}

export default App