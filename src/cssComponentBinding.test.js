import validateCss from 'css-validator';

describe('Outputs valid css', () => {
    test('', (done) => {
        validateCss({ text: '.class { background: #000 }'}, (err, data) => {
            expect(data.validity).toBe(true);
            done();
        });
    });
});