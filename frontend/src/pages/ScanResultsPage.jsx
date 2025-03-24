import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ScanResultsPage.css';

const ScanResultsPage = () => {
  const navigator = useNavigate();
  const location = useLocation();
  const scanData = location.state?.scanData?.results || null;
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [vuln, setvuln] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Received scanData:", scanData);

  useEffect(() => {
    if (!scanData) {
      setError("No scan data available.");
      setIsLoading(false);
      return;
    }

    parseZapReport(scanData);
  }, [scanData]);

  const parseZapReport = (data) => {
    try {
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid or empty ZAP report data");
      }

      setVulnerabilities(data);
      setvuln(data);
    } catch (err) {
      setError("Failed to parse ZAP report: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskClass = (risk = '') => {
    switch (risk.toLowerCase()) {
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return 'risk-info';
    }
  };

  const handleDownloadReport = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      // Initialize the PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);

      // Add styling
      const colors = {
        title: [41, 128, 185], // Blue
        subheading: [44, 62, 80], // Dark blue
        truePositive: [192, 57, 43], // Red for true positives (prediction = 0)
        falsePositive: [39, 174, 96], // Green for false positives (prediction = 1)
        high: [192, 57, 43], // Red
        medium: [211, 84, 0], // Orange
        low: [39, 174, 96] // Green
      };

      // Separate vulnerabilities by prediction
      const truePositives = vulnerabilities.filter(v => v.prediction === 0);
      const falsePositives = vulnerabilities.filter(v => v.prediction === 1);

      // Track positions for bookmarks/links
      let truePositivesPage = 1;
      let truePositivesY = 0;
      let falsePositivesPage = 1;
      let falsePositivesY = 0;

      // Track current position and page
      let y = margin;
      let currentPage = 1;

      // Add header & logo
      const addHeader = () => {
        // Add page header with blue background
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, pageWidth, 20, 'F');

        // Add title text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('SecuFusion Scan Report', margin, 14);

        // Add date on the right
        const dateText = `Scan Date: ${new Date().toLocaleString()}`;
        const dateWidth = doc.getTextWidth(dateText);
        doc.setFontSize(10);
        doc.text(dateText, pageWidth - margin - dateWidth, 14);

        // Reset for content
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');

        y = 30; // Set position after header
      };

      // Function to check if we need a new page
      const checkForNewPage = (requiredSpace) => {
        if (y + requiredSpace > pageHeight - margin) {
          doc.addPage();
          currentPage++;
          addHeader();
          return true;
        }
        return false;
      };

      // Start with header
      addHeader();

      // Add scan summary heading
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.subheading[0], colors.subheading[1], colors.subheading[2]);
      doc.text('Scan Summary', margin, y);
      y += 10;

      // Add summary box
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y, contentWidth, 30, 'F');

      // Add summary content
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Issues: ${vulnerabilities.length}`, margin + 5, y + 10);

      // True Positives Count with proper spacing
      doc.setTextColor(colors.truePositive[0], colors.truePositive[1], colors.truePositive[2]);
      doc.text(`True Positives: ${truePositives.length}`, pageWidth / 2, y + 10);

      // False Positives Count with proper spacing to ensure it's not cut off
      doc.setTextColor(colors.falsePositive[0], colors.falsePositive[1], colors.falsePositive[2]);
      doc.text(`False Positives: ${falsePositives.length}`, pageWidth / 2, y + 20);

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Add links to sections inside the summary box
      doc.setTextColor(colors.truePositive[0], colors.truePositive[1], colors.truePositive[2]);
      // doc.text("1. True Positives", margin + 5, y + 20);

      doc.setTextColor(colors.falsePositive[0], colors.falsePositive[1], colors.falsePositive[2]);
      const linkXPos = doc.getTextWidth("1. True Positives") + margin + 15;
      // doc.text("2. False Positives", linkXPos, y + 20);

      // Move position down after summary
      y += 40;

      // Add table of contents header
      doc.setTextColor(colors.subheading[0], colors.subheading[1], colors.subheading[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Table of Contents', margin, y);
      y += 10;

      // Add table of contents items with proper spacing
      doc.setFontSize(12);
      doc.setTextColor(colors.truePositive[0], colors.truePositive[1], colors.truePositive[2]);
      doc.text("1. True Positives", margin + 5, y);
      // Store this position for linking later
      const tocTruePositivesY = y;

      y += 8;

      doc.setTextColor(colors.falsePositive[0], colors.falsePositive[1], colors.falsePositive[2]);
      doc.text("2. False Positives", margin + 5, y);
      // Store this position for linking later
      const tocFalsePositivesY = y;

      y += 20;

      // Now add true positives section
      if (truePositives.length > 0) {
        checkForNewPage(20);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.truePositive[0], colors.truePositive[1], colors.truePositive[2]);
        doc.text('1. True Positives', margin, y);

        // Store location for links
        truePositivesPage = currentPage;
        truePositivesY = y;

        y += 10;

        // Render true positives
        truePositives.forEach((v, index) => {
          // Check if we need a new page
          checkForNewPage(90);

          // Background for each vulnerability
          doc.setFillColor(245, 245, 245);
          doc.roundedRect(margin, y, contentWidth, 75, 3, 3, 'F');

          // Title with colored background
          doc.setFillColor(colors.truePositive[0], colors.truePositive[1], colors.truePositive[2]);
          doc.roundedRect(margin, y, contentWidth, 10, 3, 3, 'F');

          // Title text
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`Vulnerability ${index + 1}: ${v.alert}`, margin + 5, y + 7);
          y += 15;

          // Content
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text('Risk:', margin + 5, y);
          doc.setFont('helvetica', 'normal');

          // Color for risk level
          let riskColor = colors.low;
          if (v.risk === 'High') riskColor = colors.high;
          else if (v.risk === 'Medium') riskColor = colors.medium;

          doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
          doc.text(v.risk, margin + 30, y);
          y += 8;

          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.text('OWASP Category:', margin + 5, y);
          doc.setFont('helvetica', 'normal');
          if (v.owasp_category) doc.text(v.owasp_category, margin + 50, y);
          y += 8;

          doc.setFont('helvetica', 'bold');
          doc.text('Description:', margin + 5, y);
          y += 6;

          // Handle multi-line description
          doc.setFont('helvetica', 'normal');
          const splitDescription = doc.splitTextToSize(v.description, contentWidth - 10);
          doc.text(splitDescription, margin + 5, y);
          y += splitDescription.length * 5 + 5;

          doc.setFont('helvetica', 'bold');
          doc.text('Solution:', margin + 5, y);
          y += 6;

          // Handle multi-line solution
          doc.setFont('helvetica', 'normal');
          const splitSolution = doc.splitTextToSize(v.solution, contentWidth - 10);
          doc.text(splitSolution, margin + 5, y);
          y += splitSolution.length * 5 + 20;
        });
      }

      // Add false positives section
      if (falsePositives.length > 0) {
        checkForNewPage(20);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.falsePositive[0], colors.falsePositive[1], colors.falsePositive[2]);
        doc.text('2. False Positives', margin, y);

        // Store location for links
        falsePositivesPage = currentPage;
        falsePositivesY = y;

        y += 10;

        // Render false positives
        falsePositives.forEach((v, index) => {
          // Check if we need a new page
          checkForNewPage(90);

          // Background for each vulnerability
          doc.setFillColor(245, 245, 245);
          doc.roundedRect(margin, y, contentWidth, 75, 3, 3, 'F');

          // Title with colored background
          doc.setFillColor(colors.falsePositive[0], colors.falsePositive[1], colors.falsePositive[2]);
          doc.roundedRect(margin, y, contentWidth, 10, 3, 3, 'F');

          // Title text
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`Vulnerability ${index + 1}: ${v.alert}`, margin + 5, y + 7);
          y += 15;

          // Content
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text('Risk:', margin + 5, y);
          doc.setFont('helvetica', 'normal');

          // Color for risk level
          let riskColor = colors.low;
          if (v.risk === 'High') riskColor = colors.high;
          else if (v.risk === 'Medium') riskColor = colors.medium;

          doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
          doc.text(v.risk, margin + 30, y);
          y += 8;

          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.text('OWASP Category:', margin + 5, y);
          doc.setFont('helvetica', 'normal');
          if (v.owasp_category) doc.text(v.owasp_category, margin + 50, y);
          y += 8;

          doc.setFont('helvetica', 'bold');
          doc.text('Description:', margin + 5, y);
          y += 6;

          // Handle multi-line description
          doc.setFont('helvetica', 'normal');
          const splitDescription = doc.splitTextToSize(v.description, contentWidth - 10);
          doc.text(splitDescription, margin + 5, y);
          y += splitDescription.length * 5 + 5;

          doc.setFont('helvetica', 'bold');
          doc.text('Solution:', margin + 5, y);
          y += 6;

          // Handle multi-line solution
          doc.setFont('helvetica', 'normal');
          const splitSolution = doc.splitTextToSize(v.solution, contentWidth - 10);
          doc.text(splitSolution, margin + 5, y);
          y += splitSolution.length * 5 + 20;
        });
      }

      // Now add the links
      // Go back to page 1 to add links
      doc.setPage(1);

      // Add links in the summary box
      const summaryY = 40;

      // Add link for True Positives in summary
      if (truePositives.length > 0) {
        const truePositivesLink = {
          pageNumber: truePositivesPage,
          y: truePositivesY
        };
        doc.link(margin + 5, summaryY + 15, doc.getTextWidth("1. True Positives"), 10, truePositivesLink);

        // Add link in table of contents
        doc.link(margin + 5, tocTruePositivesY - 5, doc.getTextWidth("1. True Positives"), 8, truePositivesLink);
      }

      // Add link for False Positives in summary
      if (falsePositives.length > 0) {
        const falsePositivesLink = {
          pageNumber: falsePositivesPage,
          y: falsePositivesY
        };
        doc.link(linkXPos, summaryY + 15, doc.getTextWidth("2. False Positives"), 10, falsePositivesLink);

        // Add link in table of contents
        doc.link(margin + 5, tocFalsePositivesY - 5, doc.getTextWidth("2. False Positives"), 8, falsePositivesLink);
      }

      // Add page numbers
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - 28, pageHeight - 10);
      }

      // Save the PDF
      doc.save(`secufusion-scan-${new Date().toISOString().split('T')[0]}.pdf`);
    }).catch(err => {
      console.error("Failed to load jsPDF library:", err);
    });
  };

  const handleBackToHome = () => {
    const flag = confirm('Do you want to download the report?');
    if (flag) handleDownloadReport();
    navigator('/');
  };

  if (isLoading) {
    return (
      <div className="scan-results-page">
        <div className="scan-results-container">
          <button className="back-button2" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <h1>SecuFusion Scan Results</h1>
          <div className="loading">
            <div className="loading-spinner"></div>
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
          <button className="back-button2" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <h1>SecuFusion Scan Results</h1>
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

  const filterCriteria = {
    total: () => vulnerabilities,
    truePositives: () => vulnerabilities.filter(v => v.prediction === 0),
    falsePositives: () => vulnerabilities.filter(v => v.prediction === 1),
    highRisk: () => vulnerabilities.filter(v => v.risk?.toLowerCase() === 'high'),
  };

  const handleFilter = (criteria) => {
    if (filterCriteria[criteria]) {
      setvuln(filterCriteria[criteria]());
    } else {
      console.error("Invalid filter criteria");
    }
  };


  return (
    <div className="scan-results-page">
      <div className="scan-results-container">
        <div className='flex justify-between'>
          <button className="back-button2" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <button className="download-button" onClick={handleDownloadReport}>
            Download Report
          </button>
        </div>
        <h1>SecuFusion Scan Results</h1>

        <div className="scan-summary">
          <div onClick={() => handleFilter("total")} className="summary-item">
            <h3>Total Vulnerabilities</h3>
            <p>{vulnerabilities.length}</p>
          </div>
          <div onClick={() => handleFilter("truePositives")} className="summary-item">
            <h3>True Positives</h3>
            <p>{vulnerabilities.filter(v => v.prediction === 0).length}</p>
          </div>
          <div onClick={() => handleFilter("falsePositives")} className="summary-item">
            <h3>False Positives</h3>
            <p>{vulnerabilities.filter(v => v.prediction === 1).length}</p>
          </div>
          <div onClick={() => handleFilter("highRisk")} className="summary-item">
            <h3>High Risk</h3>
            <p>{vulnerabilities.filter(v => v.risk?.toLowerCase() === 'high').length}</p>
          </div>
        </div>

        <div className="vulnerabilities-grid">
          {vuln.map((vuln, index) => (
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
                    {vuln.prediction === 1 ? "⚠️ False Positive" : "✅ True Positive"}
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
