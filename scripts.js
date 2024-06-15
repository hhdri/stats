var svg, svgWidth, svgHeight, horizontalMargin, verticalMargin, xs;

function makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}
function gamma(z) {
    const g = 7;
    const p = [
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];

    if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    } else {
        z -= 1;
        let x = p[0];
        for (let i = 1; i < g + 2; i++) {
            x += p[i] / (z + i);
        }
        const t = z + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }
}

function beta(alpha, beta) {
    return gamma(alpha) * gamma(beta) / gamma(alpha + beta);
}

function betaPDFUnnormalized(x, distAlpha, distBeta) {
    if (x < 0 || x > 1) return 0;
    const numerator = Math.pow(x, distAlpha - 1) * Math.pow(1 - x, distBeta - 1);
    return numerator;
}
function betaPDF(x, distAlpha, distBeta) {
    if (x < 0 || x > 1) return 0;
    const numerator = betaPDFUnnormalized(x, distAlpha, distBeta);
    const denominator = beta(distAlpha, distBeta);
    return numerator / denominator;
}
function maxBetaPDFUnnormalized(alpha, beta) {
    if (alpha > 1 && beta > 1) {
        const mode = (alpha - 1) / (alpha + beta - 2);
        return betaPDFUnnormalized(mode, alpha, beta);
    } else {
        // Handle cases where alpha or beta are <= 1; the PDF max at endpoints 0 or 1
        return Math.max(betaPDFUnnormalized(0, alpha, beta), betaPDFUnnormalized(1, alpha, beta));
    }
}
betaTests = function () {
    console.log("Running tests");
    const epsilon = 1e-6;
    if (Math.abs(betaPDF(0.4, 2, 3) - 1.7280000000000006) > epsilon) console.error("Test 1 failed");
    else console.log("Test 1 passed");

    if (Math.abs(betaPDF(0.888, 3, 37) - 1.2784821820520697e-30) > epsilon) console.error("Test 2 failed");
    else console.log("Test 2 passed");

    if (Math.abs(betaPDF(0.888, 37, 3) - 4.778842808521972) > epsilon) console.error("Test 3 failed");
    else console.log("Test 3 passed");

    if (Math.abs(betaPDF(0.5, 147, 200) - 0.25230627071202744) > epsilon) console.error("Test 4 failed");
    else console.log("Test 4 passed");
}
function handleGraphUpdate() {
    const distAlpha = parseFloat($("#inputAlpha").val());
    const distBeta = parseFloat($("#inputBeta").val());
    const maxPDF = maxBetaPDFUnnormalized(distAlpha, distBeta);
    const ys = xs.map(x => betaPDFUnnormalized(x, distAlpha, distBeta) / maxPDF * (svgHeight - verticalMargin * 2));
    for (let i = 0; i < svgWidth - horizontalMargin * 2; i++) {
        $("#circle" + i).attr("cy", svgHeight - verticalMargin - ys[i]);
    }
}
$(document).ready(function () {
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
    const maxPDF = maxBetaPDFUnnormalized(1, 1);
    const ys1 = xs.map(x => betaPDFUnnormalized(x, 1, 1) / maxPDF * (svgHeight - verticalMargin * 2));

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
    // handleGraphUpdate();    
});
