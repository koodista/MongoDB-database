const { MongoClient } = require('mongodb')

async function main() {
    const uri = "mongodb+srv://KK:KK1234@cluster0.kk30mmg.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();

        await findJourneysWithMinimumDuration(client, {
            minimumDuration: 10,
            maximumNumberOfResults: 5
        })

        //await findOnejourneyByName(client, 165);

        // await createJourney(client, {
        //     departure: "2022-05-30T11:58:35.000+00:00",
        //     return: "2022-05-30T12:01:23.000+00:00",
        //     departureStationId: 999,
        //     departureStationName: "Levi",
        //     returnStationId: 999,
        //     returnStationName: "Levi",
        //     distance: 1111,
        //     duration: 1111,
        // })

    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
    
}

main().catch(console.error);

async function findJourneysWithMinimumDuration(client, {
    minimumDuration = 15,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
    const cursor = client.db("Solita").collection("202105").find({
        duration: { $gte: minimumDuration}
    }).sort({ duration: -1 })
        .limit(maximumNumberOfResults);

    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`Found journeys with at least ${minimumDuration} :`);
        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. journey: ${result._id}`);
            console.log(`depstaname: ${result.departureStationName}`);
            console.log(`   duration: ${result.duration}`);
            //console.log(`   bathrooms: ${result.bathrooms}`);
            //console.log(`   most recent review date: ${date}`);
        });
    } else {
        console.log(`No journeys found with at least ${minimumDuration}`);
    }
} 



async function findOnejourneyByName(client, durationOfJourney) {
    const result = await client.db("Solita").collection("202105").findOne({duration: durationOfJourney});

    if (result) {
        console.log(`Found a journey with the duration ${durationOfJourney}`);
        console.log(result);
    } else {
        console.log(`No journey found with the duration of ${durationOfJourney}`)
    }

}

async function createJourney(client, newJourney) {
    const result = await client.db("Solita").collection("202105").insertOne(newJourney);

    console.log(`New journey created with the following id: ${result.insertedId}`);

}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}

