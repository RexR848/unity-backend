const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conectar a MongoDB Atlas
async function conectarMongo() {
  try {
    await mongoose.connect('mongodb+srv://adminunity:cetis26a2023@cetisdb-p.ppzpei7.mongodb.net/connectunity?retryWrites=true&w=majority&appName=cetisdb-p', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
  }
}
conectarMongo();

// Modelo de usuario (colección se llamará automáticamente "usuarios")
const Usuario = mongoose.model('Usuario', new mongoose.Schema({}, { strict: false }));


// Endpoint para obtener usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Endpoint para agregar usuario
app.post('/usuarios', async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.json({ mensaje: 'Usuario guardado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar usuario' });
  }
});

// Actualizar usuario por ID
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, datosActualizar, { new: true });
    if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario actualizado', usuario: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Borrar usuario por ID
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
