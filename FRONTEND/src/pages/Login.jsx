import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../style/Login.css';

const Login = () => {
    const [mode, setMode] = useState('Login'); // 'Login', 'Sign Up', 'ForgotPassword', 'ResetPassword'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        name: '',
        otp: '',
    });
    const [errors, setErrors] = useState({});
    const { t } = useTranslation();

    useEffect(() => {
        setFormData((prev) => ({
            email: prev.email, // giữ lại email khi đổi mode
            password: '',
            confirmPassword: '',
            phone: '',
            name: '',
            otp: '',
        }));
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
        const { email, password, confirmPassword, phone, name, otp } = formData;

        if (!email) newErrors.email = t('login.email_required');

        if (mode === 'Login') {
            if (!password) newErrors.password = t('login.password_required');
        } else if (mode === 'Sign Up') {
            if (!name) newErrors.name = t('login.name_required');
            if (!phone) newErrors.phone = t('login.phone_required');
            if (!password) newErrors.password = t('login.password_required');
            if (!confirmPassword) {
                newErrors.confirmPassword = t('login.confirm_password_required');
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = t('login.password_mismatch');
            }
        } else if (mode === 'ResetPassword') {
            if (!otp) newErrors.otp = t('login.otp_required');
            if (!password) newErrors.password = t('login.password_required');
            if (!confirmPassword || password !== confirmPassword) {
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
            const { email, password, name, phone, otp } = formData;

            if (mode === 'Login') {
                const res = await fetch('http://localhost:8080/api/khachhang/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, matKhau: password }),
                });

                if (res.ok) {
                    const user = await res.json();
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = '/';
                } else {
                    const msg = await res.text();
                    setErrors({ general: msg || t('login.failed_login') });
                }

            } else if (mode === 'Sign Up') {
                const res = await fetch('http://localhost:8080/api/khachhang/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                    setMode('Login');
                } else {
                    setErrors({ email: msg });
                }

            } else if (mode === 'ForgotPassword') {
                const res = await fetch('http://localhost:8080/api/khachhang/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                if (res.ok) {
                    alert(t('login.otp_sent'));
                    setMode('ResetPassword');
                } else {
                    const msg = await res.text();
                    setErrors({ email: msg || t('login.email_not_found') });
                }

            } else if (mode === 'ResetPassword') {
                const res = await fetch('http://localhost:8080/api/khachhang/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp, newPassword: password }),
                });

                if (res.ok) {
                    alert(t('login.password_reset_success'));
                    setMode('Login');
                } else {
                    const msg = await res.text();
                    setErrors({ general: msg || t('login.otp_invalid') });
                }
            }
        } catch (error) {
            console.error(error);
            setErrors({ general: t('login.server_error') });
        }
    };

    return (
        <form className='login-form' onSubmit={handleSubmit}>
            <div className='form-header'>
                <p className='form-title'>
                    {mode === 'Login'
                        ? t('login.title_login')
                        : mode === 'Sign Up'
                            ? t('login.title_signup')
                            : mode === 'ForgotPassword'
                                ? t('login.forgot_password_title')
                                : t('login.reset_password')}
                </p>
                <hr className='form-title-divider' />
            </div>

            {(mode === 'Login' || mode === 'Sign Up' || mode === 'ForgotPassword') && (
                <>
                    <input
                        type='email'
                        name='email'
                        className='form-input'
                        placeholder={t('login.email')}
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className='error-text'>{errors.email}</p>}
                </>
            )}

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

            {(mode === 'Login' || mode === 'Sign Up' || mode === 'ResetPassword') && (
                <>
                    <input
                        type='password'
                        name='password'
                        className='form-input'
                        placeholder={t('login.password')}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className='error-text'>{errors.password}</p>}
                </>
            )}

            {(mode === 'Sign Up' || mode === 'ResetPassword') && (
                <>
                    <input
                        type='password'
                        name='confirmPassword'
                        className='form-input'
                        placeholder={t('login.confirmPassword')}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <p className='error-text'>{errors.confirmPassword}</p>}
                </>
            )}

            {mode === 'ResetPassword' && (
                <>
                    <p className='info-text'>
                        {t('login.reset_for')}: <strong>{formData.email}</strong>
                    </p>
                    <input
                        type='text'
                        name='otp'
                        className='form-input'
                        placeholder={t('login.enter_otp')}
                        value={formData.otp}
                        onChange={handleChange}
                    />
                    {errors.otp && <p className='error-text'>{errors.otp}</p>}
                </>
            )}

            {errors.general && <p className='error-text'>{errors.general}</p>}

            <div className='form-links'>
                {mode === 'Login' && (
                    <>
                        <p
                            className='forgot-password-link'
                            onClick={() => setMode('ForgotPassword')}
                        >
                            {t('login.forgot_password')}
                        </p>
                        <p className='create-account-link' onClick={() => setMode('Sign Up')}>
                            {t('login.create_account')}
                        </p>
                    </>
                )}

                {(mode === 'Sign Up' || mode === 'ForgotPassword' || mode === 'ResetPassword') && (
                    <p className='login-here-link' onClick={() => setMode('Login')}>
                        {t('login.login_here')}
                    </p>
                )}
            </div>

            <button type='submit' className='submit-button'>
                {mode === 'Login'
                    ? t('login.title_login')
                    : mode === 'Sign Up'
                        ? t('login.title_signup')
                        : mode === 'ForgotPassword'
                            ? t('login.send_otp')
                            : t('login.reset_password')}
            </button>
        </form>
    );
};

export default Login;
