import multer from 'multer';
import jsonServer from 'json-server';
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(8000, () => {
  console.log('JSON Server is running')
})

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Set up a route for file uploads
server.post('/upload', upload.single('image'), (req, res) => {
  res.send('File uploaded successfully');
});