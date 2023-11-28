import mongoose, { Document } from "mongoose";
import { type } from "os";

interface IUser extends mongoose.Document  {
  id: string;
  username: string;
  name: string;
  email: string;
  dob: Date;
  conversations?: [
    {
      _id: mongoose.Types.ObjectId;
      createdAt: Date;
      lastMessageAt: Date;
      name: string;
      messages: [
        {
          type: mongoose.Types.ObjectId;
          ref: "Message";
          _id: mongoose.Types.ObjectId;
          createdAt: Date;
        }
      ]
    }
  ];
  messages: mongoose.Types.ObjectId[];
  seen_messages: mongoose.Types.ObjectId[];
  friend_requests: mongoose.Types.ObjectId[];
  friend_list: mongoose.Types.ObjectId[];
  image: string;
  bio: string;
  threads: mongoose.Types.ObjectId[];
  communities: mongoose.Types.ObjectId[];
  onboarded: boolean;
  createdAt: {
    type: string,
    default: string
  }
  lastMessageAt: Date
}

interface IFriendRequest extends mongoose.Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  status: {
    type: String;
    default: "pending";
    enum: ["pending", "accepted", "rejected"];
  }, 
  createdAt: {
    type: Date;
  }
}

interface IConversation  {
  _id?: string;
  createdAt: Date;
  lastMessageAt: Date;
  name: string;
  isGroup?: boolean

  messages: [
    {
      type: mongoose.Types.ObjectId;
      ref: "Message";
    }
  ],
  users: [
    {
      type: mongoose.Types.ObjectId;
      ref: "User";
    }
  ],
}

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", new mongoose.Schema<IConversation>({
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
  },
  isGroup: Boolean,
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]
}))

interface IMessage  {
  _id?: string,
  body?: string;
  image?: string;
  createdAt?: Date;
  updatedAt: {
    type: string,
    default: Date
  }
  seen: [
    {
      id: string;
      name: string;
      type: mongoose.Types.ObjectId;
      ref: "User";
    }
  ],
  sender: {
    type: mongoose.Types.ObjectId;
    ref: "User";
  } 
  conversationId: {
   type: mongoose.Types.ObjectId
  };
  senderId: mongoose.Types.ObjectId;
}

const Message = mongoose.models.Message || mongoose.model("Message", new mongoose.Schema<IMessage>({
  body: String,
  image: String,
  seen: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation"
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}))

export type { 
  IUser, 
  IFriendRequest,
  IConversation,
  IMessage
};

const FriendRequest = mongoose.models.FriendRequest || mongoose.model("FriendRequest", new mongoose.Schema<IFriendRequest>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "rejected"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}))


const userSchema = new mongoose.Schema<IUser>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  conversations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    }
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    }
  ],
  seen_messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    }
  ],
  name: {
    type: String,
    required: true,
  },
  friend_requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FriendRequest",
    }
  ],
  friend_list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
export { 
  FriendRequest,
  Message,
  Conversation
};
