const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Conectar a MongoDB Atlas, hellna son las 1:37 am 
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

// /usuario, obtener todo , agregar actualizar, brrar
const Usuario = mongoose.model('Usuario', new mongoose.Schema({}, { strict: false }));

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', detalle: error.message });
  }
});


app.post('/usuarios', async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.json({ mensaje: 'Usuario guardado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar usuario', detalle: error.message });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, datosActualizar, { new: true });
    if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario actualizado', usuario: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario', detalle: error.message });
  }
});

// el register d unity
app.post('/register', async (req, res) => {
  const { usuario, contrasena } = req.body;
  if (!usuario || !contrasena) return res.status(400).json({ error: 'Falta usuario o contraseña' });

  try {
    const existe = await Usuario.findOne({ usuario });
    if (existe) return res.status(409).json({ error: 'El usuario ya existe' });

    const nuevo = new Usuario({ usuario, contrasena });
    await nuevo.save();
    res.json({ mensaje: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar', detalle: err.message });
  }
});

// el login al blank
app.post('/login', async (req, res) => {
  const { usuario, contrasena } = req.body;
  if (!usuario || !contrasena) return res.status(400).json({ error: 'Falta usuario o contraseña' });

  try {
    const encontrado = await Usuario.findOne({ usuario, contrasena });
    if (!encontrado) return res.status(401).json({ error: 'Credenciales incorrectas' });

    res.json({ mensaje: 'Login exitoso', usuario: encontrado });
  } catch (err) {
    res.status(500).json({ error: 'Error en el login', detalle: err.message });
  }
});

// aviso de render para informar que el server si jala
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
