// Login.jsx
import React, {useState} from 'react'
import '../style/Login.css'

const Login = () =>  {
    const [currentState, setCurrentState] = useState('Sign up')
    return (

        <form className='login-form'>
            <div className='form-header'>
                <p className='form-title'>{currentState}</p>
                <hr className='form-title-divider'/>
            </div>
            {currentState === 'Login' ? '' : <input type="text" className='form-input' placeholder='Name' required/>}
            <input type="email" className='form-input' placeholder='Email' required/>
            <input type="password" className='form-input' placeholder='Password' required/>
            <div className='form-links'>
                <p className='forgot-password-link'>Forgot your password?</p>
                {
                    currentState === 'Login'
                        ? <p onClick={()=>setCurrentState('Sign Up')} className='create-account-link'>Create Account</p>
                        : <p onClick={()=>setCurrentState('Login')} className='login-here-link'>Login Here</p>
                }
            </div>
            <button className='submit-button'>{currentState}</button>
        </form>
    )
}

export default Login