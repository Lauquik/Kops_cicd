#!/bin/sh


mongoimport --host $MONGO_HOST --port $MONGO_PORT --db test --collection shoppingdatas --file /app/db/items.json --jsonArray

node /app/app.js

echo "Data imported successfully into the 'shoppingdata' collection."

