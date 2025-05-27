import React, { useState, useEffect } from 'react';
import { User, Edit2, Save, X, Mail, Phone, MapPin, FileText } from 'lucide-react';

// Simulación del cliente Supabase - reemplaza con tu configuración real
const supabase = {
  auth: {
    getUser: () => Promise.resolve({
      data: { user: { id: 'user123', email: 'usuario@ejemplo.com' } },
      error: null
    })
  },
  from: (table) => ({
    select: () => ({
      eq: (field, value) => ({
        single: () => Promise.resolve({
          data: {
            id: 'user123',
            nombre: 'Juan Pérez',
            correo: 'juan.perez@ejemplo.com',
            direccion: 'Calle Principal 123',
            telefono: '+1234567890',
            tipo: 'premium',
            apellido: 'Pérez'
          },
          error: null
        })
      })
    }),
    update: (data) => ({
      eq: (field, value) => Promise.resolve({
        data: { ...data },
        error: null
      })
    })
  })
};

const ConfiguracionUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Cargar datos del usuario
  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      setLoading(true);
      
      // Obtener usuario autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        setError('Error de autenticación');
        return;
      }

      if (!user) {
        setError('Usuario no autenticado');
        return;
      }

      // Obtener datos del usuario de la tabla
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (error) {
        setError('Error al cargar los datos del usuario');
        console.error('Error:', error);
        return;
      }

      setUsuario(data);
      setFormData(data);
      
    } catch (err) {
      setError('Error inesperado al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const guardarCambios = async () => {
    try {
      setGuardando(true);
      setError('');
      setMensaje('');

      const { data, error } = await supabase
        .from('usuarios')
        .update({
          nombre: formData.nombre,
          correo: formData.correo,
          direccion: formData.direccion,
          telefono: formData.telefono,
          apellido: formData.apellido
        })
        .eq('auth_user_id', usuario.auth_user_id);

      if (error) {
        setError('Error al guardar los cambios');
        console.error('Error:', error);
        return;
      }

      setUsuario(formData);
      setEditando(false);
      setMensaje('Datos actualizados correctamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(''), 3000);

    } catch (err) {
      setError('Error inesperado al guardar');
      console.error('Error:', err);
    } finally {
      setGuardando(false);
    }
  };

  const cancelarEdicion = () => {
    setFormData(usuario);
    setEditando(false);
    setError('');
  };

  // Estilos inline para evitar dependencias externas
  const styles = {
    configuracionUsuario: {
      maxWidth: '48rem',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '16rem'
    },
    loadingContent: {
      textAlign: 'center'
    },
    spinner: {
      animation: 'spin 1s linear infinite',
      borderRadius: '50%',
      height: '3rem',
      width: '3rem',
      border: '2px solid transparent',
      borderBottomColor: '#2563eb',
      margin: '0 auto 1rem auto'
    },
    loadingText: {
      color: '#4b5563'
    },
    errorContainer: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '0.5rem',
      padding: '1.5rem'
    },
    errorContent: {
      display: 'flex',
      alignItems: 'center'
    },
    errorIcon: {
      height: '1.25rem',
      width: '1.25rem',
      color: '#f87171',
      marginRight: '0.5rem'
    },
    errorText: {
      color: '#991b1b'
    },
    header: {
      background: 'linear-gradient(to right, #2563eb, #9333ea)',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '0.5rem 0.5rem 0 0'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    headerIcon: {
      height: '2rem',
      width: '2rem'
    },
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      lineHeight: '2rem',
      margin: 0
    },
    headerSubtitle: {
      color: '#dbeafe',
      margin: 0
    },
    btnEdit: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.2s',
      border: 'none',
      color: 'white',
      cursor: 'pointer'
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem'
    },
    btnSave: {
      backgroundColor: '#16a34a',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.2s',
      border: 'none',
      color: 'white',
      cursor: 'pointer'
    },
    btnCancel: {
      backgroundColor: '#dc2626',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.2s',
      border: 'none',
      color: 'white',
      cursor: 'pointer'
    },
    btnIcon: {
      height: '1rem',
      width: '1rem'
    },
    messageSuccess: {
      backgroundColor: '#f0fdf4',
      borderLeft: '4px solid #4ade80',
      padding: '1rem',
      margin: '1rem 1.5rem 0 1.5rem',
      borderRadius: '0.25rem'
    },
    messageSuccessText: {
      color: '#166534',
      margin: 0
    },
    messageError: {
      backgroundColor: '#fef2f2',
      borderLeft: '4px solid #f87171',
      padding: '1rem',
      margin: '1rem 1.5rem 0 1.5rem',
      borderRadius: '0.25rem'
    },
    messageErrorText: {
      color: '#991b1b',
      margin: 0
    },
    formContainer: {
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    formGrid: {
      display: 'grid',
      gap: '1.5rem'
    },
    formGrid2: {
      display: 'grid',
      gap: '1.5rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    fieldLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151'
    },
    fieldIcon: {
      height: '1rem',
      width: '1rem',
      marginRight: '0.5rem'
    },
    inputField: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    textareaField: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      resize: 'vertical',
      minHeight: '4rem',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    readonlyField: {
      padding: '0.5rem 0.75rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      color: '#374151',
      margin: 0
    },
    accountInfoSection: {
      borderTop: '1px solid #e5e7eb',
      paddingTop: '1.5rem'
    },
    sectionTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1rem'
    },
    accountGrid: {
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
    },
    accountTypeBadge: {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    badgePremium: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    badgeBasic: {
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    userId: {
      fontFamily: 'monospace',
      fontSize: '0.875rem',
      wordBreak: 'break-all'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorContent}>
          <X style={styles.errorIcon} />
          <p style={styles.errorText}>{error || 'No se encontraron datos del usuario'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.configuracionUsuario}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerInfo}>
            <User style={styles.headerIcon} />
            <div>
              <h2 style={styles.headerTitle}>Configuración de Usuario</h2>
              <p style={styles.headerSubtitle}>Gestiona tu información personal</p>
            </div>
          </div>
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              style={styles.btnEdit}
            >
              <Edit2 style={styles.btnIcon} />
              <span>Editar</span>
            </button>
          ) : (
            <div style={styles.buttonGroup}>
              <button
                onClick={guardarCambios}
                disabled={guardando}
                style={{
                  ...styles.btnSave,
                  backgroundColor: guardando ? '#4ade80' : '#16a34a',
                  cursor: guardando ? 'not-allowed' : 'pointer'
                }}
              >
                <Save style={styles.btnIcon} />
                <span>{guardando ? 'Guardando...' : 'Guardar'}</span>
              </button>
              <button
                onClick={cancelarEdicion}
                disabled={guardando}
                style={{
                  ...styles.btnCancel,
                  backgroundColor: guardando ? '#f87171' : '#dc2626',
                  cursor: guardando ? 'not-allowed' : 'pointer'
                }}
              >
                <X style={styles.btnIcon} />
                <span>Cancelar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mensajes */}
      {mensaje && (
        <div style={styles.messageSuccess}>
          <p style={styles.messageSuccessText}>{mensaje}</p>
        </div>
      )}

      {error && (
        <div style={styles.messageError}>
          <p style={styles.messageErrorText}>{error}</p>
        </div>
      )}

      {/* Formulario */}
      <div style={styles.formContainer}>
        {/* Información básica */}
        <div style={styles.formGrid2}>
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <User style={styles.fieldIcon} />
              Nombre
            </label>
            {editando ? (
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                style={styles.inputField}
                placeholder="Ingresa tu nombre"
              />
            ) : (
              <p style={styles.readonlyField}>{usuario.nombre || 'No especificado'}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <FileText style={styles.fieldIcon} />
              Apellido
            </label>
            {editando ? (
              <input
                type="text"
                value={formData.apellido || ''}
                onChange={(e) => handleInputChange('apellido', e.target.value)}
                style={styles.inputField}
                placeholder="Ingresa tu apellido"
              />
            ) : (
              <p style={styles.readonlyField}>{usuario.apellido || 'No especificado'}</p>
            )}
          </div>
        </div>

        {/* Información de contacto */}
        <div style={styles.formGrid}>
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <Mail style={styles.fieldIcon} />
              Correo Electrónico
            </label>
            {editando ? (
              <input
                type="email"
                value={formData.correo || ''}
                onChange={(e) => handleInputChange('correo', e.target.value)}
                style={styles.inputField}
                placeholder="correo@ejemplo.com"
              />
            ) : (
              <p style={styles.readonlyField}>{usuario.correo || 'No especificado'}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <Phone style={styles.fieldIcon} />
              Teléfono
            </label>
            {editando ? (
              <input
                type="tel"
                value={formData.telefono || ''}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                style={styles.inputField}
                placeholder="+1234567890"
              />
            ) : (
              <p style={styles.readonlyField}>{usuario.telefono || 'No especificado'}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <MapPin style={styles.fieldIcon} />
              Dirección
            </label>
            {editando ? (
              <textarea
                value={formData.direccion || ''}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                style={styles.textareaField}
                placeholder="Ingresa tu dirección completa"
              />
            ) : (
              <p style={styles.readonlyField}>{usuario.direccion || 'No especificado'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionUsuario;