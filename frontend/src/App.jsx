
import Home from './pages/Home'
import Profile from './pages/Profile'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'



function App() {
 
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path= '/profile' element={<Profile/>}/>
        <Route path= '/about' element={<About/>}/>
        {/* search bar should only be seen once the user is authenticated */}
        <Route path= '/signin' element={<Signin/>}/>
        <Route path= '/signup' element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
