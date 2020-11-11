const db = require("../models");
const cloudinary = require('cloudinary');
const Image = db.image;
const { QueryTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const Op = db.Sequelize.Op;



exports.uploadImage = (req, res) => {
  console.log("uploadImage");
  const imageFiles = Object.values(req.files);
  if (!imageFiles || imageFiles.length == 0) {
    res.status(500).send("No image uploaded");
    return;
  }
  let imageFile = imageFiles[0];
  console.log(JSON.stringify(imageFile));
  // TODO - could there be duplicate id's? Sounds unlikely, but maybe use key generator service?
  let newImageId =  uuidv4();

  cloudinary.v2.uploader.upload(imageFile.path,
    {
      resource_type: "image", public_id: `recipes/${newImageId}`,
      overwrite: true
    },
    function (error, result) {
      console.log(result, error);
      if (error) {
        res.status(500).send(error);
      } else {
        Image.create(
          {
            fileName: imageFile.name,
            fileSize: imageFile.size,
            fileType: imageFile.type,
            imageUuid: newImageId,
            userId: req.userId,
            url: result.url
          }
        ).then(image => {
          res.status(200).send(image);
        }).catch( err => {
          res.status(500).send({ message: err.message });
        });
      };
    }
  );
};
