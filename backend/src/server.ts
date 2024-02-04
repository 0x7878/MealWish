import multer from 'multer';
import express from 'express';
import path from 'path';
import jsonServer from 'json-server';
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // append the original file extension
  }
})

const upload = multer({ storage: storage })

server.use(middlewares)


// Set up a route for file uploads
server.post('/upload', upload.single('image'), (req, res) => {
  //check if file is present
  if (!req.file) {
    return res.send(JSON.stringify({error: 'No file uploaded'}));
  }
  //send path of the file
  res.send(JSON.stringify({path: "static/" + req.file.filename}));
});

server.use('/static', express.static(path.join(__dirname, "../", 'uploads')));

server.use(router)
server.listen(8000, () => {
  console.log('JSON Server is running')
})