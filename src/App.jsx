
import Nav from './Navigation/Navbar'
import Home from './Sections/Home'

import Experience from './Sections/Experience'
import Service from './Sections/Service'
import Contact from './Sections/Contact'

const App = () => {
  return (
    <div>
      <Nav/>
      <Home/>
      <Service/>
      <Contact/>
    
      <Experience/>
    </div>
  )
}

export default App