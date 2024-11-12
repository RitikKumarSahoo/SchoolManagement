

module.exports ={
    async getScrapData(req,res){
        const {url} = req.body
        const axios = require("axios");
        const { data } = await axios.get(url);
        return res.json({error:false,data})
    }
}