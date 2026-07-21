// =======================================
// RESEARCH TAB
// =======================================



function loadResearch(project="chronosig") {
    
    const cfg = projectConfig[project];

    const container =
        document.getElementById("researchContent");

    

    container.innerHTML = `

    <h2>${cfg.name} Research Results</h2>

    <p>

    Interactive companion to the published research.

    </p>
    <p>

    These results are generated from the machine learning pipeline
    described in the accompanying research paper.

    The figures shown below are produced directly from the Python
    implementation and correspond to the selected project.

    </p>

    <button id="interactiveButton">
        View Interactive Results
    </button>

    <div class="research-grid">

        <div class="research-card">

            <h3>ROC Analysis</h3>
            <p>

                Receiver Operating Characteristic curves evaluate discrimination
                performance independently of prevalence. The curves compare the
                classification performance across protected groups.

            </p>

            <img
                src="${cfg.figures.roc}"
                alt="ROC Analysis">

        </div>

        <div class="research-card">

            <h3>Threshold Optimisation</h3>

            <p>

                Decision thresholds are selected by minimising expected
                misclassification cost while allowing asymmetric costs for
                false positives and false negatives.

            </p>

            <img
                src="${cfg.figures.threshold}"
                alt="Threshold">

        </div>

        <div class="research-card">

            <h3>Model Benchmark</h3>

            <img
                src="${cfg.figures.benchmark}"
                alt="Benchmark">
            <button id="interactiveButton" class="tab-button" data-tab="optimiser">

                View Interactive Results

            </button>

        </div>

        

        <div class="research-card">

            <h3>SHAP Analysis</h3>

            <p>

                SHAP values estimate the contribution of each feature to the
                model predictions, improving interpretability for clinicians.

            </p>

            <img
                src="${cfg.figures.shap}"
                alt="SHAP">

        </div>

        <div class="research-card">

            <h3>Fairness Metrics</h3>

            <p>

                This analysis compares group fairness using standard machine learning fairness
                metrics, including True Positive Rate (Equal Opportunity), Positive Predictive
                Value (Predictive Parity), ROC AUC and threshold optimisation. The results
                demonstrate the trade-offs predicted by Chouldechova's impossibility theorem:
                when base rates differ between protected groups, calibration and equal error
                rates cannot generally be satisfied simultaneously. Bayesian threshold
                optimisation can substantially reduce disparities while maintaining predictive
                performance.

            </p>

            <img
                src="${cfg.figures.fairness}"
                alt="Fairness">

        </div>

        <div class="research-card">

            <h3>Permutation Importance</h3>

            <p>

                Permutation importance estimates the contribution of each feature by measuring
                the reduction in predictive performance after randomly shuffling its values.
                Features producing the largest decrease in model accuracy are considered most
                important. This provides an interpretable ranking of clinical variables and
                helps identify which questionnaire responses contribute most strongly to the
                risk prediction model.

            </p>

            <img
                src="${cfg.figures.permutation}"
                alt="Permutation Importance">

        </div>
        

        <div class="research-card">

                <h3>Experimental Pipeline</h3>

                    <p>

                    Raw clinical data

                    → preprocessing

                    → feature engineering

                    → machine learning model

                    → predicted probabilities

                    → fairness optimisation

                    </p>

            </div>

            <div class="research-card">

                <h3>Downloads</h3>

                <ul>

                    <li>Research Paper (PDF)</li>

                    <li>Prediction CSV</li>

                    <li>Benchmark Results</li>

                    <li>Bayesian Optimisation Results</li>

                </ul>

                </div>

    </div>

    `;

}