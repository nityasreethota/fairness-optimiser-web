// =======================================
// FAIRNESS OPTIMISER CONTROLLER
// =======================================

// =====================================
// PROJECT CONFIGURATION
// =====================================

const projectConfig = {

    chronosig: {

        name: "CHRONOSIG",

        exampleCSV:
            "assets/data/chronosig/chronosig_predictions.csv",

        benchmark:
            "assets/data/chronosig/model_benchmark_CHRONOSIG.csv",

        colour: "#1976d2",

        figures: {

            roc:
                "assets/images/chronosig/roc_analysis_bayesian.png",

            threshold:
                "assets/images/chronosig/threshold_optimisation_CHRONOSIG.png",

            benchmark:
                "assets/images/chronosig/model_benchmark_CHRONOSIG.png",

            shap:
                "assets/images/chronosig/shap_analysis.png",
            fairness: 
                "assets/images/chronosig/fairness_metrics.png",

            permutation: 
                "assets/images/chronosig/permutation_importance.png"

        }

    },

    camhs: {

        name: "CAMHS",

        exampleCSV:
            // "assets/data/camhs/synthetic_camhs_data.csv",
            "assets/data/camhs/camhs_predictions.csv",

        benchmark:
            "assets/data/camhs/model_benchmark_CAMHS.csv",
        colour: "#2e7d32",

        figures: {

            roc:
                "assets/images/camhs/roc_analysis_bayesian_CAMHS.png",

            threshold:
                "assets/images/camhs/threshold_optimisation_CAMHS.png",

            benchmark:
                "assets/images/camhs/model_benchmark_CAMHS.png",

            shap:
                "assets/images/camhs/shap_analysis_CAMHS.png",

            fairness:
                "assets/images/camhs/fairness_metrics_CAMHS.png",

            permutation:
                "assets/images/camhs/permutation_importance_CAMHS.png"

        }

    }

};

const projectDescriptions = {

    camhs: {

        title: "NHS CAMHS Referral Optimisation",

        description:
        "Optimising referral decisions for Child and Adolescent Mental Health Services using Bayesian decision theory.",

        groupA:
        "Young carers, looked-after children, estranged families and other under-represented patients whose clinical history may be incomplete. These patients are at greater risk of being overlooked despite genuine clinical need.",

        groupB:
        "Patients with richer clinical information including parent observations, completed questionnaires and previous clinical history. Predictions are generally more reliable for this group.",

        sliders: {

            pa: "Group A Prevalence - Bayesian Prior (PA)",

            pb: "Group B Prevalence - Bayesian Prior (PB)",

            fnc: "Cost of Missing a Child Who Needs CAMHS - False Negative Cost (CFN)",

            fpc: "Cost of an Unnecessary CAMHS Referral - False Possitive Cost (CFN)",

            cm: "Equity Weight for Group A - Protected Group Cost Multiplier (PPV)",

            paTooltip:
            "Estimated proportion of under-represented children who genuinely require CAMHS assessment.",

            pbTooltip:
            "Estimated proportion of children with complete clinical information who genuinely require CAMHS assessment.",

            fncTooltip:
            "How harmful is it to miss a child who genuinely needs CAMHS? Higher values prioritise identifying vulnerable children, reducing delayed treatment and safeguarding risks.",

            fpcTooltip:
            "How harmful is an unnecessary CAMHS referral? Higher values reduce unnecessary assessments, helping preserve limited NHS appointments and reduce waiting times.",

            cmTooltip:
            "Increase the importance of avoiding missed referrals for the under-represented group. Higher values encourage the optimiser to prioritise vulnerable children."

        }

    },

    chronosig: {

        title: "CHRONOSIG Community Mental Health Triage",

        description:
        "Optimising referral decisions from free-text clinical referrals using Bayesian fairness optimisation.",

        groupA:
        "Patients whose referral information is sparse, incomplete or less representative, increasing uncertainty in automated risk prediction.",

        groupB:
        "Patients with richer referral information, allowing the model to make more confident predictions.",


        sliders: {

            pa: "Group A Prevalence - Bayesian Prior (PA)",

            pb: "Group B Prevalence  - Bayesian Prior (PB)",

            fnc: "Cost of Missing a Patient Requiring Secondary Care - False Negative Cost (CFN)",

            fpc: "Cost of an Unnecessary Referral - False Possitive Cost (CPN)",

            cm: "Equity Weight for Group A - Protected Group Cost Multiplier (PPV)",

            paTooltip:
            "Estimated proportion of under-represented referrals that genuinely require secondary mental health services.",

            pbTooltip:
            "Estimated proportion of referrals with complete information that genuinely require secondary mental health services.",

            fncTooltip:
            "How harmful is it to miss a patient who genuinely requires specialist mental health care? Higher values prioritise reducing missed referrals.",

            fpcTooltip:
            "How harmful is an unnecessary referral? Higher values reduce unnecessary referrals, preserving clinician capacity and reducing waiting lists.",

            cmTooltip:
            "Increase the importance of avoiding missed referrals for the under-represented group during optimisation."

        }

    }

};

