import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trime: true,
        minlength: 3
    },
    email : {
        type: String,
        required:true,
        unique: true,
        trime: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
      },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });
  
  userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
  
  const User = mongoose.model('User', userSchema);
  
export default User;