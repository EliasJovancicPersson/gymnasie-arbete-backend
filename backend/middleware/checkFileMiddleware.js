const maxFileSize = 26214400;
const array_of_allowed_files = ["pdf"];

const CheckFiles = (req, res, next) => {
	if (req.files["pdf"]) {
		//check files
		req.files["pdf"].forEach((file) => {
			console.log(file);
			//check file type
			const fileType = file.originalname
				.split(".")
				.pop()
				.toString()
				.toLowerCase();
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
