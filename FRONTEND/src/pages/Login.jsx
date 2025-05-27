import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';

const Login = () => {
    const [currentState, setCurrentState] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setPhone('');
        setErrors({});
    }, [currentState]);
    const handleConfirmPasswordBlur = () => {
        if (currentState === 'Sign Up') {
            if (!confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: "Xác nhận mật khẩu không được bỏ trống" }));
            } else if (password !== confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: "Mật khẩu không khớp" }));
            } else {
                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validate
        if (!email) newErrors.email = "Email không được bỏ trống";
        if (!password) newErrors.password = "Mật khẩu không được bỏ trống";
        if (currentState === 'Sign Up') {
            if (!name) newErrors.name = "Họ tên không được bỏ trống";
            if (!phone) newErrors.phone = "Số điện thoại không được bỏ trống";
            if (!confirmPassword) newErrors.confirmPassword = "Xác nhận mật khẩu không được bỏ trống";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            if (currentState === 'Login') {
                const response = await fetch("http://localhost:8080/api/khachhang/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, matKhau: password })
                });

                if (response.ok) {
                    const user = await response.json();
                    localStorage.setItem("user", JSON.stringify(user));
                    navigate("/");
                    window.location.reload();
                } else {
                    const msg = await response.text();
                    setErrors({ password: msg });
                }
            } else {
                const response = await fetch("http://localhost:8080/api/khachhang/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        matKhau: password,
                        soDienThoai: phone,
                        hoTen: name
                    })
                });

                const msg = await response.text();
                if (response.ok) {
                    alert(msg);
                    setCurrentState('Login');
                } else {
                    setErrors({ email: msg });
                }
            }
        } catch (err) {
            console.error("Lỗi:", err);
            setErrors({ general: "Đã xảy ra lỗi máy chủ." });
        }
    };

    const handleEmailBlur = async () => {
        if (email && currentState === 'Sign Up') {
            try {
                const response = await fetch("http://localhost:8080/api/khachhang/check-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });

                if (!response.ok) {
                    const msg = await response.text();
                    setErrors((prev) => ({ ...prev, email: msg }));
                } else {
                    setErrors((prev) => ({ ...prev, email: '' }));
                }
            } catch (err) {
                setErrors((prev) => ({ ...prev, email: "Lỗi kiểm tra email." }));
            }
        }
    };

    return (
        <form className='login-form' onSubmit={handleSubmit}>
            <div className='form-header'>
                <p className='form-title'>{currentState}</p>
                <hr className='form-title-divider' />
            </div>

            {currentState === 'Sign Up' && (
                <>
                    <input
                        type="text"
                        className='form-input'
                        placeholder='Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    {errors.name && <p className='error-text'>{errors.name}</p>}
                </>
            )}

            <input
                type="email"
                className='form-input'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                required
            />
            {errors.email && <p className='error-text'>{errors.email}</p>}

            {currentState === 'Sign Up' && (
                <>
                    <input
                        type="tel"
                        className='form-input'
                        placeholder='Phone'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    {errors.phone && <p className='error-text'>{errors.phone}</p>}
                </>
            )}

            <input
                type="password"
                className='form-input'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {errors.password && <p className='error-text'>{errors.password}</p>}

            {currentState === 'Sign Up' && (
                <>
                    <input
                        type="password"
                        className='form-input'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={handleConfirmPasswordBlur}
                        required
                    />
                    {errors.confirmPassword && <p className='error-text'>{errors.confirmPassword}</p>}
                </>
            )}


            {errors.general && <p className='error-text'>{errors.general}</p>}

            <div className='form-links'>
                <p className='forgot-password-link'>Forgot your password?</p>
                {
                    currentState === 'Login'
                        ? <p onClick={() => { setCurrentState('Sign Up'); setErrors({}); }} className='create-account-link'>Create Account</p>
                        : <p onClick={() => { setCurrentState('Login'); setErrors({}); }} className='login-here-link'>Login Here</p>
                }
            </div>

            <button type="submit" className='submit-button'>{currentState}</button>
        </form>
    );
};

export default Login;
