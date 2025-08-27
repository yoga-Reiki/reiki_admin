import React from "react";

function Loader() {
  const spinnerStyle = {
    width: "80px",
    height: "80px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #4fa94d",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };

  const keyframesStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div>
      <style>{keyframesStyle}</style>
      <div style={spinnerStyle}></div>
    </div>
  );
}

export default Loader;