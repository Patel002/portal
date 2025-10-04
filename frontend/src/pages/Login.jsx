import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import logo from "/src/assets/complogo.png";
import bgIllustration from "/src/assets/img/auth.png"
import showToast from '../helper/toast.js';
import '../css/login.css'


export default function Login() {

  const successAudio = new Audio('/src/assets/success.mp3');
      successAudio.load();

      const errorAudio = new Audio('/src/assets/error.mp3');
      errorAudio.load();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:7171/api/auth/login", formData, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 200 && res.data.token) {
      const { message, token } = res.data;

      showToast("success", message);
      successAudio.play();

      // Store token
      localStorage.setItem("token", token);

      // Decode token
      const decodedToken = jwtDecode(token);
      console.log("Decoded:", decodedToken);

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("creater", decodedToken.id);
      sessionStorage.setItem("role", decodedToken.role);
      sessionStorage.setItem("roleId", decodedToken.roleId);

     setInterval(()=>{
       window.location.href = "/dashboard";
     },3100)
    }
    
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    const errorMsg = err.response?.data?.message || "Invalid username or password!";
    showToast("error", errorMsg);
    errorAudio.play();
  }
};


  return (
   <main className="login-page">
    {/* <img src={bg37} alt="Illustration" /> */}
  <div className="login-card">
    <div className="login-left-card">
      <div className="login-left">
    <h2>DHT Solutions</h2>
  <div className="content">
    <p>
      DHT-Solutions software offers a seamless business process experience
      distinguished by its ease and efficiency!
    </p>
    <ul>
      <li>Fast</li>
      <li>Simple</li>
      <li>Scalable</li>
    </ul>
  </div>
  
  <img src={bgIllustration} alt="Illustration" className="bottom-img" /> {/* ✅ pinned bottom */}
</div>
    </div>

    <div className="login-right">
      <img src={logo} alt="Logo" className="login-logo" />
      <h3>Sign In</h3>
      <p>Get access to your account</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail</label>
        <input id='email' type="email" name="email" placeholder="abc@abc.com" value={formData.email} onChange={handleChange} />

        <label htmlFor="password">Password</label>
        <input id='password 'type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <div className="checkbox">
          <input type="checkbox" name="remember" checked={formData.remember} onChange={handleChange} />
          <label>  </label>
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  </div>
</main>

  );
}
