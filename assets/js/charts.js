let rocChart = null;

function drawROC(result) {

    const ctx =
        document
            .getElementById("rocChart")
            .getContext("2d");

    if (rocChart)
        rocChart.destroy();

    rocChart = new Chart(ctx, {

        type: "scatter",

        data: {

            datasets: [

                // ROC curves

                {
                    label: "Group A - Under-represented Group - ROC",
                    type: "line",
                    data: result.rocA.fpr.map((x, i) => ({
                        x,
                        y: result.rocA.tpr[i]
                    })),
                    borderColor: "#2196f3",
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.25
                },

                {
                    label: "Group B - Majority Group - ROC",
                    type: "line",
                    data: result.rocB.fpr.map((x, i) => ({
                        x,
                        y: result.rocB.tpr[i]
                    })),
                    borderColor: "#ff5c8a",
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.25
                },

                // Random classifier

                {
                    label: "Random",
                    type: "line",
                    borderDash: [6,6],
                    borderColor: "#999",

                    pointRadius: 0,

                    data: [
                        {x:0,y:0},
                        {x:1,y:1}
                    ]
                },

                // Current Interactive A

                {
                    label: "Group A (Interactive)",

                    type: "scatter",

                    pointStyle: "circle",

                    radius: 8,

                    backgroundColor: "#1565c0",

                    borderColor: "white",

                    borderWidth: 2,

                    data: [{

                        x: result.interactive.groupA.metrics.fpr,

                        y: result.interactive.groupA.metrics.tpr

                    }]
                },

                // Theorem A

                {
                    label: "Group A (Theorem)",

                    type: "scatter",

                    pointStyle: "star",

                    radius: 16,

                    backgroundColor: "#00c853",

                    borderColor: "#00701a",

                    borderWidth: 2,

                    data: [{

                        x: result.theorem.groupA.metrics.fpr,

                        y: result.theorem.groupA.metrics.tpr

                    }]
                },

                // Current Interactive B

                {
                    label: "Group B (Interactive)",

                    type: "scatter",

                    pointStyle: "circle",

                    radius: 8,

                    backgroundColor: "#c2185b",

                    borderColor: "white",

                    borderWidth: 2,

                    data: [{

                        x: result.interactive.groupB.metrics.fpr,

                        y: result.interactive.groupB.metrics.tpr

                    }]
                },

                // Theorem B

                {
                    label: "Group B (Theorem)",

                    type: "scatter",

                    pointStyle: "star",

                    radius: 16,

                    backgroundColor: "#76ff03",

                    borderColor: "#2e7d32",

                    borderWidth: 2,

                    data: [{

                        x: result.theorem.groupB.metrics.fpr,

                        y: result.theorem.groupB.metrics.tpr

                    }]
                }

            ]

        },

        options: {

            responsive: true,

            animation: false,

            plugins: {

                title: {

                    display: true,

                    text: "ROC Curves (Interactive Configuration vs Theorem Optimum)"

                }

            },

            scales: {

                x: {

                    min: 0,
                    max: 1,

                    title: {

                        display: true,

                        text: "False Positive Rate"

                    }

                },

                y: {

                    min: 0,
                    max: 1,

                    title: {

                        display: true,

                        text: "True Positive Rate"

                    }

                }

            }

        }

    });

}

let lossChart = null;

function drawLossChart(result) {

    const ctx = document
        .getElementById("lossChart")
        .getContext("2d");

    if (lossChart)
        lossChart.destroy();

    lossChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: result.rocA.thresholds.map(
                t => t.toFixed(2)
            ),

            datasets: [

                // Group A loss curve
                {

                    label: "Group A Loss",

                    data: result.lossA,

                    borderWidth: 2,

                    fill: false,

                    tension: 0.25

                },

                // Group B loss curve
                {

                    label: "Group B Loss",

                    data: result.lossB,

                    borderWidth: 2,

                    fill: false,

                    tension: 0.25

                },

                // Interactive Configuration
                {

                    label: "Group A (Interactive)",

                    type: "scatter",

                    data: [{

                        x: result.interactive.groupA.threshold,

                        y: result.interactive.groupA.loss

                    }],

                    pointRadius: 9,

                    pointHoverRadius: 11,

                    pointBackgroundColor: "#1565c0",

                    pointBorderColor: "black",

                    pointBorderWidth: 2,

                    showLine: false

                },
                {

                    label: "Group A (Theorem)",

                    type: "scatter",

                    data: [{

                        x: result.theorem.groupA.threshold,

                        y: result.theorem.groupA.loss

                    }],

                    pointRadius: 12,
                    pointHoverRadius: 12,

                    pointStyle: "star",

                    pointBackgroundColor: "#00c853",
                    pointBorderColor: "black",
                    pointBorderWidth: 3,

                    showLine: false

                },
                {

                    label: "Group B (Interactive)",

                    type: "scatter",

                    data: [{

                        x: result.interactive.groupB.threshold,

                        y: result.interactive.groupB.loss

                    }],

                    pointRadius: 9,

                    pointBackgroundColor: "#ad1457",

                    pointBorderColor: "black",

                    pointBorderWidth: 2,

                    showLine: false

                },
                {

                    label: "Group B (Theorem)",

                    type: "scatter",

                    data: [{

                        x: result.theorem.groupB.threshold,

                        y: result.theorem.groupB.loss

                    }],

                    pointRadius: 12,
                    pointStyle: "star",

                    pointBackgroundColor: "#ffe600",
                    pointBorderColor: "#000",
                    pointBorderWidth: 2,

                    showLine: false

                }

            ]

        },

        options: {

            responsive: true,

            animation: false,

            plugins: {

                title: {

                    display: true,

                    text:
                    "Expected Loss (Interactive Configuration vs Theorem Optimum)"

                },

                legend: {

                    position: "top"

                }

            },

            scales: {

                x: {

                    type: "linear",

                    min: 0,

                    max: 1,

                    title: {

                        display: true,

                        text: "Decision Threshold"

                    }

                },

                y: {

                    title: {

                        display: true,

                        text: "Expected Loss"

                    }

                }

            }

        }

    });

}

