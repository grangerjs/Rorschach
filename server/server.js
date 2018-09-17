require('dotenv').config({path: '../.env'});

const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const expressApp = express();
const router = express.Router();

const API_PORT = process.env.PORT || 3001;

expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());

mongoose.connect(process.env.REACT_APP_MERN_API_ADDRESS, { useNewUrlParser: true });

const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    name: String,
    text: String,
    inkId: { type: Number },
    date: { type: Date }
},{ collection: 'rorschach' });
var Comment = mongoose.model('Comment', CommentSchema);

expressApp.use('/api', router);

router.get('/comments/:inkId', (req, res) => {
    const { inkId } = req.params;
    Comment.find({inkId: inkId}, (err, comment) => {
        if(err) console.log(err);
        return res.json({ data: comment });
    });
});

router.post('/comments/:inkId', (req, res) => {
    const comment = new Comment();
    const { name, text, inkId } = req.body;
    
    comment.name = name;
    comment.text = text;
    comment.inkId = inkId;

    comment.save(err => {
        if(err) console.log(err);
        return res.json({ success: true });
    });
});

expressApp.listen(API_PORT, () =>{
    console.log(`Listening on port ${API_PORT}`);
});
