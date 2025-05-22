const Cancel = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Pago cancelado ❌</h1>
      <p style={styles.text}>Tu pago no se ha completado. Si fue un error, intenta nuevamente.</p>
      <a href="/carrito" style={styles.button}>Volver al carrito</a>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", marginTop: "50px" },
  heading: { fontSize: "24px", color: "#E53935" },
  text: { fontSize: "18px" },
  button: {
    display: "inline-block",
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#E53935",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px"
  }
};

export default Cancel;