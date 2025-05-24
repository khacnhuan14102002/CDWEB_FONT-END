import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate
import '../style/Login.css';

const Login = () => {
    const [currentState, setCurrentState] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate(); // ✅ khởi tạo useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentState === 'Login') {
            try {
                const response = await fetch("http://localhost:8080/api/khachhang/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        matKhau: password
                    })
                });

                if (response.ok) {
                    const user = await response.json();
                    localStorage.setItem("user", JSON.stringify(user)); // ✅ lưu vào localStorage
                    navigate("/");
                    window.location.reload();
                // ✅ chuyển trang sau khi đăng nhập thành công
                } else {
                    const msg = await response.text();
                    setError(msg);
                }
            } catch (err) {
                console.error("Login error:", err);
                setError("Đã xảy ra lỗi máy chủ.");
            }
        }
    };

    return (
        <form className='login-form' onSubmit={handleSubmit}>
            <div className='form-header'>
                <p className='form-title'>{currentState}</p>
                <hr className='form-title-divider' />
            </div>

            {currentState === 'Login' ? null : (
                <input type="text" className='form-input' placeholder='Name' required />
            )}

            <input
                type="email"
                className='form-input'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                className='form-input'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            <div className='form-links'>
                <p className='forgot-password-link'>Forgot your password?</p>
                {
                    currentState === 'Login'
                        ? <p onClick={() => setCurrentState('Sign Up')} className='create-account-link'>Create Account</p>
                        : <p onClick={() => setCurrentState('Login')} className='login-here-link'>Login Here</p>
                }
            </div>

            <button type="submit" className='submit-button'>{currentState}</button>
        </form>
    );
};

export default Login;
