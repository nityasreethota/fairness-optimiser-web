// =======================================
// FAIRNESS OPTIMISER CONTROLLER
// =======================================

const pa = document.getElementById("pa");
const pb = document.getElementById("pb");

const cfn = document.getElementById("cfn");
const cfp = document.getElementById("cfp");

const multiplier =
    document.getElementById("multiplier");

const csvFile =
    document.getElementById("csvFile");

// const computeButton =
//     document.getElementById("computeButton");

const results =
    document.getElementById("results");

const jsonOutput =
    document.getElementById("jsonOutput");

const paValue = document.getElementById("paValue");
const pbValue = document.getElementById("pbValue");

const cfnValue = document.getElementById("cfnValue");
const cfpValue = document.getElementById("cfpValue");

const multiplierValue =
    document.getElementById("multiplierValue");

const downloadJson =
    document.getElementById("downloadJson");

function updateSliderValues() {

    paValue.textContent = pa.value;

    pbValue.textContent = pb.value;

    cfnValue.textContent = cfn.value;

    cfpValue.textContent = cfp.value;

    multiplierValue.textContent =
        multiplier.value;

}

[
    pa,
    pb,
    cfn,
    cfp,
    multiplier
].forEach(control => {

    control.addEventListener(
        "input",
        updateSliderValues
    );

});

updateSliderValues();
csvFile.addEventListener("change", loadCSV);

function getParameters() {

    return {

        pa: Number(pa.value),

        pb: Number(pb.value),

        cfn: Number(cfn.value),

        cfp: Number(cfp.value),

        multiplier:
            Number(multiplier.value)

    };

}



document
    .getElementById("computeButton")
    .addEventListener("click", computeResults);

function computeResults() {

    const params = getParameters();

    let result;

    if (csvLoaded) {

        result = runAnalysisFromCSV(
            uploadedData,
            params.cfn,
            params.cfp,
            params.multiplier
        );

    } else {

        result = runFullAnalysis(
            params.pa,
            params.pb,
            params.cfn,
            params.cfp,
            params.multiplier
        );

    }
    

    drawROC(result);
    drawLossChart(result);
    drawPPVChart(result);

    results.innerHTML = `

            <h3>Optimal Thresholds</h3>

            <table>

            <tr>
                <th></th>
                <th>Group A</th>
                <th>Group B</th>
            </tr>

            <tr>
                <td>Base Rate</td>
                <td>${result.pa.toFixed(2)}</td>
                <td>${result.pb.toFixed(2)}</td>
            </tr>

            <tr>
                <td>Optimal Threshold</td>
                <td>${result.optimalA.threshold.toFixed(2)}</td>
                <td>${result.optimalB.threshold.toFixed(2)}</td>
            </tr>

            <tr>
                <td>Expected Loss</td>
                <td>${result.optimalA.loss.toFixed(3)}</td>
                <td>${result.optimalB.loss.toFixed(3)}</td>
            </tr>

            <tr>
                <td>PPV</td>
                <td>${result.optimalA.metrics.ppv.toFixed(3)}</td>
                <td>${result.optimalB.metrics.ppv.toFixed(3)}</td>
            </tr>

            <tr>
                <td>TPR</td>
                <td>${result.optimalA.metrics.tpr.toFixed(3)}</td>
                <td>${result.optimalB.metrics.tpr.toFixed(3)}</td>
            </tr>

            <tr>
                <td>FPR</td>
                <td>${result.optimalA.metrics.fpr.toFixed(3)}</td>
                <td>${result.optimalB.metrics.fpr.toFixed(3)}</td>
            </tr>

            </table>

            <br>

            <h3>Chouldechova Impossibility</h3>

            <p>

            PPV(A) =
            <b>${result.ppvA.toFixed(3)}</b>

            <br><br>

            PPV(B) =
            <b>${result.ppvB.toFixed(3)}</b>

            <br><br>

            PPV Gap =
            <b>${result.ppvGap.toFixed(3)}</b>

            </p>

            `;

    jsonOutput.value =
        JSON.stringify(result, null, 2);

    // drawROC(result);
    // drawLossChart(result);

    // drawPPVChart(result);
}

// =======================================
// TAB SWITCHING
// =======================================

const tabButtons =
    document.querySelectorAll(".tab-button");

const tabContents =
    document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {

    button.addEventListener("click", () => {

        tabButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        tabContents.forEach(tab =>
            tab.classList.remove("active")
        );

        button.classList.add("active");

        document
            .getElementById(button.dataset.tab)
            .classList.add("active");

    });

});

downloadJson.addEventListener(
    "click",
    downloadJSON
);

function downloadJSON() {

    const blob = new Blob(
        [jsonOutput.value],
        {
            type: "application/json"
        }
    );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "fairness_results.json";

    a.click();

    URL.revokeObjectURL(url);

}