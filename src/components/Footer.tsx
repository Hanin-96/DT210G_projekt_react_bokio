

function Footer() {
  const footerStyle: object = {
    backgroundColor: "#FFFFFF",
    padding: "1rem",
    lineHeight: "180%",
    fontSize: "1.4rem",
    textAlign: "center",
    color: "#1e1e1e",
    marginTop: "20rem"

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