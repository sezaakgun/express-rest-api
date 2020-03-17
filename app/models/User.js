import { Schema, model } from 'mongoose';
import { isEmail } from 'validator';

const userSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [isEmail, 'Invalid Email Address']
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  state: {
    type: Number,
    default: 0
  }
});

export default model('User', userSchema);
