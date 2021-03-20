const GridFsStorage=require('multer-gridfs-storage')
const Grid=require("gridfs-stream")
const path=require('path')
const crypto=require('crypto')
const multer=require('multer')
const mongoose=require("mongoose");

// Include routes
const user=require("../controllers/registration")

//Mongo URI
const db=require('../config/keys').MongoURI;
const User = require('../models/User')

let gfs,gridFSBucket;

//Create connection to Mongo DB
const conn = mongoose.createConnection(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

conn.once('open', ()=>{
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
  // Init stream
  gfs = Grid(conn.db,mongoose.mongo);
  gfs.collection("uploads");

  module.exports.gfs=gfs;
  module.exports.gridFSBucket=gridFSBucket;
  
})


// Create storage engine
const storage = new GridFsStorage({
  url:db,
  options: { useNewUrlParser: true ,useUnifiedTopology: true},
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
        
      });
    });
  }
});
const upload = multer({ storage }).single('myFile');


module.exports.upload=upload;