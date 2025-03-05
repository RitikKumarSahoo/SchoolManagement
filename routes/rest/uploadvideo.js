const { uploadFile } = require("../../lib/aws")
const { compressVideo } = require("../../lib/compressvideo")
const fs = require("fs")



module.exports = {
    // async uploadVideoToS3(req, res) {
    //     try {
    //         if (!req.file) {
    //             return res.status(400).json({ error: "No file uploaded!" })
    //         }

    //         const videoPath = req.file.path
    //         const outputFilePath = `compressed_${req.file.originalname}`
    //         console.log("-------",outputFilePath)
    //         compressVideo(videoPath, outputFilePath, res)

    //         return res.status(200).json({ error: false })
    //     } catch (error) {
    //         return res.status(500).json({ error: "Internal Server Error" })
    //     }
    // }
    async uploadVideoToS3(req, res) {
        try {
            if (!req.file) {
              return res.status(400).json({ error: "No file uploaded!" });
            }
      
            const videoPath = req.file.path;
            const outputFilePath = `compressed_${req.file.originalname}`
            console.log("Compressing video to:", outputFilePath)
      
            compressVideo(videoPath, outputFilePath, async (err, compressedPath) => {
              if (err) {
                return res.status(500).json({ error: "Error compressing video" });
              }
      
              console.log("Video compression complete:", compressedPath);
      
              res.status(200).json({
                error: false,
                message: "Video compressed successfully",
                compressedPath: compressedPath, // Return path or S3 URL
              });
            });
          } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
          }
    },
}