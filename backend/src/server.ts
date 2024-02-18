import multer from 'multer';
import express from 'express';
import path from 'path';
import jsonServer from 'json-server';

const env = process.env.NODE_ENV || 'development';
console.log('env:', env);
const addonConfigPath = '/config';
const localPath = '.'; 

const dataPath = env === 'production' ? addonConfigPath : localPath;
console.log('dataPath:', dataPath);

const server = jsonServer.create();
const router = jsonServer.router(dataPath + '/db.json');
const middlewares = jsonServer.defaults();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dataPath + '/uploads'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

server.set('trust proxy', true);
server.use(middlewares);
// Set up a route for file uploads
server.post('/upload', upload.single('image'), (req, res) => {
  // Check if file is present
  if (!req.file) {
    return res.send(JSON.stringify({error: 'No file uploaded'}));
  }
  // Send path of the file
  res.send(JSON.stringify({path: "static/" + req.file.filename}));
});

// Serve static files from the uploads directory
server.use('/static', express.static(path.join(dataPath, 'uploads')));
const port = process.env.PORT || 3000;
server.use(router);
server.listen(port, () => {
  console.log('JSON Server is running on port ' + port);
});
