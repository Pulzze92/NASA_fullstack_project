const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Explanation X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true
};

saveLaunch(launch);

async function getAllLaunches() {
  return await launchesDatabase
    .find({}, {'_id': 0, '_v': 0});
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet was found!');
  }

  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launchesDatabase.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber
    })
  );
}

function existsLaunchWithId(launchId) {
  return launchesDatabase.has(launchId);
}

function deleteLaunchById(launchId) {
  const abortedLaunch = launchesDatabase.get(launchId);
  abortedLaunch.upcoming = false;
  abortedLaunch.success = false;

  return abortedLaunch;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  deleteLaunchById
};
