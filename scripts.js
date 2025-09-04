var domContentLoaded = false, moduleInitialized = false;
var horizontalMargin = 50, verticalMargin = 50;
var svgWidth, svgHeight, xsPtr, ysPtr, _betaPercentileDensities;

function makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}
function handleGraphUpdate() {
    const distAlpha = parseFloat(document.getElementById('inputAlpha').value);
    const distBeta  = parseFloat(document.getElementById('inputBeta').value);
    
    _betaPercentileDensities(distAlpha, distBeta, xsPtr, ysPtr);

    for (let i = 0; i <= 100; i++) {
        const currx = Module.getValue(xsPtr + i * 8, 'double');
        const curry = Module.getValue(ysPtr + i * 8, 'double');
        
        const circle = document.getElementById("percentile" + i);
        circle.setAttribute("cx",
            horizontalMargin + (svgWidth - horizontalMargin) * currx
        );
        circle.setAttribute("cy",
            svgHeight - verticalMargin - 0.1 * (svgHeight - verticalMargin) * curry
        );
    }
}

function initUI() {
    _betaPercentileDensities = Module.cwrap('betaPercentileDensities', null, ['number', 'number', 'number', 'number']);
    xsPtr = Module._malloc(101 * 8);
    ysPtr = Module._malloc(101 * 8);

    const svg = document.getElementById('plot');
    svgWidth = svg.clientWidth;
    svgHeight = svg.clientHeight;

    // x-axis
    svg.appendChild(makeSVG("line", {x1: 0, y1: svgHeight - verticalMargin, x2: svgWidth, y2: svgHeight - verticalMargin, stroke: "grey", "stroke-width": 4}));

    // y-axis
    svg.appendChild(makeSVG("line", {x1: horizontalMargin, y1: 0, x2: horizontalMargin, y2: svgHeight, stroke: "grey", "stroke-width": 4}));

    for (let i = 0; i <= 100; i++) {
        svg.appendChild(makeSVG("circle", {
            r: 2,
            fill: "green",
            id: "percentile" + i,
            style: "transition: cx 0.5s ease, cy 0.5s ease"
        }));
    }

    handleGraphUpdate();

    function debounce(fn, ms) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    }
    const debouncedUpdate = debounce(handleGraphUpdate, 25);
    inputAlpha.addEventListener('input', debouncedUpdate);
    inputBeta .addEventListener('input', debouncedUpdate);
}

function maybeInitUI() {
    if (domContentLoaded && moduleInitialized) initUI();
}

document.addEventListener('DOMContentLoaded', function () {
    domContentLoaded = true;
    maybeInitUI();
});

var Module = {
    onRuntimeInitialized: function () {
        moduleInitialized = true;
        maybeInitUI();
    }
};
