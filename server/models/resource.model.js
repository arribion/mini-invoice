import mongooose from "mongoose";

const resourceSchema = mongooose.Schema(
  {
        projectID: {
        type:String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
  },
  { timeStamp: true },
);

//    projectId: ObjectId,