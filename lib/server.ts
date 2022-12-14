import * as express from 'express';
import * as zlib from 'zlib';
import { pipeline } from 'stream';
import { promisify } from 'util';

const app = express();
const sleep = promisify(setTimeout);

app.post('/device/v2/:uuid/log-stream', async (req, res) => {
	pipeline(req, zlib.createGunzip(), process.stdout, (err) => {
		if (err) {
			console.error(err);
		}
	});

	await sleep(5 * 1000);
	while (!req.closed) {
		// write a single byte every 10 seconds
		res.write(Buffer.alloc(1, 1));
		await sleep(10 * 1000);
	}
});

app.listen(3000, () => {
	console.log(`Log streamer listening on port 3000`);
});
