require('dotenv').config();
const express = require('express');
const port = process.env.PORT | 3000;
//multer module is for uploading files like images
const multer = require('multer'); 
const Image = require('./model/image');
const path=require('path');
const DBURL = process.env.DBURL;
//javascript image manipulation module to convert the image
const Jimp = require('jimp'),
    fs = require('fs'),
    url = require('url');

//body parser used to parse the data
const bodyParser = require('body-parser');
//mongoose module interacts with mongoDb database we can acces the database and write schemas in mongoose.
const mongoose = require('mongoose');
//to connect to the database
mongoose.connect(DBURL,{useNewUrlParser: true})
//removing deprecation warnings 
mongoose.Promise = global.Promise;

//starting an express application
const app = express();

//setting view engine to ejs
app.set("view engine","ejs");

app.get('/',(req,res)=>{
   
    res.render('index');

});
app.get('/upload',(req,res)=>{
    res.render('upload');

});
app.get('/preview',(req,res)=>{
   
  res.render('preview')
});
app.get('/display',(req,res)=>{
       // the url to parse the requested url and get the image name
     const query = url.parse(req.url,true).query;
     const  pic = query.image;
 
    //read the image using fs and send the image content back in the response
    fs.readFile('./public/convertedImages/gallery.jpg',(err, content)=> {
        if (err) {
            console.log(err);
            res.end("No such image");    
        } else {
            //specify the content type in the response will be an image
            res.end(content);
        }
    });
    res.render('display');

});
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
app.use('/public/convertedImages', express.static(path.join(__dirname, 'public/convertedImages')));

  //this method allows you to upload single image using multer
app.post('/upload',upload.single('image'),(req, res) => {
    console.log('entered')
    const image = new Image ({
        _id : new mongoose.Types.ObjectId(),
        title : req.body.title,
        image : req.newFileName,
     });
    
    image
    .save()

    .then(result => {
        Jimp.read('./public/uploads/'+image.image)
        .then(photo => {
          return photo
            .resize(755, 450, Jimp.RESIZE_BEZIER) // resize
            .write('./public/convertedImages/horizontal.jpg'); // save
        })
        .catch(err => {
          console.error(err);
        });
        Jimp.read('./public/uploads/'+image.image)
        .then(photo => {
          return photo
            .resize(365, 450, Jimp.RESIZE_BEZIER) // resize
            .write('./public/convertedImages/vertical.jpg'); // save
        })
        .catch(err => {
          console.error(err);
        });
        Jimp.read('./public/uploads/'+image.image)
        .then(photo => {
          return photo
            .resize(365, 212, Jimp.RESIZE_BEZIER) // resize
            .write('./public/convertedImages/horizontal-small.jpg'); // save
        })
        .catch(err => {
          console.error(err);
        });
        Jimp.read('./public/uploads/'+image.image)
        .then(photo => {
          return photo
            .resize(380, 380, Jimp.RESIZE_BEZIER) // resize
            .write('./public/convertedImages/gallery.jpg'); // save
        })
        .catch(err => {
          console.error(err);
        });
        console.log(result);
        res.redirect('preview')
    
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});
//listening to the port
app.listen(port,()=>{
    console.log(`server started on port:${port}`)
});