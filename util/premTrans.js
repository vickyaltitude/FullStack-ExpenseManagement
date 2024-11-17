const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let premtransSchema = new Schema({
    user_name:{
        type: String,
        required: true
    },
    order_id:{
        type: String,
    },
    payment_id:{
        type: String,
    },
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: String
    }
},{
    timestamps: { createdAt: 'createdDateTime', updatedAt: 'updatedDateTime' } 
  })


premtransSchema.virtual('localCreatedDate').get(function() {
    return this.createdDateTime.toLocaleString(); 
  });
  

  premtransSchema.virtual('localUpdatedDate').get(function() {
    return this.updatedDateTime.toLocaleString();
  });

  module.exports = mongoose.model('Premium_transaction',premtransSchema);