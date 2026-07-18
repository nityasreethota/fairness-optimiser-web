let rocChart = null;

function drawROC(result) {

    const ctx = document
        .getElementById("rocChart")
        .getContext("2d");

    if (rocChart) {
        rocChart.destroy();
    }

    rocChart = new Chart(ctx, {

        type: "scatter",

        data: {

            datasets: [

                {
                    label: "Group A",

                    type: "line",

                    data: result.rocA.fpr.map(
                        (x, i) => ({
                            x,
                            y: result.rocA.tpr[i]
                        })
                    ),

                    tension: 0.25
                },

                {
                    label: "Group B",

                    type: "line",

                    data: result.rocB.fpr.map(
                        (x, i) => ({
                            x,
                            y: result.rocB.tpr[i]
                        })
                    ),

                    tension: 0.25
                },

                {
                    label: "Random",

                    type: "line",

                    data: [

                        {x:0,y:0},
                        {x:1,y:1}

                    ]
                }

            ]

        },

        options: {

            responsive:true,

            scales:{

                x:{
                    min:0,
                    max:1,
                    title:{
                        display:true,
                        text:"False Positive Rate"
                    }
                },

                y:{
                    min:0,
                    max:1,
                    title:{
                        display:true,
                        text:"True Positive Rate"
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

                {

                    label: "Group A",

                    data: result.lossA,

                    borderWidth: 2,

                    fill: false

                },

                {

                    label: "Group B",

                    data: result.lossB,

                    borderWidth: 2,

                    fill: false

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "top"

                }

            },

            scales: {

                x: {

                    title: {

                        display: true,

                        text: "Threshold"

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
    console.log("Drawing PPV chart");

    const ctx =
        document
            .getElementById("ppvChart")
            .getContext("2d");

    if (ppvChart)
        ppvChart.destroy();

    const labels = [];
    const values = [];

    for (let p = 0.05; p <= 0.95; p += 0.02) {

        labels.push(p.toFixed(2));

        values.push(
            ppvFromBayes(
                0.1,
                0.1,
                p
            )
        );

    }

    ppvChart = new Chart(ctx, {

        type: "line",

        data: {

            labels,

            datasets: [

                {

                    label: "PPV",

                    data: values

                }

            ]

        }

    });

}