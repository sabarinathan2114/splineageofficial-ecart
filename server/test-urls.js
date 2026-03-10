import http from 'http';
import https from 'https';

const urls = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'http://localhost:5000/uploads/image-1772616874053.jpg'
];

const checkUrl = (url) => {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            console.log(`${url}: ${res.statusCode}`);
            resolve();
        }).on('error', (err) => {
            console.log(`${url}: ERROR - ${err.message}`);
            resolve();
        });
    });
};

const run = async () => {
    for (const url of urls) {
        await checkUrl(url);
    }
};

run();
