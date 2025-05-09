import React from 'react'
import axios from '../api/axios';
import './styles/Authentication.css'
import { useState } from 'react'
import  {useNavigate } from 'react-router-dom'

export default function Authentication() {

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({name:'',email:'',password:''});
  const navigate = useNavigate(); 

  const toggleForm = ()=> setIsLogin(!isLogin);

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try {
      const url = isLogin ? '/auth/login':'/auth/register';
      const payload = isLogin? {email:form.email,password:form.password}
                      :
                      form;
      const res = await axios.post(url,payload);

      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        //alert('Welcome user');
        navigate('/');
        //Navigate to home page
      }else{
        alert('Registration successful');
        setIsLogin(true);
      }

    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  }

return (
    <div className='auth-container' >
      <div className="auth-inside-box">
      <h2>{isLogin? 'Login':'Register'}</h2>
      <form className='auth-form' onSubmit={handleSubmit}>
        {!isLogin && (
          <input type="text"
          placeholder='Name'
          name='name'
          value={form.name}
          onChange={handleChange}
          required
          />
        )}
        <br />
         <input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br />

        <button className="submitbtn">{isLogin?'Login':'Register'}</button>
      </form>
      <p onClick={toggleForm}>
  {isLogin ? (
    <>Don't have an account? <span>Register</span></>
  ) : (
    <>Already have an account? <span>Login</span></>
  )}
</p>

      </div>
    </div>
  )
}
