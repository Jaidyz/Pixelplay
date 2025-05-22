const Success = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>¡Pago exitoso! 🎉</h1>
      <p style={styles.text}>Gracias por tu compra. Tu pedido ha sido procesado con éxito.</p>
      <a href="/" style={styles.button}>Volver al inicio</a>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", marginTop: "50px" },
  heading: { fontSize: "24px", color: "#4CAF50" },
  text: { fontSize: "18px" },
  button: {
    display: "inline-block",
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px"
  }
};

export default Success;