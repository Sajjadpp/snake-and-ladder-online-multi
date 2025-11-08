const mongoose = require('mongoose');

const VALID_AVATARS = [
  '😀','😎','🤓','😇',
  '🤠','🥳','🤖','👽',
  '😺','🧙‍♂️','🧑‍🎤','🧑‍🚀',
  '🧑‍💻','🧑‍🍳','🧑‍🎓','🧑‍🚒',
  '🧑‍🚀','🧑‍⚖️','🧑‍🏫','🧑‍💼',
];

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{10}$/, "Invalid mobile number"],
    },
    avatar: {
      type: String,
      validate: {
        validator: function(v) {
          console.log(VALID_AVATARS.includes(v))
          return VALID_AVATARS.includes(v);
        },
        message: props => `${props.value} is not a valid avatar!`
      }
    },
    password: {
      type: String,
      required: true,
    },
    coins: {
      type: Number,
      default: 250,
    },
    dailyRewards: {
      currentStreak: {
        type: Number,
        default: 1,
      },
      currentCycle: {
        type: Number, 
        default: 1,
      },
      lastClaimed: {
        type: Date,
      }
    }
  },
  { timestamps: true } 
);

// Pre-save hook to generate the custom ID
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    try {
      let count = await mongoose.model("User").countDocuments();
      const isExist = await mongoose.model('User').findOne({id: `USER_${count + 1}`});
      if(isExist){
        console.log(isExist,'exist')
        console.log(Math.random())
        count += Math.floor(Math.random() * 100 -1)+1;
        this.id = `USER_${count}`
        console.log(count);
      }
      else{

        this.id = `USER_${count + 1}`;
      }
      next()
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;