let currentProject = "chronosig";

const projectSelect =
    document.getElementById("projectSelect");

projectSelect.addEventListener(
    "change",
    function () {

        currentProject = this.value;
        // loadResearchFigures(project);
        console.log(
            "Project:",
            currentProject
        );
        loadResearch(currentProject);
        csvLoaded = false;

        prepareCSVData();
        

    }
);

function getProject() {

    return projectConfig[currentProject];

}

function updateClinicalContext() {

    const p = projectDescriptions[currentProject];

    document.getElementById("projectTitle").textContent =
        p.title;

    document.getElementById("projectDescription").textContent =
        p.description;

    document.getElementById("groupADescription").textContent =
        p.groupA;

    document.getElementById("groupBDescription").textContent =
        p.groupB;



    document.getElementById("GroupABaseRateDescription").textContent =
        p.sliders.pa;
    document.getElementById("GroupBBaseRateDescription").textContent =
        p.sliders.pb;

    document.getElementById("FalseNegativeCostDescription").textContent =
        p.sliders.fnc;

    document.getElementById("FalsePositiveCostDescription").textContent =
        p.sliders.fpc;
    document.getElementById("GroupACostMultiplierDescription").textContent =
        p.sliders.cm;



    
    // document.getElementById("GroupABaseRateTooltip").textContent =
    //     p.sliders.paTooltip;
    // document.getElementById("GroupBBaseRateTooltip").textContent =
    //     p.sliders.pbTooltip;

    // document.getElementById("FalseNegativeCostTooltip").textContent =
    //     p.sliders.fncTooltip;

    // document.getElementById("FalsePositiveCostTooltip").textContent =
    //     p.sliders.fpcTooltip;
    // document.getElementById("GroupACostMultiplierTooltip").textContent =
    //     p.sliders.cmTooltip;

    

}

// const project = getProject();
// project.exampleCSV

// project.benchmark

// project.figures.roc

async function loadExampleDataset() {

    const project = getProject();
    updateClinicalContext();

    const response = await fetch(project.exampleCSV);

    const text = await response.text();

    const data = parseCSV(text);

    uploadedData = data;

    prepareCSVData(data);

    csvLoaded = true;

    computeResults();

}

projectSelect.addEventListener(
    "change",
    async function () {

        // currentProject = this.value;
        csvLoaded = false;
        await loadExampleDataset();
        // loadResearch(currentProject);
        // await loadResearchFigures(project);
        

        // prepareCSVData();
        computeResults();

    }
);

// old

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
    document.getElementById("comparisonTab");

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

let computeTimer;

