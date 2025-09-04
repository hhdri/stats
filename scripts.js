var domContentLoaded = false;
var moduleInitialized = false;
var svg, svgWidth, svgHeight, horizontalMargin, verticalMargin, xs;
var _betaPDF, _betaPDFAtMode, _betaPDFVector;

function makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}
betaTests = function () {
    console.log("Running tests 22!");
    const epsilon = 1e-10;
    if (Math.abs(_betaPDF(0.4, 2, 3) - 1.7280000000000006) > epsilon) console.error("Test 1 failed");
    else console.log("Test 1 passed");

    if (Math.abs(_betaPDF(0.888, 3, 37) - 1.2784821820520697e-30) > epsilon) console.error("Test 2 failed");
    else console.log("Test 2 passed");

    if (Math.abs(_betaPDF(0.888, 37, 3) - 4.778842808521972) > epsilon) console.error("Test 3 failed");
    else console.log("Test 3 passed");

    if (Math.abs(_betaPDF(0.5, 147, 200) - 0.25230627071202744) > epsilon) console.error("Test 4 failed");
    else console.log("Test 4 passed");
}
function handleGraphUpdate() {
    const distAlpha = parseFloat(document.getElementById('inputAlpha').value);
    const distBeta = parseFloat(document.getElementById('inputBeta').value);
    const maxPDF = _betaPDFAtMode(distAlpha, distBeta);
    
    const xsPtr = Module._malloc(xs.length * 8);
    const ysPtr = Module._malloc(xs.length * 8);
    
    for (let i = 0; i < xs.length; i++) {
        Module.setValue(xsPtr + i * 8, xs[i], 'double');
    }
    
    _betaPDFVector(xsPtr, xs.length, distAlpha, distBeta, ysPtr);
    
    const ys = [];
    for (let i = 0; i < xs.length; i++) {
        const pdfValue = Module.getValue(ysPtr + i * 8, 'double');
        ys[i] = pdfValue / maxPDF * (svgHeight - verticalMargin * 2);
    }
    
    Module._free(xsPtr);
    Module._free(ysPtr);

    for (let i = 0; i < svgWidth - horizontalMargin * 2; i++) {
        const circle = document.getElementById("circle" + i);
        if (circle) {
            circle.setAttribute("cy", svgHeight - verticalMargin - ys[i]);
        }
    }
}

function initUI() {
    _betaPDF = Module.cwrap('betaPDF', 'number', ['number', 'number', 'number']);
    _betaPDFAtMode = Module.cwrap('betaPDFAtMode', 'number', ['number', 'number']);
    _betaPDFVector = Module.cwrap('betaPDFVector', null, ['number', 'number', 'number', 'number', 'number']);

    betaTests();

    svg = document.getElementById('plot');
    svgWidth = svg.clientWidth;
    svgHeight = svg.clientHeight;

    horizontalMargin = 50;
    verticalMargin = 50;

    // x-axis
    svg.appendChild(makeSVG("line", {x1: 0, y1: svgHeight - verticalMargin, x2: svgWidth, y2: svgHeight - verticalMargin, stroke: "grey", "stroke-width": 4}));

    // y-axis
    svg.appendChild(makeSVG("line", {x1: horizontalMargin, y1: 0, x2: horizontalMargin, y2: svgHeight, stroke: "grey", "stroke-width": 4}));

    xs = Array.from({ length: (svgWidth - horizontalMargin * 2) }, (_, i) => i / (svgWidth - horizontalMargin * 2));

    for (let i = 0; i < svgWidth - horizontalMargin * 2; i++) {
        svg.appendChild(makeSVG("circle", {cx: i + horizontalMargin, cy: svgHeight - verticalMargin - 1, r: 2, fill: "green", id: "circle" + i, style: "transition: cy 1s ease"}));
    }

    handleGraphUpdate()

    document.getElementById('inputAlpha').addEventListener('change', handleGraphUpdate);
    document.getElementById('inputBeta').addEventListener('change', handleGraphUpdate);
}

function maybeInitUI() {
    if (domContentLoaded && moduleInitialized) {
        initUI();
    }
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
