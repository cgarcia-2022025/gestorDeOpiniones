import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    publication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        required: true
    },
    text: {
        type: String,
        required: true
    }
    
})

//pre mongoose
                            //pluralizar
export default mongoose.model('comment',commentSchema)