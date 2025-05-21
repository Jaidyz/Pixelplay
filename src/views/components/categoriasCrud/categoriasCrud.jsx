import React, { useState, useEffect } from "react";
import { supabase } from "../../../../supabase/supabase.config.jsx";
import { SquarePen, Trash } from "lucide-react";
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

import CategoriaForm from "../categoriasForm/CategoriasForm";
import CategoriasGrid from "../categoriaGrid/CategoriasGrid";
export default function CategoriasCrud() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState(null);
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
              sx={{color: "var(--blank-color)" }}
              onClick={() => handleEditCategoria(params.row)}
            >
              <SquarePen size={16} className="editar" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              onClick={() => handleDeleteCategoria(params.row.id)}
              color="error"
            >
              <Trash size={16} className="eliminar" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      setRows(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error.message);
      showNotification("Error al cargar categorías: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
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

      const { error } = await supabase
        .from("categorias")
        .update({ [params.field]: params.value })
        .eq("id", params.id);

      if (error) throw error;

      showNotification("Categoría actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar categoría:", error.message);
      showNotification(
        "Error al actualizar categoría: " + error.message,
        "error"
      );
      fetchCategorias();
    }
  };

  const handleAddCategoria = () => {
    setCurrentCategoria(null);
    setFormOpen(true);
  };

  const handleEditCategoria = (categoria) => {
    setCurrentCategoria(categoria);
    setFormOpen(true);
  };

  const handleDeleteCategoria = async (categoriaId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

    try {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", categoriaId);
      if (error) throw error;

      fetchCategorias();
      showNotification("Categoría eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar categoría:", error.message);
      showNotification(
        "Error al eliminar categoría: " + error.message,
        "error"
      );
    }
  };

  const handleDeleteSelected = async () => {
    if (
      selectedRows.length === 0 ||
      !window.confirm(`¿Eliminar ${selectedRows.length} categoría(s)?`)
    )
      return;

    try {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .in("id", selectedRows);
      if (error) throw error;

      fetchCategorias();
      setSelectedRows([]);
      showNotification(
        `${selectedRows.length} categoría(s) eliminadas correctamente`
      );
    } catch (error) {
      console.error("Error al eliminar categorías:", error.message);
      showNotification(
        "Error al eliminar categorías: " + error.message,
        "error"
      );
    }
  };

  const handleSaveCategoria = async (categoriaData) => {
    try {
      if (currentCategoria) {
        const { error } = await supabase
          .from("categorias")
          .update(categoriaData)
          .eq("id", currentCategoria.id);
        if (error) throw error;
        showNotification("Categoría actualizada correctamente");
      } else {
        const { error } = await supabase
          .from("categorias")
          .insert([categoriaData]);
        if (error) throw error;
        showNotification("Categoría creada correctamente");
      }

      fetchCategorias();
      setFormOpen(false);
    } catch (error) {
      console.error("Error al guardar categoría:", error.message);
      showNotification("Error al guardar categoría: " + error.message, "error");
    }
  };

  return (
    <>
      <div className="admin-panel">
        <Container maxWidth="xl">
          <Box sx={{ my: 4 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h4">Gestión de Categorías</Typography>
              <Box>
                <Button
                  variant="contained"
                  className="boton-agregar"
                  sx={{ mr: 1 }}
                  onClick={handleAddCategoria}
                >
                  Nueva Categoría
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={selectedRows.length === 0}
                  onClick={handleDeleteSelected}
                >
                  Eliminar Seleccionadas ({selectedRows.length})
                </Button>
              </Box>
            </Box>

            <Paper>
              <CategoriasGrid
                rows={rows}
                columns={columns} // Aquí sí envías el arreglo completo que incluye la columna "acciones"
                loading={loading}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                onRowSelectionModelChange={(newSelection) =>
                  setSelectedRows(newSelection)
                }
                onCellEditCommit={handleCellEditCommit}
              />
            </Paper>

            <CategoriaForm
              open={formOpen}
              onClose={() => setFormOpen(false)}
              categoria={currentCategoria}
              onSave={handleSaveCategoria}
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
    </>
  );
}
