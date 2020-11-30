const { format } = require("morgan")

let dbName = "on-memory-neurotechnologies"
let collectionName = "omn-readers"

function getCookie(req,name) {
  const value = `; ${req.headers.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Currently, the database submits a single unique object
// whenever a user presses the 'down' button when scrolling.
// These objects simply only an _id generated by mongoDB, and 
// no updates are being made based on an individual user's submissions.
// Result: Going through the article once and submitting feedback submits 
// over a dozen objects to the database without any way to determine who it came from,
// nor is there currently a way to return meaningful user data to data back to project


const submitAllFeedback = async (req, res) => {
  let data = req.body;
  data['userId'] =   getCookie(req,'userId')
  let destination = req.app.get('mongo_client').db(dbName).collection(collectionName)

  try {
    let doc = await destination.find(
         { userId :  data['userId'] }
    );

    if (doc['_id'] != undefined){
      destination.find({"_id": doc['_id']}).updateOne(data)
      console.log('updating old submission')
      return res.send(`User has been initialized. Submission has been received.`);
    } else {
      console.log('inserting new submission')
      await destination.insertOne(data);
      return res.send(`User has been initialized. Submission has been received.`);
    }
  } catch (error) {
    console.log('error');
    console.log(error);
  }
};

module.exports = {
  submitAllFeedback: submitAllFeedback
}; 
