const inliner = require('sass-inline-svg');

module.exports = {
    // Sass function to inline a UI Icon svg and change its path color:
    // svg-icon("16px/icon-name.svg", (path: (fill: $color)) )
    'svg-icon': inliner('../../resources/icons', {
        // run through SVGO first
        optimize: true,
        // minimal "uri" encoding is smaller than base64
        encodingFormat: "uri"
    })
};
