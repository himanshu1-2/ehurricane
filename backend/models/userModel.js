const mongoose =  require('mongoose');
const bcrypt =  require('bcryptjs');
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      required: true,
      default: 'user',
    },
    isAdmin: {
      type: Boolean,
     required: true,
      default: false,
    },
     shippingAddress: { address:{type:String}, city: {type:String}, postalCode: {type:String}, mobile: {type:String} },
     fcmToken: {
       type: String,
     },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Keep isAdmin in sync with role for backward compatibility
userSchema.pre('save', function (next) {
  if (this.role === 'admin') this.isAdmin = true;
  else if (this.isModified('role')) this.isAdmin = false;
  next();
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

 module.exports=User;
