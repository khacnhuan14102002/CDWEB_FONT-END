import React from 'react';
import './index.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Collection from "./pages/Collection.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import Navbar from "./components/Navbar.jsx";
import Orders from "./pages/Orders.jsx";
import Footer from "./components/Footer.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Admin from "./pages/Admin.jsx";
import Profile from "./pages/Profile.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppLayout({ children }) {
    return (
        <>
            <Navbar />
            <SearchBar />
            {children}
            <Footer />
        </>
    );
}

function App() {
    return (
        <div className='app-container'>
            <ToastContainer />

            <Routes>
                {/* Các route có bố cục chung */}
                <Route path='/' element={<AppLayout><Home /></AppLayout>} />
                <Route path='/collection' element={<AppLayout><Collection /></AppLayout>} />
                <Route path="/collection/:categoryId" element={<Collection />} />
                <Route path='/about' element={<AppLayout><About /></AppLayout>} />
                <Route path='/contact' element={<AppLayout><Contact /></AppLayout>} />
                <Route path='/product/:productId' element={<AppLayout><Product /></AppLayout>} />
                <Route path='/cart' element={<AppLayout><Cart /></AppLayout>} />
                <Route path='/login' element={<AppLayout><Login /></AppLayout>} />
                <Route path='/place-order' element={<AppLayout><PlaceOrder /></AppLayout>} />
                <Route path='/orders' element={<AppLayout><Orders /></AppLayout>} />
                <Route path='/profile' element={<AppLayout><Profile /></AppLayout>} />
                {/* Route riêng cho Admin */}
                <Route path='/admin' element={<Admin />} />
            </Routes>
        </div>
    );
}

export default App;
