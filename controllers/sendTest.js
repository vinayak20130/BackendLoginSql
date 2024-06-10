const pool = require("../config/database");


exports.getAnalyticsData = async (req, res) => {
    try {
        const totalUseCaseResult = await getTotalUseCase();
        const totalSessionTimeResult = await getTotalSessionTime();
        const locationResult = await getLocationCount();
        const topPlantResult = await getTopPlant();

        res.json({
            totalUseCase: totalUseCaseResult[0].totalValue,
            totalSessionTime: totalSessionTimeResult[0].totalValue,
            locationCount: locationResult[0].totalValue,
            topPlant: topPlantResult[0].PlantName
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function getTotalUseCase() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT SUM(totalUseCase) AS totalValue FROM plant_name", (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getTotalSessionTime() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT SUM(totalSessionTime) AS totalValue FROM plant_name", (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getLocationCount() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT COUNT(totalUseCase) AS totalValue FROM plant_name", (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getTopPlant() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM plant_name ORDER BY CAST(totalSessionTime AS UNSIGNED) DESC LIMIT 1", (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}
