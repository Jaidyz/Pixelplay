import React, { useState, useEffect } from "react";
import { supabase } from "../../../../supabase/supabase.config.jsx";
import "./adminPanel.css";
import { SquarePen, Trash } from "lucide-react";
import CategoriasCrud from "../../components/categoriasCrud/categoriasCrud.jsx";
import {
  Paper,
  Box,
  Typography,
  Button,
  Container,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
} from "@mui/material";

import ProductoForm from "../../components/productosForm/ProductosForm";
import ProductosGrid from "../../components/productosGrid/ProductosGrid";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
export default function AdminPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [currentProducto, setCurrentProducto] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const columns = [
    { field: "id", headerName: "ID", width: 70, editable: false },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1.5,
      minWidth: 200,
      editable: true,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <div
            style={{
              whiteSpace: "normal",
              lineHeight: "1.2",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              width: "100%",
            }}
          >
            {params.value || ""}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "precio",
      headerName: "Precio",
      type: "number",
      width: 120,
      editable: true,
      valueFormatter: (params) => {
        if (params.value == null) return "";
        return `$${params.value.toFixed(2)}`;
      },
      renderCell: (params) => (
        <div>{params.value != null ? `$${params.value.toFixed(2)}` : ""}</div>
      ),
    },
    { field: "categoria", headerName: "Categoría", width: 130, editable: true },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      width: 90,
      editable: true,
    },
    {
      field: "img_url",
      headerName: "Imagen",
      width: 130,
      editable: true,
      renderCell: (params) =>
        params.value ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <img
              src={params.value}
              alt={`Imagen de ${params.row.nombre}`}
              style={{ height: "40px", maxWidth: "100%", objectFit: "contain" }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/40?text=Sin+Imagen";
              }}
            />
          </Box>
        ) : (
          "Sin imagen"
        ),
    },
    {
      field: "trailer_url",
      headerName: "Trailer URL",
      width: 120,
      editable: true,
      renderCell: (params) =>
        params.value ? (
          <a href={params.value} target="_blank" rel="noopener noreferrer">
            Ver trailer
          </a>
        ) : (
          "No disponible"
        ),
    },
    {
      field: "tipo_producto",
      headerName: "Tipo",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: ["general", "videojuego", "articulo_gaming"],
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => handleEditProducto(params.row)}
            >
              <SquarePen size={16} className="editar" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              onClick={() => handleDeleteProducto(params.row.id)}
              color="error"
            >
              <Trash size={16} className="eliminar" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      const processedData = data.map((item) => ({
        ...item,
        description: item.description || "",
        precio: item.precio || 0,
        categoria: item.categoria || "",
        stock: item.stock || 0,
        img_url: item.img_url || "",
        trailer_url: item.trailer_url || "",
        tipo_producto: item.tipo_producto || "general",
      }));

      setRows(processedData);
    } catch (error) {
      console.error("Error al cargar productos:", error.message);
      showNotification("Error al cargar productos: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleCellEditCommit = async (params) => {
    if (params.field === "id") return;

    try {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === params.id ? { ...row, [params.field]: params.value } : row
        )
      );

      let valorActualizado = params.value;
      if (params.field === "precio") {
        valorActualizado = parseFloat(params.value);
        if (isNaN(valorActualizado)) valorActualizado = 0;
      } else if (params.field === "stock") {
        valorActualizado = parseInt(params.value, 10);
        if (isNaN(valorActualizado)) valorActualizado = 0;
      }

      const { error } = await supabase
        .from("productos")
        .update({ [params.field]: valorActualizado })
        .eq("id", params.id);

      if (error) throw error;

      showNotification("Producto actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar producto:", error.message);
      showNotification(
        "Error al actualizar producto: " + error.message,
        "error"
      );
      fetchProductos();
    }
  };

  const handleAddProducto = () => {
    setCurrentProducto(null);
    setFormOpen(true);
  };

  const handleEditProducto = (producto) => {
    setCurrentProducto(producto);
    setFormOpen(true);
  };

  const handleDeleteProducto = async (productoId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?"))
      return;

    try {
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", productoId);
      if (error) throw error;

      fetchProductos();
      showNotification("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
      showNotification("Error al eliminar producto: " + error.message, "error");
    }
  };

  const handleDeleteSelected = async () => {
    if (
      selectedRows.length === 0 ||
      !window.confirm(`¿Eliminar ${selectedRows.length} producto(s)?`)
    )
      return;

    try {
      const { error } = await supabase
        .from("productos")
        .delete()
        .in("id", selectedRows);
      if (error) throw error;

      fetchProductos();
      setSelectedRows([]);
      showNotification(
        `${selectedRows.length} producto(s) eliminados correctamente`
      );
    } catch (error) {
      console.error("Error al eliminar productos:", error.message);
      showNotification(
        "Error al eliminar productos: " + error.message,
        "error"
      );
    }
  };

  const handleSaveProducto = async (productoData) => {
    try {
      if (currentProducto) {
        const { error } = await supabase
          .from("productos")
          .update(productoData)
          .eq("id", currentProducto.id);
        if (error) throw error;
        showNotification("Producto actualizado correctamente");
      } else {
        const { error } = await supabase
          .from("productos")
          .insert([productoData]);
        if (error) throw error;
        showNotification("Producto creado correctamente");
      }

      fetchProductos();
      setFormOpen(false);
    } catch (error) {
      console.error("Error al guardar producto:", error.message);
      showNotification("Error al guardar producto: " + error.message, "error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-panel">
        <Container maxWidth="xl">
          <Box sx={{ my: 4 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h4">Gestión de Productos</Typography>
              <Box>
                <Button
                  variant="contained"
                  className="boton-agregar"
                  sx={{ mr: 1 }}
                  onClick={handleAddProducto}
                >
                  Nuevo Producto
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={selectedRows.length === 0}
                  onClick={handleDeleteSelected}
                >
                  Eliminar Seleccionados ({selectedRows.length})
                </Button>
              </Box>
            </Box>

            <Paper>
              <ProductosGrid
                rows={rows}
                columns={columns}
                loading={loading}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                onRowSelectionModelChange={(newSelection) =>
                  setSelectedRows(newSelection)
                }
              />
            </Paper>

            <ProductoForm
              open={formOpen}
              onClose={() => setFormOpen(false)}
              producto={currentProducto}
              onSave={handleSaveProducto}
              supabase={supabase}
            />

            <Snackbar
              open={notification.open}
              autoHideDuration={6000}
              onClose={handleCloseNotification}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Alert
                onClose={handleCloseNotification}
                severity={notification.severity}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {notification.message}
              </Alert>
            </Snackbar>
          </Box>
        </Container>
      </div>
      <CategoriasCrud/>
      <Footer />
    </>
  );
}
