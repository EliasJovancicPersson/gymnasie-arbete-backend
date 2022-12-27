const maxFileSize = 26214400;
const array_of_allowed_files = ["png", "jpeg", "jpg", "gif"];

const CheckFiles = (req, res, next) => {
  if (req.files) {
    //check files
    req.files.forEach((file) => {
      //check file type
      const fileType = file.originalname
        .split(".")
        .pop()
        .toString()
        .toLowerCase();
      console.log(fileType + (fileType == "png"));
      if (!array_of_allowed_files.includes(fileType)) {
        //wrong format, send error response
        throw new Error("FILE-FORMAT");
      }

      if (file.size > maxFileSize) {
        //to big, send error response
        throw new Error("FILE-SIZE");
      }
    });
  }
  next();
};

module.exports = { CheckFiles };
