const moongose = require ('mongoose');
const Ads = require('./models/ads');

module.exports = {
    getAds: async(req, res) => {
        let ads = await Ads.find();
        res.json({ads});
    }
}