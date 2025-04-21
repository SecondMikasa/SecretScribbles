import mongoose from "mongoose";

type ConnectionObject = {
    // optional (not sure aayegi yah nhi) but agar aayegi toh number format me hi
    isConnected?: number
}

const connection: ConnectionObject = {}

// void here signify not caring about the type of data being returned
async function dbConnect(): Promise<void> {
    // To prevent database choking by establishing multiple connections
    if (connection.isConnected) {
        console.log("Connection to database has already being established")
        return
    }
    try {
        const connectionString = process.env.MONGO_URI
        if (!connectionString) {
            console.log("Please verify the Database Connection string and try again")
            return
        }

        const db = await mongoose.connect(connectionString)
        // console.log("db :", db)

        connection.isConnected = db.connections[0].readyState
        // console.log("db.connections :", db.connections)

        console.log("Database has been connected succesfully")

    }
    catch (error) {
        console.log("Connection to Database has failed to establish", error)

        process.exit(1)
    }
}

export default dbConnect