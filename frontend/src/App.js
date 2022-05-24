import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Homepage from './pages/Homepage';
import Wishlists from './components/Wishlists';
import SignIn from './components/SignIn';
import Register from './components/Register';

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/wishlist" element={<Wishlists/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/signin" element={<SignIn/>}/>
      </Routes>
    </Router>
  );
}

export default App;
