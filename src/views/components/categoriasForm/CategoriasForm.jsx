import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormHelperText
} from '@mui/material';

export default function CategoriasForm({ open, onClose, categoria, onSave }) {
  const [formData, setFormData] = useState({ nombre: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (categoria) {
      setFormData({ nombre: categoria.nombre || '' });
    } else {
      setFormData({ nombre: '' });
    }
    setErrors({});
  }, [categoria, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'var(--background-color2)',
          color: 'var(--blank-color)',
          borderRadius: '12px',
        }
      }}
    >
      <DialogTitle sx={{
        backgroundColor: 'var(--background-color2)',
        color: 'var(--blank-color)',
        borderBottom: '2px solid var(--main-color)',
        fontWeight: 'bold',
        py: 2,
        fontSize: '1.2rem'
      }}>
        {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
      </DialogTitle>
      
      <DialogContent dividers sx={{ 
        backgroundColor: 'var(--background-color2)',
        pt: 3
      }}>
        <TextField
          autoFocus
          fullWidth
          name="nombre"
          label="Nombre de la categoría"
          value={formData.nombre}
          onChange={handleChange}
          error={!!errors.nombre}
          variant="outlined"
          sx={{
            '& .MuiInputLabel-root': { 
              color: 'var(--blank-color)',
              '&.Mui-focused': {
                color: 'var(--main-color) !important',
              }
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'var(--main-color)' },
              '&:hover fieldset': { borderColor: 'var(--main-color)' },
              '&.Mui-focused fieldset': { 
                borderColor: 'var(--main-color) !important',
              },
              '&.Mui-focused .MuiOutlinedInput-input': {
                color: 'var(--main-color) !important',
              },
              color: 'var(--blank-color)'
            },
            '& .MuiFormHelperText-root': {
              color: 'var(--main-color)'
            }
          }}
        />
        {errors.nombre && (
          <FormHelperText error sx={{ color: 'var(--main-color)', ml: 1 }}>
            {errors.nombre}
          </FormHelperText>
        )}
      </DialogContent>
      
      <DialogActions sx={{
        backgroundColor: 'var(--background-color2)',
        borderTop: '2px solid var(--main-color)',
        px: 3,
        py: 2
      }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: 'var(--blank-color)',
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.1)' 
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          sx={{
            backgroundColor: 'var(--main-color) !important',
            color: 'var(--blank-color)',
            '&:hover': { 
              backgroundColor: 'var(--main-color-dark)' 
            }
          }}
        >
          {categoria ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}