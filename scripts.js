var svg, svgWidth, svgHeight, horizontalMargin, verticalMargin, xs;
var _betaPDF;

function makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}
betaTests = function () {
    console.log("Running tests!");
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
    const distAlpha = parseFloat($("#inputAlpha").val());
    const distBeta = parseFloat($("#inputBeta").val());
    const maxPDF = _betaPDFAtMode(distAlpha, distBeta);
    const ys = xs.map(x => _betaPDF(x, distAlpha, distBeta) / maxPDF * (svgHeight - verticalMargin * 2));
    for (let i = 0; i < svgWidth - horizontalMargin * 2; i++) {
        $("#circle" + i).attr("cy", svgHeight - verticalMargin - ys[i]);
    }
}
function initUI() {
    _betaPDF = Module.cwrap('betaPDF', 'number', ['number', 'number', 'number']);
    _betaPDFAtMode = Module.cwrap('betaPDFAtMode', 'number', ['number', 'number']);

    betaTests();

    svg = $("#plot");
    svgWidth = svg.width();
    svgHeight = svg.height();

    horizontalMargin = 50;
    verticalMargin = 50;

    // x-axis
    svg.append(
        makeSVG(
            "line",
            {
                x1: 0,
                y1: svgHeight - verticalMargin,
                x2: svgWidth,
                y2: svgHeight - verticalMargin,
                stroke: "grey",
                "stroke-width": 4
            }
        )
    );

    // y-axis
    svg.append(
        makeSVG(
            "line",
            {
                x1: horizontalMargin,
                y1: 0,
                x2: horizontalMargin,
                y2: svgHeight,
                stroke: "grey",
                "stroke-width": 4
            }
        )
    );

    xs = Array.from({ length: (svgWidth - horizontalMargin * 2) }, (_, i) => i / (svgWidth - horizontalMargin * 2));
    const maxPDF = _betaPDFAtMode(1, 1);
    const ys1 = xs.map(x => _betaPDF(x, 1, 1) / maxPDF * (svgHeight - verticalMargin * 2));

    for (let i = 0; i < svgWidth - horizontalMargin * 2; i++) {
        svg.append(
            makeSVG(
                "circle",
                {
                    cx: i + horizontalMargin,
                    cy: svgHeight - verticalMargin - ys1[i],
                    r: 2,
                    fill: "green",
                    id: "circle" + i,
                    style: "transition: cy 1s ease"
                }
            )
        );
    }
    $("#inputAlpha").on("change", handleGraphUpdate);
    $("#inputBeta").on("change", handleGraphUpdate);

}


var Module = {
    onRuntimeInitialized: function () {
        $(document).ready(function () {
            initUI();
        });
    }
};