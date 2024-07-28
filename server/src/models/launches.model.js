const launchesDatabase = require("./launches.mongo");

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

function getAllLaunches() {
  return Array.from(launches.values());
}

async function saveLaunch(launch) {
  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  })
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
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
  return launches.has(launchId);
}

function deleteLaunchById(launchId) {
  const abortedLaunch = launches.get(launchId);
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
