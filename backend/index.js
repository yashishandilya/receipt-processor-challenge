const express = require("express");
const app = express();

const receiptData = {}
const {v4: uuidv4} = require('uuid');

function generateUniqueId() {
  return uuidv4();
}

/*
Function to calculate points from retailer name:
  1. One point for every alphanumeric character in the retailer name.
*/
function retailerName(string) {
  let len = string.length;
  let count = 0;
  // console.log("Entering the for loop");
  for (let step = 0; step < len; step++) {
    // console.log(string[step]);

    let char = string[step];

    // check if the character is alphanumeric
    if ((char >= 'a' && char <= 'z') || 
    (char >= 'A' && char <= 'Z') || 
    (char >= '0' && char <= '9')) {
      count++;
    }
  }

  return count
}

/* 
Function to calculate points w.r.t total amount:
  1. If whole number with no cents: 50 points
  2. If multiple of 0.25: 25 points
*/
function totalAmount(string){
  // parseFloat --> converts "5.00" to 5 ad "5.67" to 5.67
  let convertToNum = parseFloat(string);
  let points = 0;

  if (convertToNum % 1 == 0) {
    points += 50;
  }
  if (convertToNum % 0.25 == 0) {
    points += 25;
  }

  return points;
}

/*
Function to calculate how many pairs of items exist
  1. 5 points for every two items on the receipt
    1.1 For n items, find out n / 2; and multiply 5 for each number in pair only once!
*/
function itemPairs(itemList) {
  return 5*(Math.floor(itemList.length / 2));
}

/*
Function to calculate length of item description and perform following operations:
  1. If desc length % 3 == 0; points = item price * 0.2
*/
function lenOfDescription(itemList) {
  let len = itemList.length;
  let points = 0;

  for (let step = 0; step < len; step++) {
    let trimDescr= (itemList[step].shortDescription.trim()).length;
    if (trimDescr % 3 == 0) {
      points += Math.ceil(itemList[step].price * 0.20);
    }
  } 
  return points;
}

/*
Function to calculate time of purchase, in 24-hour format
  1. 10 points if the time of purchase is after 2:00pm/14:00 and before 4:00pm/16:00.
    1.1 It means 2:01 to 3:59 pm are valid times for this point-reward
*/
function time(string){
  let timeSplit = string.split(":");
  let hour = parseInt(timeSplit[0]);
  let minute = parseInt(timeSplit[1]);
  let points = 0;

  if (hour == 15) {
    console.log("It's 3pm or later, but def before 4pm");
    return 10;
  } 
  if (hour == 14) {
    if (minute > 0) {
      console.log("It's eyond 2:00");
      return 10;
    }
  }

  return 0;
}

// purchase day
/*
Function calculates whether the day in the date is odd or not
  1. day % 2 shouldn't be 0
*/
function isDayOdd(string) {
  let splitString = string.split("-");
  // console.log("This is how the string splits", splitString);
  if (splitString[2] % 2 != 0) {
    return 6;
  }

  return 0;
}


/*
  Function to calculate the sum of all points accumulated 
*/
function calcPoints(receipt) {
  console.log("calcPoints function was called!"); // entry point in function

  const retailerNamePoints = retailerName(receipt.retailer);
  console.log("Retailer name points:", retailerNamePoints);

  const totalAmountPoints = totalAmount(receipt.total);
  console.log("Total amount points: ", totalAmountPoints);  

  const itemPairPoints = itemPairs(receipt.items);
  console.log("Total pairs of items: ", itemPairPoints);

  const descLengthPoints = lenOfDescription(receipt.items);
  console.log("Description Length points: ", descLengthPoints);

  const timePoints = time(receipt.purchaseTime);
  console.log("The points from purchase time are: ", timePoints)

  const oddDayPoints = isDayOdd(receipt.purchaseDate);
  console.log("The points from an odd day are: ", oddDayPoints)

  return retailerNamePoints + totalAmountPoints + itemPairPoints + descLengthPoints + timePoints + oddDayPoints; 
}

/*
express.son() mounts the specified middleware function(s) at the path which is being specified
*/
app.use(express.json());
// tester functions to ensure smooth basic setup of express + docker container
app.get("/", (req, res) => {
  res.send("Hello from Yashi, this is my receipt-processor submission!");
});

app.listen(8080, () => {
  console.log("Server is running on Port 8080.");
});

app.post("/receipts/process", (req, res) => {
  const receipt = req.body;
  const receiptID = generateUniqueId();
  const points = calcPoints(receipt);

  receiptData[receiptID] = {
    receipt,
    points
  };

  res.json({"id": receiptID});
});

app.get("/receipts/:id/points", (req, res) => {
  const receiptID = req.params.id;

  if (!receiptData[receiptID]) {
    return res.status(404).json({ error: "No receipt found for that ID." });
  }

  const receiptPoints = receiptData[receiptID].points;
  console.log("The points attached to this receiptID are: ", receiptPoints);
  res.json({"points": receiptPoints})
});