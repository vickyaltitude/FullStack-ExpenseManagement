const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let passwordResSchema = new Schema({
    UUid:{
        type: String,
        required: true
    },
    user_id:{
        type: Schema.Types.ObjectId,
        refer: 'User',
        required: true
    },
    isactive:{
        type: Boolean,
        
    }
})

module.exports = mongoose.model('Passwordresetschema',passwordResSchema);