


clinicalContextHTML = `<div id="walkthroughTab" class="graph-content">

<h2>How the Bayesian Optimisation Works</h2>

<p class="section-description">
This walkthrough explains how the optimiser transforms a set of model
predictions into clinically informed referral decisions using Bayesian
decision theory.
</p>

<!-- ========================================================= -->

<div class="guide-card">

<h3>Step 1 — Load the prediction dataset</h3>

<p>

The selected case study contains

<b>{TOTAL_PATIENTS}</b> patients.

Each patient record contains:

</p>

<ul>

<li>Predicted probability of requiring assessment</li>

<li>True clinical outcome (for evaluation)</li>

<li>Demographic group (A or B)</li>

</ul>

<table class="impact-table">

<tr>
<th>Total</th>
<th>Group A</th>
<th>Group B</th>
</tr>

<tr>
<td>{TOTAL_PATIENTS}</td>
<td>{GROUP_A_SIZE}</td>
<td>{GROUP_B_SIZE}</td>
</tr>

</table>

</div>

<!-- ========================================================= -->

<div class="guide-card">

<h3>Step 2 — Current clinical policy</h3>

<p>

The existing decision policy applies the same probability threshold to every
patient.

</p>

<p class="equation">

Decision Rule

</p>

<p>

If

<b>Probability ≥ {CURRENT_THRESHOLD}</b>

→ Select for assessment

<br>

Otherwise

→ Do not select for assessment.

</p>

<p>

This produces the following outcomes.

</p>

<table class="impact-table">

<tr>

<th></th>

<th>Group A</th>

<th>Group B</th>

</tr>

<tr>

<td>Selected for assessment</td>

<td>{CURRENT_SELECTED_A}</td>

<td>{CURRENT_SELECTED_B}</td>

</tr>

<tr>

<td>Missed patients</td>

<td>{CURRENT_MISSED_A}</td>

<td>{CURRENT_MISSED_B}</td>

</tr>

</table>

</div>

<!-- ========================================================= -->

<div class="guide-card">

<h3>Step 3 — Clinical loss calculation</h3>

<p>

Each threshold is evaluated using the Bayesian loss function.

</p>

<p class="equation">

L = c<sub>FN</sub> × FN + c<sub>FP</sub> × FP

</p>

<p>

where

</p>

<ul>

<li>FN = patients needing assessment but missed</li>

<li>FP = patients unnecessarily selected</li>

<li>cFN = cost of a missed patient</li>

<li>cFP = cost of an unnecessary assessment</li>

</ul>

<p>

Example for Group A under the current policy:

</p>

<p class="equation">

L = ({CFN}) × ({CURRENT_FN_A})
+
({CFP}) × ({CURRENT_FP_A})

=
<b>{CURRENT_LOSS_A}</b>

</p>

</div>

<!-- ========================================================= -->

<div class="guide-card">

<h3>Step 4 — Bayesian optimisation</h3>

<p>

Instead of assuming the current threshold is optimal, the optimiser evaluates
many possible thresholds.

</p>

<p>

For every threshold:

</p>

<ul>

<li>Confusion matrix is recomputed</li>

<li>Clinical loss is calculated</li>

<li>The threshold with the minimum loss is retained</li>

</ul>

<p>

This produces

</p>

<table class="impact-table">

<tr>

<th></th>

<th>Current</th>

<th>Optimal</th>

</tr>

<tr>

<td>Group A threshold</td>

<td>{CURRENT_THRESHOLD_A}</td>

<td>{THEOREM_THRESHOLD_A}</td>

</tr>

<tr>

<td>Group B threshold</td>

<td>{CURRENT_THRESHOLD_B}</td>

<td>{THEOREM_THRESHOLD_B}</td>

</tr>

</table>

</div>

<!-- ========================================================= -->

<div class="guide-card">

<h3>Step 5 — Fairness multiplier</h3>

<p>

For the under-represented group, the theorem increases the cost of false
negatives using the selected multiplier.

</p>

<p class="equation">

c<sub>FN,A</sub>

=

Multiplier

×

c<sub>FN</sub>

</p>

<p>

Substituting the current values:

</p>

<p class="equation">

c<sub>FN,A</sub>

=

{MULTIPLIER}

×

{CFN}

=

<b>{CFN_A}</b>

</p>

<p>

Increasing the penalty for missed patients causes the optimal threshold for
Group A to decrease, allowing more patients to be selected for assessment.

</p>

</div>

<!-- ========================================================= -->

<div class="guide-card">

<h3>Step 6 — Apply the theorem</h3>

<p>

After optimisation, the updated thresholds are applied to every prediction.

</p>

<table class="impact-table">

<tr>

<th></th>

<th>Current</th>

<th>Bayesian theorem</th>

</tr>

<tr>

<td>Selected for assessment</td>

<td>{CURRENT_SELECTED_TOTAL}</td>

<td>{THEOREM_SELECTED_TOTAL}</td>

</tr>

<tr>

<td>Missed patients</td>

<td>{CURRENT_MISSED_TOTAL}</td>

<td>{THEOREM_MISSED_TOTAL}</td>

</tr>

<tr>

<td>Expected clinical loss</td>

<td>{CURRENT_LOSS}</td>

<td>{THEOREM_LOSS}</td>

</tr>

</table>

</div>

<!-- ========================================================= -->

<div class="guide-card">

<h3>Step 7 — Clinical interpretation</h3>

<p>

The optimiser does not change the model itself. Instead, it changes how model
predictions are converted into referral decisions.

</p>

<ul>

<li>More patients requiring support are selected for assessment.</li>

<li>Fewer clinically important cases are missed.</li>

<li>The overall expected clinical loss is reduced.</li>

<li>The trade-off between fairness and predictive performance becomes explicit and transparent.</li>

</ul>

<p>

This demonstrates how Bayesian decision theory can convert probabilistic model
outputs into clinically informed referral policies while allowing decision
makers to explore the consequences of different assumptions in real time.

</p>

</div>

</div>`;

function loadClinicalContext() {

    document.getElementById("clinicalContextContent").innerHTML =
        clinicalContextHTML;

}