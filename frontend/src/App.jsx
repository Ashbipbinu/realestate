import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'



function App() {
 
  return (
    <BrowserRouter>
      <Router>
        <Route path='/' element={<Home/>}/>
        <Route path= '/profile' element={<Profile/>}/>
        <Route path= '/about' element={<About/>}/>
        <Route path= '/signin' element={<Signin/>}/>
        <Route path= '/signup' element={<Signup/>}/>
      </Router>
    </BrowserRouter>
  )
}

export default App
