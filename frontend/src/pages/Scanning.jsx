import React, { useState, useEffect } from 'react';
import { Link ,useNavigate} from "react-router-dom";
import './ScannerUI.css';

const Scanning = () => {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Initializing scan...');
  const [scanComplete, setScanComplete] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const navigate = useNavigate();

  // Simulate scan progress
  useEffect(() => {
    if (scanProgress < 100) {
      const timer = setTimeout(() => {
        setScanProgress(prevProgress => {
          const newProgress = prevProgress + 1;

          // Update status message based on progress
          if (newProgress === 25) setScanStatus('Scanning network configurations...');
          if (newProgress === 50) setScanStatus('Analyzing security protocols...');
          if (newProgress === 75) setScanStatus('Checking for vulnerabilities...');
          if (newProgress === 100) {
            setScanStatus('Scan complete');
            setScanComplete(true);
            // Load sample vulnerabilities when scan completes
            setVulnerabilities([
              { id: 1, name: 'SSL Certificate Expiration', description: 'SSL certificate will expire in 60 days.', falsePositive: true },
              { id: 2, name: 'Open Port 8080', description: 'Port 8080 appears to be open.', falsePositive: true },
              { id: 3, name: 'Potential XSS Vulnerability', description: 'Cross-site scripting possibility detected.', falsePositive: true },
              { id: 4, name: 'Outdated Library Version', description: 'Using library version with known CVEs.', falsePositive: false },
              { id: 5, name: 'Weak Password Policy', description: 'Password policy does not meet requirements.', falsePositive: true },
              { id: 6, name: 'Insecure Cookie Flags', description: 'Cookies missing security flags.', falsePositive: true },
              { id: 7, name: 'Potential SQL Injection', description: 'SQL injection vulnerability detected.', falsePositive: false },
              { id: 8, name: 'Missing Security Headers', description: 'Required security headers not found.', falsePositive: true },
              { id: 9, name: 'Default Admin Username', description: 'Default administrator username detected.', falsePositive: true },
              { id: 10, name: 'Directory Listing Enabled', description: 'Directory listing enabled on server.', falsePositive: false },
              { id: 11, name: 'Unencrypted Data Transfer', description: 'Data transmitted without encryption.', falsePositive: true },
              { id: 12, name: 'Missing Rate Limiting', description: 'No rate limiting on authentication endpoints.', falsePositive: false },
              { id: 13, name: 'Insecure File Permissions', description: 'Critical files have weak permissions.', falsePositive: true },
              { id: 14, name: 'Outdated TLS Version', description: 'Using deprecated TLS version.', falsePositive: false },
              { id: 15, name: 'CSRF Protection Missing', description: 'Form submissions lack CSRF protection.', falsePositive: true },
              { id: 16, name: 'Missing Data Validation', description: 'Input data not properly validated.', falsePositive: false }
            ]);
          }
          return newProgress;
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [scanProgress]);

  const handleDownloadReport = () => {
    alert('Downloading scan report...');
  };

  return (
    <div className="scan-page">
      <div className="scan-container">
        <div className="header-navigation">
          <Link to={'/'}><button className="back-button">
            <span className="back-icon">←</span> Back 
          </button></Link>
          <h1>Security Scan</h1>
        </div>

        {/* Progress Section */}
        <div className="scan-progress-container">
          <div className="scan-progress-info">
            <span>{scanStatus}</span>
            <span>{scanProgress}%</span>
          </div>
          <div className="scan-progress-bar">
            <div 
              className="scan-progress-fill" 
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Show Cube Loader while scanning is in progress */}
        {!scanComplete && (
          <div className="cube-loader">
            <div className="cube-wrapper">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="cube-span" style={{ '--i': i }}></span>
              ))}
            </div>
            <div className="cube-top"></div>
          </div>
        )}

        {/* Show Scan Results when completed */}
        {scanComplete && navigate('/output')}
      </div>
    </div>
  );
};

export default Scanning;
