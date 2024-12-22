function FeedbackDisplay({ feedback }) {
    const handleGenerateReport = () => {
      // Logic to generate a report from the feedback
      console.log('Report generated:', feedback);
    };
  
    return (
      <div>
        <h3>Feedback</h3>
        <p>{feedback || "No feedback available"}</p>
        <button onClick={handleGenerateReport}>Generate Report</button>
      </div>
    );
  }
  
  export default FeedbackDisplay;
  