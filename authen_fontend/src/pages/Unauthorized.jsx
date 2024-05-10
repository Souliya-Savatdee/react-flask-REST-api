

const Unauthorized = () => {

    // localStorage.clear();
  return (
    <section>
      <div className="unauth page container">
        <h1>Unauthorized</h1>

        <p>You do not have access to the requested page.</p>

      </div>
    </section>
  );
};

export default Unauthorized;
