import AWS from "aws-sdk";
import { performQuery } from ".";

const insertPanoQuery = `INSERT INTO panoramas (url, date, request_id) VALUES ($1, $2, $3) RETURNING id`;

const s3 = new AWS.S3({
	endpoint: process.env.SPACES_ENDPOINT,
	accessKeyId: process.env.SPACES_ID,
	secretAccessKey: process.env.SPACES_KEY
});

export async function savePano(requestId, panoURL) {
	const values = [panoURL, new Date(), requestId];
	const [pano] = await performQuery(insertPanoQuery, values);
	return pano;
}

export async function getUploadURL(name, type) {
	const params = JSON.parse(event.body);
	const url = await s3.getSignedUrl("putObject", {
		Bucket: process.env.SPACES_BUCKET,
		Key: name,
		ContentType: type,
		ACL: "public-read"
	});
	return {
		statusCode: 200,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "http://localhost:3000",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
			"Access-Control-Allow-Methods": "OPTIONS, POST, GET"
		},
		body: JSON.stringify({ url }, null, 2)
	};
}
