const express = require('express');
const users = require('./data/users.js');
const app = express();
const jwt = require('jsonwebtoken');

app.listen(3000, () => console.log('Your app listening on port 3000'))


const secretKey = ' Mi llave ultra secreta'

//const token = jwt.sign(users[1], secretKey)

//Token con fecha de expiracion
const token = jwt.sign(
  {
    exp: Math.floor(Date.now() / 1000) + 60, 
    data: users[2]
  },
  secretKey
);

app.get('/', (req, res) => {
  res.send(token) //token es sin comillas
})

app.get('/token', (req, res) => {
  const { token } = req.query;

  jwt.verify(token, secretKey, (err, data) => {
    res.send( err ? 'token invalid' : data );
  });
});

app.get('/login', (req, res) => {
  const { email, password } = req.query;

  const user = users.find((u) => u.email === email && u.password === password);

  if(user) {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 10, 
        data: user
      },
      secretKey
    );
    res.send(`
      <a href='dashboard?token=${token}'> <p> Ir al Dashboard </p> </a>

      Bienvenido, ${email},

      <script>
        localStorage.setItem('token', JSON.stringify('${token}'))
      </script>
      `);
  } else {
    res.send('Usuario o contraseña incorrecta');
  }
});

