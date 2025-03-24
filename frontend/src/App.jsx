import React, { useRef } from "react"; 
import "./styles.css"; 
import Group4 from "./assets/images/Group 4.png";
import Img1 from "./assets/images/img1.png";
import Ellip from "./assets/images/Ellipse 1.png";
import Zap from "./assets/images/zap (1).png";
import Burb from "./assets/images/burb.png";
import { FaArrowRight } from "react-icons/fa";
import { Link ,useNavigate } from "react-router-dom";


const App = () => {
  const navigate = useNavigate();
  
  const nextSectionRef = useRef(null);

  const handleScroll = (sectionId) => {
    
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToFalsePositives = () => {
    const section = document.getElementById("false-positives-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
      <img src={Group4} alt="Your Image" className="image-style"/>

      
      <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/tools">Tools</Link>
          <Link to="#features" onClick={() => handleScroll("features")}>Features</Link>
          <Link to="/login" className="btnlogin btn-primary glow-effect">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
    <h1>Transform Your <br />
    Web Security with<br /><span>SecuFusion</span> </h1>
    
    <div className="image-wrapper">
        {/* Background Gradient Image */}
        <img src={Ellip} className="image2-style" alt="Gradient Background" />

        {/* Foreground Image */}
        <img src={Img1} className="image1-style" alt="Foreground" />
    </div> 
    <div class="cyber-dots dots-1"></div>
    <div class="cyber-dots dots-2"></div>
</header>

      <header className ="content">
      <p>
        In today’s digital landscape, cyber threats are 
        evolving faster than ever, leaving organizations 
        vulnerable to attacks. SecuFusion is an advanced 
        cybersecurity platform designed to detect, 
        analyze, and mitigate security vulnerabilities with 
        precision.
        </p>
        <div className="hero-buttons">
        <button className="btn btn-primary glow-effect" onClick={() => handleScroll("scan")}>Get Started</button>
        <button className="btn1 btn-outline" >Learn More</button>
        </div>
        </header>

        <section id="scan" className="url-scanner">
     
        <h2>Smart Security <br /> Starts Here</h2>
        <p>Our AI-powered scanner performs in-depth security assessments, identifying potential threats,<br />
           misconfigurations, and weaknesses in your web application. Ensure your site's safety with <br /></p>
       {/*<div className="input-container">
      <input type="text" placeholder="https://" className="custom-input" />
      <button type="submit" className="input-button">
        <FaArrowRight />
      </button>
    </div>*/}
    <div className="scanner-form-container">
      <div className="scanner-box">
            <form className="scanner-form">
              <input 
                type="url" 
                className="scanner-input" 
                placeholder="https://example.com"  
              />
              <Link to={'/scanning'}><button type="submit" className="analyze-btn" >Analyze</button></Link>
            </form>
          </div>
          </div>
      </section>

      {/* <section className="features">
        <h2>Powerful Features for<br /> Enhanced Security</h2>
        <p>
          AI-driven vulnerability scanning that integrates with leading tools
          like OWASP ZAP and Burp Suite.
        </p>
        <div className="feature-icons">
          <img src={Zap} alt="OWASP ZAP" className="burb" />
          <img src={Burb} alt="Burp Suite" />
        </div>
      </section> */}
      
      <section class="features-section" id="features">
        <div class="container">
            <h2>Advanced Features</h2>
            
            <p>Powered by industry-leading security frameworks and AI intelligence</p>
            
            <div class="features-grid">
                <a href="https://www.zaproxy.org/" class="feature-card">
                    <div class="feature-icon">
                        <i>O</i>
                    </div>
                    <h3 >OWASP ZAP Integration</h3>
                    <p className="content">Leverages the power of OWASP ZAP to identify security vulnerabilities using its comprehensive scanning engine.</p>
                </a>
                
                <a href="https://portswigger.net/" class="feature-card">
                    <div class="feature-icon">
                        <i>B</i>
                    </div>
                    <h3>Burp Suite Compatibility</h3>
                    <p>Seamlessly integrates with Burp Suite for advanced penetration testing and security assessment capabilities.</p>
                </a>
                
                <div class="feature-card">
                    <div class="feature-icon" onClick={scrollToFalsePositives}>
                        <i>Fp</i>
                    </div>
                    <h3>False Positive Detection</h3>
                    <p>Our proprietary model continuously learns and adapts to new threats, providing real-time false positive detection.</p>
                </div>
            </div>
        </div>
    </section>
   
     
    </div>
  );
};

export default App;
