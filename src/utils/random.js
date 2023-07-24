module.exports = {
    randomInt: function(min, max) {
        min = Math.round(min);
        max = Math.round(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
};
