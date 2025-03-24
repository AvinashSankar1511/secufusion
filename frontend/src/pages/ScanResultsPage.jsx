import React, { useState, useEffect } from 'react';
import { Link} from "react-router-dom";
import './ScanResultsPage.css';

const ScanResultsPage = ({ scanData = null }) => {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If scanData is provided directly as a prop, use it
    if (scanData) {
      parseZapReport(scanData);
      return;
    }

    // Otherwise, simulate loading data from an API or file
    setIsLoading(true);
    // This is a simulated API call - in a real app, you'd fetch the actual data
    setTimeout(() => {
      // Sample ZAP JSON data structure
      const sampleData = {
        site: "https://example.secufusion.com",
        scanDate: "2025-03-19",
        scanTime: "11:23:45",
        vulnerabilities: [
          {
            alert: "Cross-Site Scripting (XSS)",
            risk: "High",
            description: "Client-side scripts can be injected into web pages viewed by other users.",
            solution: "Validate all input and encode output before rendering to the page.",
            evidence: "<script>alert('XSS')</script>",
            owasp_category: "A3:2021-Injection",
            reference: "https://owasp.org/www-community/attacks/xss/",
            prediction: 0
          },
          {
            alert: "SQL Injection",
            risk: "High",
            description: "SQL statements can be executed through the application's inputs.",
            solution: "Use parameterized queries or prepared statements.",
            evidence: "1' OR '1'='1",
            owasp_category: "A3:2021-Injection",
            reference: "https://owasp.org/www-community/attacks/SQL_Injection",
            prediction: 0
          },
          {
            alert: "Insecure Direct Object References",
            risk: "Medium",
            description: "Direct access to objects without proper authorization checks.",
            solution: "Implement proper access controls and validate user permissions.",
            evidence: "/api/user/123/data",
            owasp_category: "A1:2021-Broken Access Control",
            reference: "https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A5-Broken_Access_Control",
            prediction: 0
          },
          {
            alert: "Missing HTTP Strict Transport Security",
            risk: "Medium",
            description: "HSTS header is not set to force secure connections.",
            solution: "Add the HSTS header to all responses.",
            evidence: "HTTP/1.1 200 OK\nContent-Type: text/html",
            owasp_category: "A5:2021-Security Misconfiguration",
            reference: "https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration",
            prediction: 0
          },
          {
            alert: "Open Port 8080",
            risk: "Low",
            description: "Port 8080 is open and potentially accessible.",
            solution: "Close unused ports or restrict access with firewall rules.",
            evidence: "Port 8080 (HTTP Alternate) is open",
            owasp_category: "A5:2021-Security Misconfiguration",
            reference: "https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration",
            prediction: 1
          },
          {
            alert: "Cookie Without Secure Flag",
            risk: "Low",
            description: "Cookies are transmitted over unencrypted connections.",
            solution: "Set the 'secure' flag on all cookies.",
            evidence: "Set-Cookie: sessionid=abc123; path=/",
            owasp_category: "A5:2021-Security Misconfiguration",
            reference: "https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration",
            prediction: 0
          },
          {
            alert: "Content Security Policy Not Implemented",
            risk: "Medium",
            description: "CSP header is not set to restrict content sources.",
            solution: "Implement a Content Security Policy header.",
            evidence: "HTTP/1.1 200 OK\nContent-Type: text/html",
            owasp_category: "A5:2021-Security Misconfiguration",
            reference: "https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration",
            prediction: 0
          },
          {
            alert: "SSL Certificate Expiration Warning",
            risk: "Low",
            description: "SSL certificate will expire in 30 days.",
            solution: "Renew the SSL certificate before expiration.",
            evidence: "Certificate Expiration: 2025-04-19",
            owasp_category: "A5:2021-Security Misconfiguration",
            reference: "https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration",
            prediction: 1
          },
          {
            alert: "Vulnerable JavaScript Library",
            risk: "Medium",
            description: "Using an outdated library with known vulnerabilities.",
            solution: "Update to the latest version of the library.",
            evidence: "jquery-1.8.3.min.js",
            owasp_category: "A6:2021-Vulnerable and Outdated Components",
            reference: "https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A9-Using_Components_with_Known_Vulnerabilities",
            prediction: 0
          },
          {
            alert: "Missing X-Content-Type-Options Header",
            risk: "Low",
            description: "The X-Content-Type-Options header is not set.",
            solution: "Add 'X-Content-Type-Options: nosniff' header.",
            evidence: "HTTP/1.1 200 OK\nContent-Type: text/html",
            owasp_category: "A5:2021-Security Misconfiguration",
            reference: "https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration",
            prediction: 1
          },
          {
            alert: "Insecure Cross-Origin Resource Sharing",
            risk: "Medium",
            description: "CORS policy allows requests from any origin.",
            solution: "Restrict CORS to trusted domains only.",
            evidence: "Access-Control-Allow-Origin: *",
            owasp_category: "A5:2021-Security Misconfiguration",
            reference: "https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration",
            prediction: 0
          },
          {
            alert: "Directory Listing Enabled",
            risk: "Low",
            description: "Directory listing is enabled on the server.",
            solution: "Disable directory listing in the server configuration.",
            evidence: "Index of /assets/",
            owasp_category: "A5:2021-Security Misconfiguration",
            reference: "https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A6-Security_Misconfiguration",
            prediction: 1
          }
        ]
      };
      parseZapReport(sampleData);
    }, 1500);
  }, [scanData]);

  const parseZapReport = (data) => {
    try {
      if (!data || !data.vulnerabilities) {
        throw new Error("Invalid or empty ZAP report data");
      }
      
      setVulnerabilities(data.vulnerabilities);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to parse ZAP report: " + err.message);
      setIsLoading(false);
    }
  };

  const getRiskClass = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return 'risk-info';
    }
  };

  const handleDownloadReport = () => {
    // Create a formatted report as JSON
    const reportData = JSON.stringify({
      scanDate: new Date().toISOString(),
      vulnerabilities: vulnerabilities.map(v => ({
        name: v.alert,
        risk: v.risk,
        description: v.description,
        solution: v.solution,
        isValid: v.prediction === 0,
        owaspCategory: v.owasp_category
      }))
    }, null, 2);
    
    // Create a blob and trigger download
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secufusion-scan-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBackToHome = () => {
    // In a real application, this would navigate back to the home page
    // For this example, we'll just show an alert
    alert('Navigating back to home page...');
    // In a real React app with React Router, you would use:
    // navigate('/') or history.push('/') or similar
  };

  if (isLoading) {
    return (
      <div className="scan-results-page">
        <div className="scan-results-container">
          <div className="header-navigation">
            <Link to={'/'}>
              <button className="back-button">
                <span className="back-icon">←</span> Back to Home
              </button>
            </Link>
            <h1>SecuFusion Scan Results</h1>
          </div>
  
          {/* Centered Loader */}
          <div className="loading">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
            <p>Analyzing scan results...</p>
          </div>
        </div>
      </div>
    );
  }
  

  if (error) {
    return (
      <div className="scan-results-page">
        <div className="scan-results-container">
          <div className="header-navigation">
            <button className="back-button" onClick={handleBackToHome}>
              <span className="back-icon">←</span> Back to Home
            </button>
            <h1>SecuFusion Scan Results</h1>
          </div>
          <div className="error-message">
            <p>{error}</p>
            <button className="primary-button" onClick={handleBackToHome}>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scan-results-page">
      <div className="scan-results-container">
        <div className="header-navigation">
        <Link to={'/'}><button className="back-button">
            <span className="back-icon">←</span> Back to Home 
          </button></Link>
          <h1>SecuFusion Scan Results</h1>
        </div>

        <div className="scan-summary">
          <div className="summary-item">
            <h3>Total Vulnerabilities</h3>
            <p>{vulnerabilities.length}</p>
          </div>
          <div className="summary-item">
            <h3>True Positives</h3>
            <p>{vulnerabilities.filter(v => v.prediction === 0).length}</p>
          </div>
          <div className="summary-item">
            <h3>False Positives</h3>
            <p>{vulnerabilities.filter(v => v.prediction === 1).length}</p>
          </div>
          <div className="summary-item">
            <h3>High Risk</h3>
            <p>{vulnerabilities.filter(v => v.risk.toLowerCase() === 'high').length}</p>
          </div>
        </div>

        <div className="vulnerabilities-grid">
          {vulnerabilities.map((vuln, index) => (
            <div key={index} className="vulnerability-card">
              <div className={`vulnerability-header ${getRiskClass(vuln.risk)}`}>
                <h3>{vuln.alert}</h3>
                <span className="risk-badge">{vuln.risk}</span>
              </div>
              <div className="vulnerability-body">
                <div className="vulnerability-section">
                  <h4>Description</h4>
                  <p>{vuln.description}</p>
                </div>
                <div className="vulnerability-section">
                  <h4>Solution</h4>
                  <p>{vuln.solution}</p>
                </div>
                <div className="vulnerability-section">
                  <h4>Evidence</h4>
                  <div className="evidence-code">
                    <code>{vuln.evidence}</code>
                  </div>
                </div>
                <div className="vulnerability-section">
                  <h4>OWASP Category</h4>
                  <p>{vuln.owasp_category}</p>
                </div>
                <div className="vulnerability-section">
                  <h4>Reference</h4>
                  <a href={vuln.reference} target="_blank" rel="noreferrer">
                    {vuln.reference}
                  </a>
                </div>
                <div className="vulnerability-status">
                  <span className={vuln.prediction === 1 ? "false-positive-badge" : "true-positive-badge"}>
                    {vuln.prediction === 1 ? "⚠️ False Positive" : "❌ True Positive"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button className="download-button" onClick={handleDownloadReport}>
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResultsPage;