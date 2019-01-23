const express = require('express');
const port = process.env.PORT | 3000;
//multer module is for uploading files like images
const multer = require('multer'); 
//body parser used to parse the data
const bodyParser = require('body-parser');

//starting an express application
const app = express();
app.get('/',(req,res)=>{
    res.send(`server started on port:${port}`);
});
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
     filename: (req, file, callback) =>{
      req.newFileName = new Date().toISOString() + file.originalname;
      callback(null, req.newFileName);
    }
  });

  //setting multer to accept the image format files
  const fileFilter = (req, file, callback) => {
    // reject a file if it is not matching this format
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };

  // stores in uploads folder
  const upload = multer({
    storage: storage,
    limits: {
        //restricting limits to 1024*1024
      fileSize: 1024 * 1024 
    },
    fileFilter: fileFilter
  });
  //allows static files to be accessed publicly available
app.use('/uploads',express.static('uploads'));

//To direct the image to be uploaded in to given directory
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));

//body parser parses the url encoded and json data in proper format

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//giving CORS(Cross Origin Resource Sharing) permissions to anyone who requests to these end points
app.use((req,res,next)=>{
    //* will give access to any origin
 res.header('Access-Control-Allow-Origin','*');
//  res.header('Access-Control-Allow-Origin','Origin,X-Requested-With,Content-Type,Accept');
//  if(req.method === 'OPTIONS'){
//      res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
//      return res.status(200).json({});
//  }
 next();
});


  //this method allows you to upload single image using multer
app.post('/convert',upload.single('image'),(req,res)=>{

})
//listening to the port
app.listen(port,()=>{
    console.log(`server started on port:${port}`)
});