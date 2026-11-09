
const express = require('express');
const router = express.Router();

// GET semua produk
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Berhasil mengambil semua produk'
  });
});

// GET produk berdasarkan ID
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Produk dengan ID ${req.params.id}`
  });
});

// POST produk baru
router.post('/', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Produk berhasil ditambahkan',
    data: req.body
  });
});

// PUT update produk
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Produk berhasil diperbarui',
    id: req.params.id,
    data: req.body
  });
});

// DELETE produk
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Produk berhasil dihapus',
    id: req.params.id
  });
});

module.exports = router;
