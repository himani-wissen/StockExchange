import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";

const StockExchangePage = () => {
  const [stocks, setStocks] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [stock, setStock] = useState({
    name: "",
    quantity: "",
    minPrice: "",
    maxPrice: "",
    currentPrice: ""
  });

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = () => {
    axios
      .get("http://localhost:5000/api/admin/stocks")
      .then((response) => setStocks(response.data))
      .catch((error) => console.error("Error fetching stocks:", error));
  };

  // Save or Update Stock
  const handleSaveStock = async (e) => {
    e.preventDefault();

    if (editingStock) {
      // Update existing stock
      try {
        await axios.put(`http://localhost:5000/api/admin/stocks/${editingStock.id}`, stock);
        console.log("Stock updated:", stock);
      } catch (error) {
        console.error("Error updating stock:", error);
      }
    } else {
      // Add new stock
      try {
        await axios.post("http://localhost:5000/api/admin/stocks", stock);
        console.log("Stock added:", stock);
      } catch (error) {
        console.error("Error adding stock:", error);
      }
    }

    resetForm();
    fetchStocks(); // Refresh stocks after update/add
  };

  // Handle Delete
  const handleDeleteStock = (id) => {
    axios.delete(`http://localhost:5000/api/admin/stocks/${id}`).then(() => fetchStocks());
  };

  // Handle Edit Click
  const handleEditStock = (stock) => {
    setEditingStock(stock);
    setStock(stock);
  };

  const resetForm = () => {
    setStock({ name: "", quantity: "", minPrice: "", maxPrice: "" , currentPrice: ""});
    setEditingStock(null);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Stock Exchange (Admin)
      </Typography>

      {/* Stock Form */}
      <Box component="form" onSubmit={handleSaveStock} sx={{ mb: 3 }}>
        <TextField
          label="Company Name"
          value={stock.name}
          onChange={(e) => setStock({ ...stock, name: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Quantity"
          type="number"
          value={stock.quantity}
          onChange={(e) => setStock({ ...stock, quantity: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Minimum Price"
          type="number"
          value={stock.minPrice}
          onChange={(e) => setStock({ ...stock, minPrice: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Maximum Price"
          type="number"
          value={stock.maxPrice}
          onChange={(e) => setStock({ ...stock, maxPrice: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Current Price"
          type="number"
          value={stock.currentPrice}
          onChange={(e) => setStock({ ...stock, currentPrice: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" sx={{ mr: 2 }}>
          {editingStock ? "Update Stock" : "Add Stock"}
        </Button>
        {editingStock && (
          <Button variant="outlined" onClick={resetForm}>
            Cancel
          </Button>
        )}
      </Box>

      {/* Stock List */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price Range</TableCell>
              <TableCell> Current Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.name}</TableCell>
                <TableCell>{stock.quantity}</TableCell>
                <TableCell>
                  {stock.minPrice} - {stock.maxPrice}
                </TableCell>
                <TableCell>{stock.currentPrice}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditStock(stock)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteStock(stock.id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default StockExchangePage;
