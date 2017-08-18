module.exports = {
    type: 'XXXuid',
    start: '2016-12-1 00:00:00',
    end: '2020-12-1 00:00:00',
    strategy: [
        {
            name: 'https',
            percent: 1
        },
        {
            name: 'http',
            percent: 0
        }
    ],
    total: 1
};
