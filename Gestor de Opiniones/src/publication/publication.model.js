import mongoose from "mongoose";

const publicationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
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
export default mongoose.model('publication',publicationSchema)