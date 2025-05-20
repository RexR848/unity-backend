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
const Usuario = mongoose.model('Usuario', {
  nombre: String,
  puntuacion: Number
});

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
