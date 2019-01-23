const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required : true
        
    }
    

});

module.exports = mongoose.model("Image", imageSchema);