let ppvChart = null;

function drawPPVChart(result) {

    const ctx =
        document
            .getElementById("ppvChart")
            .getContext("2d");

    if (ppvChart)
        ppvChart.destroy();

    const labels = [];

    const currentA = [];
    const currentB = [];

    const theoremA = [];
    const theoremB = [];

    for (let p = 0.05; p <= 0.95; p += 0.02) {

        labels.push(p.toFixed(2));

        currentA.push(
            ppvFromBayes(
                result.interactive.groupA.metrics.fpr,
                result.interactive.groupA.metrics.tpr,
                p
            )
        );

        currentB.push(
            ppvFromBayes(
                result.interactive.groupB.metrics.fpr,
                result.interactive.groupB.metrics.tpr,
                p
            )
        );

        theoremA.push(
            ppvFromBayes(
                result.theorem.groupA.metrics.fpr,
                result.theorem.groupA.metrics.tpr,
                p
            )
        );

        theoremB.push(
            ppvFromBayes(
                result.theorem.groupB.metrics.fpr,
                result.theorem.groupB.metrics.tpr,
                p
            )
        );

    }

    // Current base-rate indices

    const idxA =
        Math.round((result.pa - 0.05) / 0.02);

    const idxB =
        Math.round((result.pb - 0.05) / 0.02);

    ppvChart = new Chart(ctx, {

        type: "line",

        data: {

            labels,

            datasets: [

                {

                    label: "Group A (Interactive)",

                    data: currentA,

                    borderColor: "#1976d2",

                    pointRadius: 0,

                    tension: 0.25

                },

                {

                    label: "Group B (Interactive)",

                    data: currentB,

                    borderColor: "#ff5c8a",

                    pointRadius: 0,

                    tension: 0.25

                },

                // Interactive dots

                {

                    label: "Group A Current",

                    type: "scatter",

                    pointStyle: "circle",

                    radius: 8,

                    backgroundColor: "#1565c0",

                    borderColor: "white",

                    borderWidth: 2,

                    data: [{

                        x: labels[idxA],

                        y: currentA[idxA]

                    }]

                },

                {

                    label: "Group B Current",

                    type: "scatter",

                    pointStyle: "circle",

                    radius: 8,

                    backgroundColor: "#c2185b",

                    borderColor: "white",

                    borderWidth: 2,

                    data: [{

                        x: labels[idxB],

                        y: currentB[idxB]

                    }]

                },

                // Theorem stars

                {

                    label: "Group A Theorem",

                    type: "scatter",

                    pointStyle: "star",

                    radius: 16,

                    backgroundColor: "#00c853",

                    borderColor: "#00701a",

                    borderWidth: 2,

                    data: [{

                        x: labels[idxA],

                        y: theoremA[idxA]

                    }]

                },

                {

                    label: "Group B Theorem",

                    type: "scatter",

                    pointStyle: "star",

                    radius: 16,

                    backgroundColor: "#76ff03",

                    borderColor: "#2e7d32",

                    borderWidth: 2,

                    data: [{

                        x: labels[idxB],

                        y: theoremB[idxB]

                    }]

                }

            ]

        },

        options: {

            responsive: true,

            animation: false,

            plugins: {

                title: {

                    display: true,

                    text: "PPV Curves (Interactive Configuration vs Theorem Optimum)"

                }

            },

            scales: {

                x: {

                    title: {

                        display: true,

                        text: "Base Rate"

                    }

                },

                y: {

                    min: 0,

                    max: 1,

                    title: {

                        display: true,

                        text: "Positive Predictive Value"

                    }

                }

            }

        }

    });

}