[
    pa,
    pb,
    cfn,
    cfp,
    multiplier
].forEach(control => {

    control.addEventListener("input", () => {

        updateSliderValues();

        clearTimeout(computeTimer);

        computeTimer = setTimeout(() => {

            computeResults();

        }, 100);

    });

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



// document
//     .getElementById("computeButton")
//     .addEventListener("click", computeResults);

function computeResults() {

    const params = getParameters();

    let result;

    if (csvLoaded) {

        // result = runAnalysisFromCSV(
        //     uploadedData,
        //     params.cfn,
        //     params.cfp,
        //     params.multiplier
        // );

        result = runFullAnalysis(
                params.pa,
                params.pb,
                params.cfn,
                params.cfp,
                params.multiplier,
                scoresA,
                labelsA,
                scoresB,
                labelsB
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
    console.log("debug params");
    console.log(params);
    console.log("debug results");
    console.log(result);
console.log(result.interactive.groupA);
console.log(result.theorem.groupA);
   
    drawROC(result);
    drawLossChart(result);
    drawPPVChart(result);

    document.getElementById("impactThresholdACurrent").textContent =
    result.interactive.groupA.threshold.toFixed(3);

    document.getElementById("impactThresholdATheorem").textContent =
    result.theorem.groupA.threshold.toFixed(3);

    const cfnA = params.cfn * params.multiplier;
    console.log("cfnA:", cfnA)
    // Group A
    const currentReferA =
        result.interactive.groupA.metrics.tp +
        result.interactive.groupA.metrics.fp;

    const currentMissA =
        result.interactive.groupA.metrics.fn;

    const currentLoss =
        result.summary.currentLoss;
    
    const currentLossA =
        params.cfn * result.interactive.groupA.metrics.fn +
        params.cfp  * result.interactive.groupA.metrics.fp;

    const theoremLossA =
        cfnA * result.theorem.groupA.metrics.fn +
        params.cfp  * result.theorem.groupA.metrics.fp;

    
    const theoremReferA =
        result.theorem.groupA.metrics.tp +
        result.theorem.groupA.metrics.fp;

    const theoremMissA =
        result.theorem.groupA.metrics.fn;
    

    const theoremLoss =
        result.summary.theoremLoss;

    const lossReductionA =
        100 *
        (currentLossA - theoremLossA) /
        currentLossA;

    const lossSavedA =
    currentLossA - theoremLossA;



    // Group B
    const currentReferB =
        result.interactive.groupB.metrics.tp +
        result.interactive.groupB.metrics.fp;

    const currentMissB =
        result.interactive.groupB.metrics.fn;

    const currentLossB =
        params.cfn * result.interactive.groupB.metrics.fn +
        params.cfp  * result.interactive.groupB.metrics.fp;

    const theoremLossB =
        params.cfn * result.theorem.groupB.metrics.fn +
        params.cfp  * result.theorem.groupB.metrics.fp;

    const theoremReferB =
        result.theorem.groupB.metrics.tp +
        result.theorem.groupB.metrics.fp;

    const theoremMissB =
        result.theorem.groupB.metrics.fn;
    // percentage losss redution
    const lossReductionB =
        100 *
        (currentLossB - theoremReferB) /
        currentLossB;
    // loss reduction 
    const lossSavedB =
        currentLossB - theoremLossB;
    // document.getElementById("impactTheoremRefer").textContent =
    //     theoremReferA;

    // document.getElementById("impactTheoremMiss").textContent =
    //     theoremMissA;

    // document.getElementById("impactTheoremLoss").textContent =
    //     theoremLoss.toFixed(1);

    // Card 3 — Improvement
    const extraPatientsA =
        theoremReferA - currentReferA;

    const fewerMissedA =
        currentMissA - theoremMissA;

    // const lossReduction =
    //     100 *
    //     (currentLoss - theoremLoss) /
    //     currentLoss;

    const extraPatientsB =
        theoremReferB - currentReferB;

    const fewerMissedB =
        currentMissB - theoremMissB;

    

    // document.getElementById("impactExtra").textContent =
    //     (extraPatients>=0?"+":"") + extraPatients;

    // document.getElementById("impactReduced").textContent =
    //     (fewerMissed>=0?"−":"+") + Math.abs(fewerMissed);

    // document.getElementById("impactLossReduction").textContent =
    //     lossReduction.toFixed(1)+"%";

    //Card 4 — Service Impact
    const totalCurrent =
        result.interactive.groupA.metrics.tp +
        result.interactive.groupA.metrics.fp +
        result.interactive.groupB.metrics.tp +
        result.interactive.groupB.metrics.fp;

    const totalTheorem =
        result.theorem.groupA.metrics.tp +
        result.theorem.groupA.metrics.fp +
        result.theorem.groupB.metrics.tp +
        result.theorem.groupB.metrics.fp;


    const lossSaved =
        currentLoss - theoremLoss;
    // document.getElementById("impactQueue").textContent =
    //     totalCurrent + " → " + totalTheorem;
    //     // ppv
    // document.getElementById("impactPPV").textContent =
    //     result.summary.theoremPPVGap.toFixed(3);
    // // Threshods
    // document.getElementById("impactThresholds").textContent =
    //     result.theorem.groupA.threshold.toFixed(2)
    //     + " / " +
    //     result.theorem.groupB.threshold.toFixed(2);

    // // impact 2
    

    // 

    // document.getElementById("impactCurrentReferB").textContent =
    //     currentReferB;

    // document.getElementById("impactCurrentMissB").textContent =
    //     currentMissB;

    // document.getElementById("impactTheoremReferB").textContent =
    //     theoremReferB;

    // document.getElementById("impactTheoremMissB").textContent =
    //     theoremMissB;

    // // Card 3 - Improvement
    // // const extraPatients =
    // //     (theoremReferA + theoremReferB) -
    // //     (currentReferA + currentReferB);

    // // const fewerMissed =
    // //     (currentMissA + currentMissB) -
    // //     (theoremMissA + theoremMissB);

    // // const lossReduction =
    // //     100 *
    // //     (result.summary.currentLoss -
    // //     result.summary.theoremLoss) /
    // //     result.summary.currentLoss;

    // // //Card 4 - const totalCurrent =
    // //     currentReferA + currentReferB;

    // // const totalTheorem =
    // //     theoremReferA + theoremReferB;

    // document.getElementById("impactQueue").textContent =
    //     totalCurrent + " → " + totalTheorem;

    // document.getElementById("impactPPV").textContent =
    //     result.summary.theoremPPVGap.toFixed(3);

    // Group A
    document.getElementById("impactThresholdACurrent").textContent =
    result.interactive.groupA.threshold.toFixed(2);

    document.getElementById("impactThresholdATheorem").textContent =
    result.theorem.groupA.threshold.toFixed(2);

    document.getElementById("impactReferralACurrent").textContent =
    currentReferA;

    document.getElementById("impactReferralATheorem").textContent =
    theoremReferA;

    document.getElementById("impactMissedACurrent").textContent =
    currentMissA;

    document.getElementById("impactMissedATheorem").textContent =
    theoremMissA;

    // Group B
    document.getElementById("impactThresholdBCurrent").textContent =
    result.interactive.groupB.threshold.toFixed(2);

    document.getElementById("impactThresholdBTheorem").textContent =
    result.theorem.groupB.threshold.toFixed(2);

    document.getElementById("impactReferralBCurrent").textContent =
    currentReferB;

    document.getElementById("impactReferralBTheorem").textContent =
    theoremReferB;

    document.getElementById("impactMissedBCurrent").textContent =
    currentMissB;

    document.getElementById("impactMissedBTheorem").textContent =
    theoremMissB;

    // Improvement A and B
    document.getElementById("extraPatientsA").textContent = extraPatientsA;

    document.getElementById("extraPatientsB").textContent =
    extraPatientsB;

    document.getElementById("fewerMissedA").textContent =
    fewerMissedA;

    document.getElementById("fewerMissedB").textContent =
    fewerMissedB;

    document.getElementById("lossReductionA").textContent =
    lossReductionA.toFixed(0);
    

    document.getElementById("lossReductionB").textContent =
    lossReductionB.toFixed(0);

    document.getElementById("lossSavedA").textContent =
    lossSavedA.toFixed(0);

    document.getElementById("lossSavedB").textContent =
    lossSavedB.toFixed(0);

    document.getElementById("lossSaved").textContent =
    lossSaved.toFixed(0);

    
    

    // overall 
    document.getElementById("impactLoss").textContent =
    result.summary.currentLoss.toFixed(1) +
    " → " +
    result.summary.theoremLoss.toFixed(1);

    document.getElementById("impactPPV").textContent =
    result.summary.currentPPVGap.toFixed(3) +
    " → " +
    result.summary.theoremPPVGap.toFixed(3);

    document.getElementById("impactWaiting").textContent =
    totalCurrent +
    " → " +
    totalTheorem;


    
// card3 - Improvement card
    const extraPatients =
        totalTheorem - totalCurrent;

    const fewerMissed =
        (currentMissA + currentMissB) -
        (theoremMissA + theoremMissB);

    const lossReduction =
        100 *
        (result.summary.currentLoss -
        result.summary.theoremLoss) /
        result.summary.currentLoss;

    document.getElementById("impactExtraPatients").textContent =
        (extraPatients >= 0 ? "+" : "") + extraPatients;

    document.getElementById("impactFewerMissed").textContent =
        (fewerMissed >= 0 ? "+" : "") + fewerMissed;

    document.getElementById("impactLossReduction").textContent =
        lossReduction.toFixed(1) + "%";

        //card 4 overall card
        document.getElementById("impactLoss").textContent =
        result.summary.currentLoss.toFixed(2) +
        " → " +
        result.summary.theoremLoss.toFixed(2);

    document.getElementById("impactPPV").textContent =
        result.summary.currentPPVGap.toFixed(3) +
        " → " +
        result.summary.theoremPPVGap.toFixed(3);

    document.getElementById("impactWaiting").textContent =
        totalCurrent +
        " → " +
        totalTheorem;

    results.innerHTML = `
             <h2>Theorem Demonstration</h2>

            <p class="section-description">

            The optimiser compares two decision policies:

            <strong>Interactive Policy</strong> (your chosen assumptions)

            vs

            <strong>Bayesian Optimal Policy</strong> (derived analytically by the theorem).

            The differences below quantify the improvement obtained by applying
            the theorem instead of a fixed decision threshold.

            </p>

            <table>

            <tr>
                <th>Mathematical Quantity</th>
                <th>Current Policy</th>
                <th><span class="badge-theorem">Theorem </span></th>
                <th>Clinical Impact</th>
            </tr>

            <tr>
                <td>Decision Threshold A</td>
                <td>${result.interactive.groupA.threshold.toFixed(3)}</td>

                <td>
                <span class="badge-theorem"> ${result.theorem.groupA.threshold.toFixed(3)}</span>
                </td>

                <td>${formatThresholdDiff(result.summary.thresholdADiff)}</td>
            </tr>
            <tr>
                <td>Decision Threshold B</td>
                <td>${result.interactive.groupB.threshold.toFixed(3)}</td>

                <td>
                <span class="badge-theorem">  ${result.theorem.groupB.threshold.toFixed(3)}</span>
                </td>

                <td>${formatThresholdDiff(result.summary.thresholdBDiff)}</td>
            </tr>
            <tr>
                <td>Expected Clinical Loss</td>
                <td>${result.summary.currentLoss.toFixed(3)}</td>
                <td><span class="badge-theorem">${result.summary.theoremLoss.toFixed(3)}</span></td>
                <td>${diffGood(result.summary.lossDiff)}</td>
            </tr>
            <tr>
                <td>PPV Difference Between Groups</td>
                <td>${result.summary.currentPPVGap.toFixed(3)}</td>

                <td><span class="badge-theorem"> ${result.summary.theoremPPVGap.toFixed(3)}</span></td>
                <td>${diffGood(result.summary.ppvGapDiff)}</td>
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

const status = document.getElementById("datasetStatus");

// if (csvLoaded) {

//     status.innerHTML = `
//         <b>Dataset:</b> Custom CSV
//         (${uploadedData.length} records)
//     `;

// }
// else {

//     const project =
//         projectSelector.value;

//     status.innerHTML = `
//         <b>Dataset:</b>
//         ${projectConfig[project].name}
//     `;

// }


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

// =======================================
// RESEARCH TAB BUTTON
// =======================================

const interactiveButton =
    document.getElementById("interactiveButton");

if (interactiveButton) {

    interactiveButton.addEventListener("click", () => {

        document
            .querySelector('[data-tab="optimiser"]')
            .click();

    });

}


// =======================================
// INITIALISE APPLICATION
// =======================================

window.addEventListener("DOMContentLoaded", async () => {

    projectSelect.value = "chronosig";

    await loadExampleDataset();

    computeResults();
    loadResearch();

});

function diffClass(value) {

    return value > 0
        ? "diff-bad"
        : value < 0
        ? "diff-good"
        : "";

}

function formatDiff(value){

    return (value >= 0 ? "+" : "") + value.toFixed(3);

}

function diffGood(value) {

    return value <= 0
        ? `<span class="diff-good">${value.toFixed(3)}</span>`
        : `<span class="diff-bad">+${value.toFixed(3)}</span>`;

}

function diffThreshold(value) {

    if (Math.abs(value) < 0.001)
        return `<span class="diff-good">0.000</span>`;

    return `<span class="diff-neutral">${value.toFixed(3)}</span>`;

}

function formatThresholdDiff(value){

    if (Math.abs(value) < 0.001)
        return "≈ 0";

    return value > 0
        ? `↑ ${value.toFixed(3)}`
        : `↓ ${Math.abs(value).toFixed(3)}`;

}

document.querySelectorAll(".graph-tab").forEach(button=>{

    button.onclick=()=>{

        document
            .querySelectorAll(".graph-tab")
            .forEach(b=>b.classList.remove("active"));

        button.classList.add("active");

        document
            .querySelectorAll(".graph-content")
            .forEach(g=>g.classList.remove("active"));

        document
            .getElementById(button.dataset.tab+"Tab")
            .classList.add("active");

    };

});

{/* <table>

            <tr>
                <th></th>
                <th>Group A</th>
                <th>Group B</th>
                <th>Group A Theorem</th>

                <th>Group B Theorem</th>
            </tr>

            <tr>
                <td>Base Rate</td>
                <td>${result.pa.toFixed(2)}</td>
                <td>${result.pb.toFixed(2)}</td>
                
            </tr>

            <tr>
                <td>Optimal Threshold</td>
                
                <td>${result.interactive.groupA.threshold.toFixed(3)}</td>
                <td>${result.interactive.groupB.threshold.toFixed(3)}</td>
                <td>${result.theorem.groupA.threshold.toFixed(3)}</td>
                <td>${result.theorem.groupB.threshold.toFixed(3)}</td>
            </tr>

            <tr>
                <td>Expected Loss</td>
                
                <td>${result.interactive.groupA.loss.toFixed(3)}</td>
                <td>${result.interactive.groupB.loss.toFixed(3)}</td>
                <td>${result.theorem.groupA.loss.toFixed(3)}</td>
                <td>${result.theorem.groupB.loss.toFixed(3)}</td>
                
                
            </tr>

            <tr>
                <td>PPV</td>
                
                <td>${result.interactive.groupA.metrics.ppv.toFixed(3)}</td>
                <td>${result.interactive.groupB.metrics.ppv.toFixed(3)}</td>
                <td>${result.theorem.groupA.metrics.ppv.toFixed(3)}</td>
                <td>${result.theorem.groupB.metrics.ppv.toFixed(3)}</td>
            </tr>

            <tr>
                <td>TPR</td>
                
                <td>${result.interactive.groupA.metrics.tpr.toFixed(3)}</td>
                <td>${result.interactive.groupB.metrics.tpr.toFixed(3)}</td>
                <td>${result.theorem.groupA.metrics.tpr.toFixed(3)}</td>
                <td>${result.theorem.groupB.metrics.tpr.toFixed(3)}</td>
                
            </tr>

            <tr>
                <td>FPR</td>
                
                <td>${result.interactive.groupA.metrics.fpr.toFixed(3)}</td>
                <td>${result.interactive.groupB.metrics.fpr.toFixed(3)}</td>
                <td>${result.theorem.groupA.metrics.fpr.toFixed(3)}</td>
                <td>${result.theorem.groupB.metrics.fpr.toFixed(3)}</td>
            </tr>

            </table> */}