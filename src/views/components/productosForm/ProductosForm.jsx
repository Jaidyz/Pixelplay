import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  FormHelperText
} from '@mui/material';

export default function ProductosForm({ open, onClose, producto, onSave, supabase }) {
  // Estado inicial del formulario
  const initialFormState = {
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: '',
    img_url: '',
    trailer_url: '',
    tipo_producto: 'general'
  };

  // Estado del formulario
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Cuando el producto cambia, actualiza el formulario
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio ? String(producto.precio) : '',
        categoria: producto.categoria || '',
        stock: producto.stock ? String(producto.stock) : '',
        img_url: producto.img_url || '',
        trailer_url: producto.trailer_url || '',
        tipo_producto: producto.tipo_producto || 'general'
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [producto, open]);

  // Maneja cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Para campos numéricos, validamos que sean números
    if (name === 'precio') {
      // Permitir solo números y un punto decimal
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        // Limpiar el error si existe
        if (errors[name]) {
          setErrors({ ...errors, [name]: null });
        }
      }
    } else if (name === 'stock') {
      // Permitir solo números enteros
      if (value === '' || /^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
          setErrors({ ...errors, [name]: null });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
    }
  };

  // Valida el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.precio) {
      newErrors.precio = 'El precio es obligatorio';
    } else if (isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) < 0) {
      newErrors.precio = 'El precio debe ser un número positivo';
    }
    
    if (formData.stock && (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
      newErrors.stock = 'El stock debe ser un número entero positivo';
    }
    
    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envía el formulario
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // Convertir valores numéricos
    const productoData = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: formData.stock ? parseInt(formData.stock) : 0
    };
    
    onSave(productoData);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'var(--background-color2)',
          color: 'var(--blank-color)',
          borderRadius: '12px',
        }
      }}
    >
      <DialogTitle>
        {producto ? 'Editar Producto' : 'Nuevo Producto'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Primera columna: Datos básicos */}
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              margin="dense"
              name="nombre"
              label="Nombre del Producto"
              fullWidth
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { color: 'var(--blank-color)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'var(--main-color)' },
                  '&:hover fieldset': { borderColor: 'var(--main-color)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--main-color) !important' },
                  color: 'var(--blank-color)'
                },
                '& .MuiFormHelperText-root': {
                  color: 'var(--main-color)'
                }
              }}
            />
            
            <TextField
              margin="dense"
              name="descripcion"
              label="Descripción"
              fullWidth
              multiline
              rows={4}
              value={formData.descripcion || ''}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { color: 'var(--blank-color)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'var(--main-color)' },
                  '&:hover fieldset': { borderColor: 'var(--main-color)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--main-color) !important' },
                  color: 'var(--blank-color)'
                },
                '& .MuiFormHelperText-root': {
                  color: 'var(--main-color)'
                }
              }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="precio"
                  label="Precio"
                  fullWidth
                  value={formData.precio}
                  onChange={handleChange}
                  error={!!errors.precio}
                  helperText={errors.precio}
                  inputProps={{ 
                    inputMode: 'decimal',
                    step: '0.01' 
                  }}
                  variant="outlined"
                  sx={{
                '& .MuiInputLabel-root': { color: 'var(--blank-color)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'var(--main-color)' },
                  '&:hover fieldset': { borderColor: 'var(--main-color)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--main-color) !important' },
                  color: 'var(--blank-color)'
                },
                '& .MuiFormHelperText-root': {
                  color: 'var(--main-color)'
                }
              }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="stock"
                  label="Stock"
                  fullWidth
                  value={formData.stock}
                  onChange={handleChange}
                  error={!!errors.stock}
                  helperText={errors.stock}
                  inputProps={{ 
                    inputMode: 'numeric', 
                    pattern: '[0-9]*' 
                  }}
                  variant="outlined"
                  sx={{
                '& .MuiInputLabel-root': { color: 'var(--blank-color)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'var(--main-color)' },
                  '&:hover fieldset': { borderColor: 'var(--main-color)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--main-color) !important' },
                  color: 'var(--blank-color)'
                },
                '& .MuiFormHelperText-root': {
                  color: 'var(--main-color)'
                }
              }}
                />
              </Grid>
            </Grid>
            
            <TextField
              margin="dense"
              name="categoria"
              label="Categoría"
              fullWidth
              value={formData.categoria}
              onChange={handleChange}
              error={!!errors.categoria}
              helperText={errors.categoria}
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { color: 'var(--blank-color)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'var(--main-color)' },
                  '&:hover fieldset': { borderColor: 'var(--main-color)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--main-color) !important' },
                  color: 'var(--blank-color)'
                },
                '& .MuiFormHelperText-root': {
                  color: 'var(--main-color)'
                }
              }}
            />
            
            <FormControl fullWidth margin="dense" variant="outlined"
            sx={{
              '& .MuiInputLabel-root': { color: 'var(--blank-color)' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'var(--main-color)' },
                '&:hover fieldset': { borderColor: 'var(--main-color)' },
                '&.Mui-focused fieldset': { borderColor: 'var(--main-color) !important' },
                color: 'var(--blank-color)'
              },
              '& .MuiSvgIcon-root': { color: 'var(--blank-color)' }
            }}>
              <InputLabel id="tipo-producto-label">Tipo de Producto</InputLabel>
              <Select
                labelId="tipo-producto-label"
                name="tipo_producto"
                value={formData.tipo_producto}
                onChange={handleChange}
                label="Tipo de Producto"
                                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: 'var(--background-color2)',
                      color: 'var(--blank-color)',
                      '& .MuiMenuItem-root': {
                        '&:hover': { backgroundColor: 'var(--main-color)' }
                      }
                    }
                  }
                }}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="videojuego">Videojuego</MenuItem>
                <MenuItem value="articulo_gaming">Artículo Gaming</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Segunda columna: URLs */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Enlaces del Producto
              </Typography>
            </Box>
            
            <TextField
              margin="dense"
              name="img_url"
              label="URL de Imagen"
              fullWidth
              value={formData.img_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { color: 'var(--blank-color)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'var(--main-color)' },
                  '&:hover fieldset': { borderColor: 'var(--main-color)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--main-color) !important' },
                  color: 'var(--blank-color)'
                },
                '& .MuiFormHelperText-root': {
                  color: 'var(--main-color)'
                }
              }}
            />
            
            <TextField
              margin="dense"
              name="trailer_url"
              label="URL del Trailer (opcional)"
              fullWidth
              value={formData.trailer_url}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=abcdefg"
              variant="outlined"
              sx={{
                '& .MuiInputLabel-root': { color: 'var(--blank-color)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'var(--main-color)' },
                  '&:hover fieldset': { borderColor: 'var(--main-color)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--main-color) !important' },
                  color: 'var(--blank-color)'
                },
                '& .MuiFormHelperText-root': {
                  color: 'var(--main-color)'
                }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{
        backgroundColor: 'var(--background-color2)',
        borderTop: '2px solid var(--main-color)',
        px: 3,
        py: 2
      }}>
        <Button onClick={onClose} sx={{ 
            color: 'var(--blank-color)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          sx={{
            backgroundColor: 'var(--main-color) !important',
            color: 'var(--blank-color)',
            '&:hover': { backgroundColor: 'var(--main-color-dark)' }
          }}
        >
          {producto ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}