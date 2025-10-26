import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:5000/api/produk_ujk";

export default function App() {
  const [produk, setProduk] = useState([]);
  const [formData, setFormData] = useState({
    kode_produk: "",
    nama_produk: "",
    kategori: "",
    harga: "",
    stok: "",
    deskripsi: "",
    tanggal_input: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Ambil data
  const fetchProduk = async () => {
    try {
      const res = await axios.get(API_URL);
      setProduk(res.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  // Handle input form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Tambah / Edit data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`${API_URL}/${formData.kode_produk}`, formData);
        alert("✅ Data berhasil diubah!");
      } else {
        await axios.post(API_URL, formData);
        alert("✅ Data berhasil ditambahkan!");
      }
      fetchProduk();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan data!");
    }
  };

  // Hapus data
  const handleDelete = async (kode_produk) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await axios.delete(`${API_URL}/${kode_produk}`);
      alert("🗑️ Data berhasil dihapus!");
      fetchProduk();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menghapus data!");
    }
  };

  // Modal control
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setFormData({
      kode_produk: "",
      nama_produk: "",
      kategori: "",
      harga: "",
      stok: "",
      deskripsi: "",
      tanggal_input: "",
    });
  };
  const handleShowModal = () => setShowModal(true);

  const handleEdit = (data) => {
    setFormData(data);
    setIsEdit(true);
    setShowModal(true);
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold text-primary">📅 Manajemen Data Produk </h2>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success" onClick={handleShowModal}>
          ➕ Tambah Produk
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered align-middle">
          <thead className="table-primary text-center">
            <tr>
              <th>Kode</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Deskripsi</th>
              <th>Tanggal Input</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {produk.length > 0 ? (
              produk.map((item) => (
                <tr key={item.kode_produk}>
                  <td>{item.kode_produk}</td>
                  <td>{item.nama_produk}</td>
                  <td>{item.kategori}</td>
                  <td>Rp {Number(item.harga).toLocaleString()}</td>
                  <td>{item.stok}</td>
                  <td>{item.deskripsi}</td>
                  <td>
                    {item.tanggal_input
                      ? new Date(item.tanggal_input).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(item)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item.kode_produk)}
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Belum ada data produk
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {isEdit ? "✏️ Edit Produk" : "➕ Tambah Produk"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {!isEdit && (
                    <div className="mb-3">
                      <label className="form-label">Kode Produk</label>
                      <input
                        type="text"
                        name="kode_produk"
                        className="form-control"
                        value={formData.kode_produk}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Nama Produk</label>
                    <input
                      type="text"
                      name="nama_produk"
                      className="form-control"
                      value={formData.nama_produk}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Kategori</label>
                    <input
                      type="text"
                      name="kategori"
                      className="form-control"
                      value={formData.kategori}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Harga</label>
                    <input
                      type="number"
                      name="harga"
                      className="form-control"
                      value={formData.harga}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stok</label>
                    <input
                      type="number"
                      name="stok"
                      className="form-control"
                      value={formData.stok}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                      name="deskripsi"
                      className="form-control"
                      value={formData.deskripsi}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tanggal Input</label>
                    <input
                      type="date"
                      name="tanggal_input"
                      className="form-control"
                      value={formData.tanggal_input}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    {isEdit ? "Simpan Perubahan" : "Tambah Produk"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
