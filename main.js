import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}

const express = require('express');
const fs = require('fs');
const initSqlJs = require('sql.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Load or initialize the SQLite database
async function initializeDatabase() {
    const SQL = await initSqlJs();
    
    let db;
    const dbFile = 'visitorCount.db';

    if (fs.existsSync(dbFile)) {
        // Load existing database from file
        const fileBuffer = fs.readFileSync(dbFile);
        db = new SQL.Database(fileBuffer);
    } else {
        // Create new database and initialize the visitor count table
        db = new SQL.Database();
        db.run("CREATE TABLE IF NOT EXISTS visitorCount (count INTEGER)");
        db.run("INSERT INTO visitorCount (count) VALUES (0)");
        saveDatabase(db);
    }
    return db;
}

// Save the SQLite database to a file
function saveDatabase(db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync('visitorCount.db', buffer);
}

// Route to get and increment visitor count
app.get('/count', async (req, res) => {
    const db = await initializeDatabase();

    try {
        // Retrieve the current count from the database
        const result = db.exec("SELECT count FROM visitorCount LIMIT 1");
        let count = result[0].values[0][0];

        // Increment the count
        count += 1;
        db.run("UPDATE visitorCount SET count = ?", [count]);

        // Save the updated database to file
        saveDatabase(db);

        // Send the updated count back to the client
        res.json({ count });
    } catch (error) {
        console.error('Error updating count:', error);
        res.status(500).send('Error updating count');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
