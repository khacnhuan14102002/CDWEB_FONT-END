import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../style/Login.css';

const Login = () => {
    const [mode, setMode] = useState('Login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        name: '',
    });
    const [errors, setErrors] = useState({});
    const { t } = useTranslation();

    useEffect(() => {
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            name: '',
        });
        setErrors({});
    }, [mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            if ((name === 'confirmPassword' || name === 'password') && mode === 'Sign Up') {
                if (updated.confirmPassword && updated.password !== updated.confirmPassword) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        confirmPassword: t('login.password_mismatch'),
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' }));
                }
            }

            return updated;
        });
    };

    const validate = () => {
        const newErrors = {};
        const { email, password, confirmPassword, phone, name } = formData;

        if (!email) newErrors.email = t('login.email_required');
        if (!password) newErrors.password = t('login.password_required');

        if (mode === 'Sign Up') {
            if (!name) newErrors.name = t('login.name_required');
            if (!phone) newErrors.phone = t('login.phone_required');
            if (!confirmPassword) {
                newErrors.confirmPassword = t('login.confirm_password_required');
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = t('login.password_mismatch');
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const { email, password, name, phone } = formData;

            if (mode === 'Login') {
                const res = await fetch('http://localhost:8080/api/khachhang/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': navigator.language || 'vi',
                    },
                    body: JSON.stringify({ email, matKhau: password }),
                });

                if (res.ok) {
                    const user = await res.json();
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = '/'; // Chuyển hướng sang trang chính
                } else {
                    const msg = await res.text();
                    setErrors({ general: msg || t('login.failed_login') });
                }
            } else {
                const res = await fetch('http://localhost:8080/api/khachhang/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': navigator.language || 'vi',
                    },
                    body: JSON.stringify({
                        email,
                        matKhau: password,
                        soDienThoai: phone,
                        hoTen: name,
                    }),
                });

                const msg = await res.text();
                if (res.ok) {
                    alert(t('login.success_register'));
                    window.location.href = '/'; // Chuyển hướng sang trang chính sau đăng ký
                } else {
                    setErrors({ email: msg });
                }
            }
        } catch (error) {
            console.error('Server error:', error);
            setErrors({ general: t('login.server_error') });
        }
    };

    const handleEmailBlur = async () => {
        const { email } = formData;
        if (email && mode === 'Sign Up') {
            try {
                const res = await fetch('http://localhost:8080/api/khachhang/check-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': navigator.language || 'vi',
                    },
                    body: JSON.stringify({ email }),
                });

                if (!res.ok) {
                    const errorKey = await res.text();
                    setErrors((prev) => ({ ...prev, email: t(errorKey) }));
                } else {
                    setErrors((prev) => ({ ...prev, email: '' }));
                }
            } catch {
                setErrors((prev) => ({ ...prev, email: t('login.email_check_error') }));
            }
        }
    };

    return (
        <form className='login-form' onSubmit={handleSubmit}>
            <div className='form-header'>
                <p className='form-title'>
                    {mode === 'Login' ? t('login.title_login') : t('login.title_signup')}
                </p>
                <hr className='form-title-divider' />
            </div>

            {mode === 'Sign Up' && (
                <>
                    <input
                        type='text'
                        name='name'
                        className='form-input'
                        placeholder={t('login.name')}
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className='error-text'>{errors.name}</p>}
                </>
            )}

            <input
                type='email'
                name='email'
                className='form-input'
                placeholder={t('login.email')}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
            />
            {errors.email && <p className='error-text'>{errors.email}</p>}

            {mode === 'Sign Up' && (
                <>
                    <input
                        type='tel'
                        name='phone'
                        className='form-input'
                        placeholder={t('login.phone')}
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && <p className='error-text'>{errors.phone}</p>}
                </>
            )}

            <input
                type='password'
                name='password'
                className='form-input'
                placeholder={t('login.password')}
                value={formData.password}
                onChange={handleChange}
            />
            {errors.password && <p className='error-text'>{errors.password}</p>}

            {mode === 'Sign Up' && (
                <>
                    <input
                        type='password'
                        name='confirmPassword'
                        className='form-input'
                        placeholder={t('login.confirmPassword')}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => {
                            if (
                                formData.confirmPassword &&
                                formData.password !== formData.confirmPassword
                            ) {
                                setErrors((prev) => ({
                                    ...prev,
                                    confirmPassword: t('login.password_mismatch'),
                                }));
                            } else {
                                setErrors((prev) => ({
                                    ...prev,
                                    confirmPassword: '',
                                }));
                            }
                        }}
                    />
                    {errors.confirmPassword && (
                        <p className='error-text'>{errors.confirmPassword}</p>
                    )}
                </>
            )}

            {errors.general && <p className='error-text'>{errors.general}</p>}

            <div className='form-links'>
                <p className='forgot-password-link'>{t('login.forgot_password')}</p>
                {mode === 'Login' ? (
                    <p className='create-account-link' onClick={() => setMode('Sign Up')}>
                        {t('login.create_account')}
                    </p>
                ) : (
                    <p className='login-here-link' onClick={() => setMode('Login')}>
                        {t('login.login_here')}
                    </p>
                )}
            </div>

            <button type='submit' className='submit-button'>
                {mode === 'Login' ? t('login.title_login') : t('login.title_signup')}
            </button>
        </form>
    );
};

export default Login;