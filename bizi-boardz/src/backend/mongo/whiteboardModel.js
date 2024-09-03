const mongoose = require('mongoose');

const whiteboardSchema = new mongoose.Schema({
    taskID: String,
    id: String,
    type: String,
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,
    text: { type: String, default: "" }, // Optional field with default value
    roughElement: mongoose.Schema.Types.Mixed // Can be anything
}, { strict: false }); // 'strict: false' allows the schema to accept fields not defined in the schema

const getWhiteboardModel = (collectionName = 'defaultCollection') => {
    
    const modelName = `Whiteboard_${collectionName}`;

    if (!mongoose.models[modelName]) { // check if collection exists with their repoURL
        mongoose.model(modelName, whiteboardSchema, collectionName); // if not create one
        
    }
    return mongoose.models[modelName]; // else return the model with the repoURL
};


module.exports = getWhiteboardModel;