

function Footer() {
    const footerStyle: object = {
      backgroundColor: "#C6C6C6",
      padding: "1rem",
      lineHeight: "180%",
      fontSize: "1.5rem",
      textAlign: "center",
      color: "#1e1e1e"
  
    }
    return (
      <>
        <footer style={footerStyle}>
          <p>&copy;Bokio</p>
          <p>Projekt</p>
          <p>Hanin Farhan</p>
          <p>hafa2300@studenter.miun.se</p>
          <p>DT210G - Fördjupad frontend-utveckling</p>
          <p>Webbutveckling 120hp</p>
          <p>Mittuniversitet</p>
        </footer>
      </>
    )
  }
  
  export default Footer