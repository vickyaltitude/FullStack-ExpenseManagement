const mongoose = require('mongoose');

const Schema = mongoose.Schema ;

const expDetailsSchema = Schema({
    amount: {
        type: Number,
    required: true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    user_id :{
        type: Schema.Types.ObjectId,
        ref : 'User',
        required: true
    }
},{
    timestamps: { createdAt: 'createdDateTime' } 
  })

  expDetailsSchema.virtual('localCreatedDate').get(function() {
    return this.createdDateTime.toLocaleString();
  });

  module.exports = mongoose.model('Expense',expDetailsSchema);