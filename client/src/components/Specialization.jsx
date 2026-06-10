function Specialization() {

  const data = [
    "Dokter Umum",
    "Dokter Anak",
    "Dokter Gigi",
    "Dokter Kulit",
    "Dokter Jantung",
    "Dokter Mata",
  ];

  return (
    <section
      id="spesialisasi"
      className="py-5"
    >
      <div className="container">

        <h2 className="text-center mb-5">
          Spesialisasi
        </h2>

        <div className="row">

          {data.map((item, index) => (
            <div
              className="col-md-4 mb-4"
              key={index}
            >
              <div className="card shadow-sm text-center p-4">

                <h5>{item}</h5>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Specialization;