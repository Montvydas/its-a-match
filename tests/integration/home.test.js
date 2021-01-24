const request = require('supertest');
let server;

describe('/', () => {
    beforeEach(() => { server = require('../../index').default; });
    afterEach(() => { server.close() });

    describe('GET /', () => {
        it('should return some text about using API', async () => {
            const res = await request(server).get('/');
            expect(res.status).toBe(200);
            expect(res.text).toMatch(/.*api\/levels.*/);
        });
    });
});