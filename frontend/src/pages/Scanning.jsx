import React, { useState, useEffect } from 'react';
import './ScannerUI.css';

const Scanning = () => {
  const [progress, setProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Initializing...');
  const [scanLog, setScanLog] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState(0);
  const [falsePositives, setFalsePositives] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  // Sample data for false positive graph
  const [falsePositiveData, setFalsePositiveData] = useState([
    { category: 'SQL Injection', total: 5, falsePositives: 2 },
    { category: 'XSS', total: 8, falsePositives: 3 },
    { category: 'CSRF', total: 4, falsePositives: 1 },
    { category: 'Headers', total: 6, falsePositives: 4 },
    { category: 'Auth', total: 3, falsePositives: 0 }
  ]);

  const urls = [
    'https://example.com/login',
    'https://example.com/dashboard',
    'https://example.com/profile',
    'https://example.com/settings',
    'https://example.com/admin',
    'https://example.com/api/users',
    'https://example.com/api/data',
    'https://example.com/products',
    'https://example.com/checkout',
    'https://example.com/contact'
  ];

  const vulnerabilityTypes = [
    { type: 'SQL Injection', severity: 'Critical' },
    { type: 'XSS Vulnerability', severity: 'High' },
    { type: 'CSRF Token Missing', severity: 'Medium' },
    { type: 'Insecure Headers', severity: 'Low' },
    { type: 'Sensitive Data Exposure', severity: 'High' }
  ];

  useEffect(() => {
    // Simulate scan progress
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + 1;
        
        // Update scan status based on progress
        if (newProgress === 1) {
          setScanStatus('Scan initiated');
        } else if (newProgress === 25) {
          setScanStatus('Scanning endpoints');
        } else if (newProgress === 50) {
          setScanStatus('Testing vulnerabilities');
        } else if (newProgress === 75) {
          setScanStatus('Analyzing responses');
        } else if (newProgress === 100) {
          setScanStatus('Scan completed');
          clearInterval(interval);
        }
        
        // Add log entries periodically
        if (newProgress % 10 === 0) {
          const randomUrl = urls[Math.floor(Math.random() * urls.length)];
          
          // Randomly add vulnerabilities
          const shouldAddVulnerability = Math.random() > 0.7;
          
          if (shouldAddVulnerability) {
            const vulnerability = vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)];
            setScanLog(prevLog => [...prevLog, {
              url: randomUrl,
              status: 'Vulnerability Detected',
              details: `${vulnerability.type} (${vulnerability.severity})`,
              timestamp: new Date().toLocaleTimeString(),
              isVulnerability: true
            }]);
            setVulnerabilities(prev => prev + 1);
            
            // Randomly mark some as false positives
            if (Math.random() > 0.6) {
              setFalsePositives(prev => prev + 1);
              
              // Update the false positive data
              setFalsePositiveData(prevData => {
                return prevData.map(item => {
                  if (vulnerability.type.includes(item.category)) {
                    return {
                      ...item,
                      falsePositives: item.falsePositives + 1
                    };
                  }
                  return item;
                });
              });
            }
          } else {
            setScanLog(prevLog => [...prevLog, {
              url: randomUrl,
              status: 'Scanned',
              details: 'No issues detected',
              timestamp: new Date().toLocaleTimeString(),
              isVulnerability: false
            }]);
          }
        }
        
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Determine progress bar color based on progress
  const getProgressColor = () => {
    if (progress < 33) return 'progress-red';
    if (progress < 66) return 'progress-orange';
    return 'progress-green';
  };

  // Handle report download
  const handleDownload = () => {
    alert(`Downloading report in ${selectedFormat.toUpperCase()} format...`);
    // In a real app, this would trigger an actual download
  };

  // Calculate max value for graph scaling
  const maxGraphValue = Math.max(...falsePositiveData.map(item => item.total));

  return (
    <div className="scanner-container">
      <div className="scanner-header">
        <h1>SecuFusion™</h1>
        <h2>OWASP ZAP Security Scanner</h2>
      </div>
      
      <div className="scanner-grid">
        {/* Left column */}
        <div className="scanner-main">
          <div className="scan-status-container">
            <div className="scan-info">
              <div className="status">{scanStatus}</div>
              <div className="metrics">
                <div className="metric">
                  <span className="vuln-count">{vulnerabilities}</span> vulnerabilities
                </div>
                <div className="metric">
                  <span className="false-positive-count">{falsePositives}</span> false positives
                </div>
              </div>
            </div>
            
            <div className="progress-container">
              <div className={`progress-bar ${getProgressColor()}`} style={{ width: `${progress}%` }}></div>
              <div className="progress-text">{progress}%</div>
            </div>
          </div>
          
          <div className="scan-log-container">
            <h3>Scan Log</h3>
            <div className="scan-log">
              {scanLog.length === 0 ? (
                <div className="log-empty">Waiting for scan results...</div>
              ) : (
                scanLog.map((entry, index) => (
                  <div className={`log-entry ${entry.isVulnerability ? 'vulnerability' : ''}`} key={index}>
                    <div className="log-time">{entry.timestamp}</div>
                    <div className="log-url">{entry.url}</div>
                    <div className="log-status">{entry.status}</div>
                    <div className="log-details">{entry.details}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Right column */}
        <div className="scanner-sidebar">
          <div className="false-positive-container">
            <h3>False Positive Analysis</h3>
            <div className="false-positive-graph">
              {falsePositiveData.map((item, index) => (
                <div className="graph-item" key={index}>
                  <div className="graph-label">{item.category}</div>
                  <div className="graph-bar-container">
                    <div className="graph-bar-total" style={{ width: `${(item.total / maxGraphValue) * 100}%` }}>
                      <div className="graph-bar-false" style={{ width: `${(item.falsePositives / item.total) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="graph-values">
                    <span>{item.falsePositives}</span>/<span>{item.total}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="graph-legend">
              <div className="legend-item">
                <div className="legend-color legend-total"></div>
                <div>Total Alerts</div>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-false"></div>
                <div>False Positives</div>
              </div>
            </div>
          </div>
          
          <div className="scan-summary-container">
            <h3>Scan Summary</h3>
            <div className="summary-content">
              <div className="summary-item">
                <div className="summary-label">Target:</div>
                <div className="summary-value">example.com</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">IP Range:</div>
                <div className="summary-value">192.168.1.0/24</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Start Time:</div>
                <div className="summary-value">{new Date().toLocaleTimeString()}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Scan Mode:</div>
                <div className="summary-value">Deep Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="report-download-container">
        <div className="format-selector">
          <label htmlFor="formatSelect">Report Format:</label>
          <select 
            id="formatSelect" 
            value={selectedFormat} 
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="html">HTML</option>
          </select>
        </div>
        <button 
          className="download-button"
          onClick={handleDownload}
          disabled={progress < 100}
        >
          {progress < 100 ? 'Download Report (Scan in Progress)' : 'Download Report'}
        </button>
      </div>
    </div>
  );
};

export default Scanning;