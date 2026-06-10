function FAQ() {
  return (
    <section
      id="faq"
      className="py-5 bg-light"
    >
      <div className="container">

        <h2 className="text-center mb-4">
          FAQ
        </h2>

        <div className="accordion">

          <div className="accordion-item">
            <h2 className="accordion-header">

              <button
                className="accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#faq1"
              >
                Bagaimana cara booking?
              </button>

            </h2>

            <div
              id="faq1"
              className="accordion-collapse collapse show"
            >
              <div className="accordion-body">
                Login terlebih dahulu,
                pilih dokter, lalu lakukan
                booking appointment.
              </div>
            </div>

          </div>

          <div className="accordion-item">

            <h2 className="accordion-header">

              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
              >
                Apakah harus login?
              </button>

            </h2>

            <div
              id="faq2"
              className="accordion-collapse collapse"
            >
              <div className="accordion-body">
                Ya, untuk melakukan booking
                wajib login terlebih dahulu.
              </div>
            </div>

          </div>

          <div className="accordion-item">

            <h2 className="accordion-header">

              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#faq3"
              >
                Bagaimana menjadi dokter?
              </button>

            </h2>

            <div
              id="faq3"
              className="accordion-collapse collapse"
            >
              <div className="accordion-body">
                Login sebagai user lalu
                klik menu Daftar Sebagai
                Dokter.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default FAQ;