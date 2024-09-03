const express = require('express');
const router = express.Router();
const getWhiteboardModel = require('./whiteboardModel.js')

router.post('/save', (req, res) => {
    const { data, collectionName } = req.body; 
    console.log('trying to save', collectionName)

    const Whiteboard = getWhiteboardModel(collectionName);

    Whiteboard.findOneAndUpdate({id: data.id , taskID: data.taskID}, data, {
        new: true,
        upsert: true // Make this update into an upsert
      })
        .then(() => {
            res.status(200).json({ msg: 'Data saved successfully' });
            console.log('good')
        })
        .catch((error) => {
            res.status(500).json({ msg: 'Sorry, internal server errors', error: error.message });
            console.log('not good ', error)
        });

});

router.get('/whiteboard', (req, res) => {

    const { taskID, collectionName } = req.query;
    console.log(taskID, "server", collectionName)
    if (!taskID || !collectionName) {
        return res.status(400).json({ msg: 'Missing taskID or collection name' });
    }

    const Whiteboard = getWhiteboardModel(collectionName);
    
    Whiteboard.find({ taskID: taskID })
        .then((whiteboardData) => {
            if (!whiteboardData || whiteboardData.length === 0) {
                console.log("no whiteboards found with task id")
                return res.status(404).json({ msg: 'No whiteboards found with the given taskID' });
            }
            console.log('all good here!')
            res.status(200).json(whiteboardData);
        })
        .catch((error) => {
            console.log('internal err ', error)
            res.status(500).json({ msg: 'Sorry, internal server errors', error: error.message });
        });
});

router.delete('/delete', (req, res) => {
    const {taskID, id, collectionName} = req.body

    const Whiteboard = getWhiteboardModel(collectionName);
    console.log('deleting something here')
    if(!taskID || !id || !collectionName) {
        console.log('bad', taskID, id, collectionName)
        return // bad response
    }
    
    Whiteboard.deleteOne({ taskID: taskID, id: id})
        .then((result) => {
            if(result.deletedCount === 0){
                console.log('nothing found to delete')
                return
            }
            console.log('deleted from db!')
        })
        .catch((error) => {
            console.log('internal error deleting ', error)
        });
})

module.exports = router