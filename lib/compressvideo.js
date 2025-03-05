const ffmpeg = require("fluent-ffmpeg")
const path = require("path")

module.exports = {
    compressVideo(inputPath, outputPath, callback) {
        ffmpeg(inputPath)
            .outputOptions([
                // "-c:v libx264",
                // "-preset superfast",
                // "-crf 26",
                // "-r 20",
                // "-movflags +faststart",
                // "-vf scale=640:360",
                // "-c:a aac",
                // "-b:a 96k",
                // "-threads 4"

                "-c:v libx264",  // Video codec
                "-preset ultrafast",  // Faster encoding (use "ultrafast" if needed)
                "-crf 28",  // Adjust quality for faster compression
                "-movflags +faststart",  // Optimize for web streaming
                "-vf scale=-2:360",  // Resize to 360p while keeping aspect ratio
                "-c:a aac",  // Audio codec
                "-b:a 96k",  // Lower audio bitrate for speed
                "-threads 8",  // Multi-threading
                "-tune fastdecode"  // Optimize for fast decoding
            ])
            .save(outputPath)
            .on("end", () => {
                console.log("Compression finished:", outputPath);
                callback(null, outputPath)
            })
            .on("error", (err) => {
                console.error("Error compressing video:", err);
                callback(err, null); 
            });
    }
}