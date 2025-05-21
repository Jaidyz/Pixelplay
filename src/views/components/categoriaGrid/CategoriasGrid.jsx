import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function CategoriasGrid({
  rows,
  columns,
  loading,
  paginationModel,
  setPaginationModel,
}) {
  // Columnas específicas para categorías

  return (
    <Box sx={{ height: 400, width: "100%", mt: 3 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
        sx={{
          backgroundColor: "var(--background-color2)",
          color: "var(--blank-color)",
          border: "none",

          // Cabeceras de columna
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "var(--background-color2)",
            color: "var(--blank-color)",
            fontSize: "1rem",
            borderBottom: "1px solid var(--main-color)",
          },

          // Filas
          "& .MuiDataGrid-row": {
            "&:nth-of-type(even)": {
              backgroundColor: "var(--background-color2)",
            },
            "&:hover": {
              backgroundColor: "var(--background-color) !important", // Corregido el nombre de la variable
            },
          },

          // Celdas
          "& .MuiDataGrid-cell": {
            "&:focus": {
              outline: "none",
            },
          },

          // Checkbox
          "& .MuiCheckbox-root": {
            color: "var(--main-color) !important",
          },

          // Pie de paginación
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "var(--background-color2)",
            borderTop: "1px solid var(--main-color)",
            color: "var(--blank-color)",
          },

          // Toolbar
          "& .MuiDataGrid-toolbarContainer": {
            backgroundColor: "var(--background-color2)",
            padding: "10px",
            borderBottom: "1px solid var(--main-color)",
          },

          // Texto en paginación
          "& .MuiTablePagination-root": {
            color: "var(--blank-color)",
          },

          // Iconos y botones
          "& .MuiIconButton-root": {
            color: "var(--blank-color)",
            "&:disabled": {
              color: "var(--main-color)",
            },
          },

          // Separadores de columnas
          "& .MuiDataGrid-columnSeparator": {
            color: "var(--main-color)",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "var(--background-color2)",
            borderBottom: "2px solid var(--main-color)",
          },
          "& .MuiDataGrid-columnHeader": {
            color: "var(--blank-color) !important", // Texto
            backgroundColor: "var(--background-color2)",
            "&:focus-within": {
              outline: "none !important",
            },
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            fontSize: "1.1rem",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            justifyContent: "center",
          },
          "& .MuiDataGrid-columnSeparator": {
            color: "var(--main-color)",
          },
        }}
        localeText={{
          noRowsLabel: "No hay categorías registradas",
          footerRowSelected: count => `${count} categoría${count !== 1 ? 's' : ''} seleccionada${count !== 1 ? 's' : ''}`
        }}
      />
    </Box>
  );
}