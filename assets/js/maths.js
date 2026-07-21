function evaluateThreshold(
    scores,
    labels,
    threshold,
    prevalence,
    cfn,
    cfp
) {

    const metrics =
        computeMetrics(
            scores,
            labels,
            threshold
        );

    const loss =
        expectedLoss(
            metrics.fpr,
            metrics.tpr,
            prevalence,
            cfn,
            cfp
        );

    return {

        threshold,

        loss,

        metrics

    };

}

function runFullAnalysis(
    pa,
    pb,
    cfn,
    cfp,
    multiplier,
    scoresA = null,
    labelsA = null,
    scoresB = null,
    labelsB = null
) {

    const cfnA = cfn * multiplier;

    const chould = chouldechovaGap(pa, pb);

    // let scoresA = inputScoresA;
    // let labelsA = inputLabelsA;

    // let scoresB = inputScoresB;
    // let labelsB = inputLabelsB;
    if (!scoresA) {
        const groupA =
        generateGroupScores(
            300,
            pa,
            0.45
        );

        scoresA = groupA.scores;
        labelsA = groupA.labels;
    }

    if (!scoresB) {
        const groupB =
        generateGroupScores(
            700,
            pb,
            0.55
        );
        scoresB = groupB.scores;
        labelsB = groupB.labels;
    }

    const rocA =
    rocCurve(
        scoresA,
        labelsA
    );

    const rocB =
        rocCurve(
            scoresB,
            labelsB
        );

    // const metricsA =
    // metricsAtThreshold(
    //     scoresA,
    //     labelsA,
    //     0.4
    // );

    // const metricsB =
    // metricsAtThreshold(
    //     scoresB,
    //     labelsB,
    //     0.4
    // );

    const optimalA =
    optimalThresholdSearch(
        scoresA,
        labelsA,
        pa,
        cfnA,
        cfp
    );

    const optimalB =
        optimalThresholdSearch(
            scoresB,
            labelsB,
            pb,
            cfn,
            cfp
        );

    // =======================================
    // THEOREM REFERENCE
    // =======================================
    const currentThresholdA = 0.50;
    const currentThresholdB = 0.50;
    const currentA =
        evaluateThreshold(

            scoresA,
            labelsA,

            currentThresholdA,

            pa,

            cfnA,

            cfp

        );

    const currentB =
        evaluateThreshold(

            scoresB,
            labelsB,

            currentThresholdB,

            pb,

            cfn,

            cfp

        );
    const theoremA =
        evaluateThreshold(

            scoresA,
            labelsA,

            optimalA.threshold,

            pa,

            cfnA,

            cfp

        );

    const theoremB =
        evaluateThreshold(

            scoresB,
            labelsB,

            optimalB.threshold,

            pb,

            cfn,

            cfp

        );
    // const currentLoss =
    //     currentA.loss +
    //     currentB.loss;

    // const theoremLoss =
    //     theoremA.loss +
    //     theoremB.loss;

    // const lossReduction = 100 * (currentLoss - theoremLoss) / currentLoss;

    // const currentPPVGap =
    //     Math.abs(
    //         currentA.metrics.ppv  - currentB.metrics.ppv

    //     );

    // const theoremPPVGap =
    //     Math.abs(
    //         theoremA.metrics.ppv -
    //         theoremB.metrics.ppv
    //     );

    const lossA = [];
    const lossB = [];

    const currentLoss =
        currentA.loss +
        currentB.loss;

    const theoremLoss =
        theoremA.loss +
        theoremB.loss;

    const lossReduction =
        currentLoss -
        theoremLoss;

    const currentPPVGap =
        Math.abs(
            currentA.metrics.ppv -
            currentB.metrics.ppv
        );

    const theoremPPVGap =
        Math.abs(
            theoremA.metrics.ppv -
            theoremB.metrics.ppv
        );

    const thresholdADiff =
        currentA.threshold -
        theoremA.threshold;

    const thresholdBDiff =
        currentB.threshold -
        theoremB.threshold;

    const lossDiff =
        currentLoss -
        theoremLoss;

    const ppvGapDiff =
        currentPPVGap -
        theoremPPVGap;
        

    // const diffThresholdA =
    //     result.interactive.groupA.threshold -
    //     result.theorem.groupA.threshold;

    // const diffThresholdB =
    //     result.interactive.groupB.threshold -
    //     result.theorem.groupB.threshold;

    // const diffLoss =
    //     result.summary.currentLoss -
    //     result.summary.theoremLoss;

    // const diffPPV =
    //     result.summary.currentPPVGap -
    //     result.summary.theoremPPVGap;

    for (let i = 0; i < rocA.thresholds.length; i++) {

        lossA.push(
            expectedLoss(
                rocA.fpr[i],
                rocA.tpr[i],
                pa,
                cfnA,
                cfp
            )
        );

    }

    for (let i = 0; i < rocB.thresholds.length; i++) {

        lossB.push(
            expectedLoss(
                rocB.fpr[i],
                rocB.tpr[i],
                pb,
                cfn,
                cfp
            )
        );

    }

    const ppvCurve = [];

    for (let p = 0.05; p <= 0.95; p += 0.01) {

        ppvCurve.push({

            baseRate: p,

            ppv: ppvFromBayes(
                0.1,
                0.1,
                p
            )

        });

    }

    return {

            pa,
            pb,

            cfn,
            cfp,

            cfnA,

            ppvA: chould.ppvA,
            ppvB: chould.ppvB,
            ppvGap: chould.gap,

            scoresA: scoresA,
            labelsA: labelsA,

            scoresB: scoresB,
            labelsB: labelsB,

            groupASize: scoresA.length,
            groupBSize: scoresB.length,
            // metricsA,
            // metricsB,

            interactive: {

                groupA: currentA,

                groupB: currentB

            },

            theorem: {

                groupA: theoremA,

                groupB: theoremB

            },
            summary: {

                currentLoss,
                theoremLoss,
                lossReduction,

                currentPPVGap,
                theoremPPVGap,

                thresholdADiff,
                thresholdBDiff,
                lossDiff,
                ppvGapDiff
                

            },

            optimalA,
            optimalB,

            rocA,
            rocB,

            lossA,
            lossB,

            ppvCurve,
            // diffThresholdA,
            // diffThresholdB,
            // diffLoss,
            // diffPPV 

        };

}

function generateGroupScores(
    n,
    baseRate,
    quality
) {

    const scores = [];
    const labels = [];

    for (let i = 0; i < n; i++) {

        const label =
            Math.random() < baseRate ? 1 : 0;

        labels.push(label);

        let score;

        if (label === 1) {

            score =
                quality * 0.5 +
                0.5 * Math.random();

        }
        else {

            score =
                (1 - quality) *
                Math.random();

        }

        scores.push(score);

    }

    return {

        scores,
        labels

    };

}

function metricsAtThreshold(
    scores,
    labels,
    threshold
) {

    let tp = 0;
    let fp = 0;
    let tn = 0;
    let fn = 0;

    for (let i = 0; i < scores.length; i++) {

        const prediction =
            scores[i] >= threshold ? 1 : 0;

        const actual =
            labels[i];

        if (prediction === 1 && actual === 1)
            tp++;

        if (prediction === 1 && actual === 0)
            fp++;

        if (prediction === 0 && actual === 0)
            tn++;

        if (prediction === 0 && actual === 1)
            fn++;

    }

    const tpr =
        tp + fn === 0
            ? 0
            : tp / (tp + fn);

    const fpr =
        fp + tn === 0
            ? 0
            : fp / (fp + tn);

    const fnr =
        1 - tpr;

    const ppv =
        tp + fp === 0
            ? 0
            : tp / (tp + fp);

    return {

        tp,
        fp,
        tn,
        fn,

        tpr,
        fpr,
        fnr,
        ppv

    };

}

function computeMetrics(
    scores,
    labels,
    threshold
) {

    let tp = 0;
    let fp = 0;
    let tn = 0;
    let fn = 0;

    for (let i = 0; i < scores.length; i++) {

        const prediction =
            scores[i] >= threshold ? 1 : 0;

        const actual =
            labels[i];

        if (prediction === 1 && actual === 1) tp++;
        else if (prediction === 1 && actual === 0) fp++;
        else if (prediction === 0 && actual === 0) tn++;
        else fn++;

    }

    const tpr =
        tp + fn === 0 ? 0 : tp / (tp + fn);

    const fpr =
        fp + tn === 0 ? 0 : fp / (fp + tn);

    const fnr =
        1 - tpr;

    const ppv =
        tp + fp === 0 ? 0 : tp / (tp + fp);

    return {

        tp,
        fp,
        tn,
        fn,

        tpr,
        fpr,
        fnr,
        ppv

    };

}

function rocCurve(
    scores,
    labels
) {

    const fpr = [];
    const tpr = [];
    const thresholds = [];

    for (

        let threshold = 1;

        threshold >= 0;

        threshold -= 0.02

    ) {

        const metrics =
            computeMetrics(
                scores,
                labels,
                threshold
            );

        fpr.push(metrics.fpr);
        tpr.push(metrics.tpr);
        thresholds.push(threshold);

    }

    return {

        fpr,
        tpr,
        thresholds

    };

}

 // Expected loss
function expectedLoss(fpr, tpr, baseRate, cFn, cFp) {

    const fnr = 1 - tpr;

    return (
        cFn * fnr * baseRate +
        cFp * fpr * (1 - baseRate)
    );

}

//PPV from Bayes
function ppvFromBayes(fnr, fpr, baseRate) {

    const numerator =
        (1 - fnr) * baseRate;

    const denominator =
        numerator +
        fpr * (1 - baseRate);

    if (denominator === 0)
        return 0;

    return numerator / denominator;

}

function chouldechovaGap(
    baseRateA,
    baseRateB,
    fnr = 0.1,
    fpr = 0.1
) {

    const ppvA =
        ppvFromBayes(fnr, fpr, baseRateA);

    const ppvB =
        ppvFromBayes(fnr, fpr, baseRateB);

    return {

        ppvA,
        ppvB,
        gap: Math.abs(ppvB - ppvA)

    };

}

// ======================================// Generate synthetic scores
// Similar to fairness_core.py
// ======================================




// ======================================
// Metrics at a threshold
// ======================================



// ======================================
// Find the optimal threshold
//  sklearn.roc_curve().
// ======================================

function optimalThresholdSearch(
    scores,
    labels,
    baseRate,
    cFn,
    cFp
) {

    let bestThreshold = 0;

    let bestLoss = Infinity;

    let bestMetrics = null;

    for (
        let threshold = 0;
        threshold <= 1;
        threshold += 0.01
    ) {

        const metrics =
            metricsAtThreshold(
                scores,
                labels,
                threshold
            );

        const loss =
            expectedLoss(
                metrics.fpr,
                metrics.tpr,
                baseRate,
                cFn,
                cFp
            );

        if (loss < bestLoss) {

            bestLoss = loss;

            bestThreshold = threshold;

            bestMetrics = metrics;

        }

    }

    return {

        threshold: bestThreshold,

        loss: bestLoss,

        metrics: bestMetrics

    };

}

function runAnalysisFromCSV(
    data,
    cfn,
    cfp,
    multiplier
) {

    console.log(data);

    if (!data || data.length === 0) {

        console.error("No CSV data loaded.");

        return null;

    }

    const groupA =
        data.filter(r => r.group === "A");

    const groupB =
        data.filter(r => r.group === "B");

    const scoresA =
        groupA.map(r => Number(r.prob));

    const labelsA =
        groupA.map(r => Number(r.true_label));

    const scoresB =
        groupB.map(r => Number(r.prob));

    const labelsB =
        groupB.map(r => Number(r.true_label));

    const pa =
        labelsA.reduce((a, b) => a + b, 0)
        / labelsA.length;

    const pb =
        labelsB.reduce((a, b) => a + b, 0)
        / labelsB.length;

    return runFullAnalysis(

        pa,
        pb,
        cfn,
        cfp,
        multiplier,

        scoresA,
        labelsA,

        scoresB,
        labelsB

    );

}

function minimumPPVGap(
    baseRateA,
    baseRateB,
    nPoints = 60
) {

    let minimumGap = Number.MAX_VALUE;

    for (let i = 0; i < nPoints; i++) {

        const fnr =
            0.05 +
            (0.45 * i) / (nPoints - 1);

        for (let j = 0; j < nPoints; j++) {

            const fpr =
                0.05 +
                (0.45 * j) / (nPoints - 1);

            const ppvA =
                ppvFromBayes(
                    fnr,
                    fpr,
                    baseRateA
                );

            const ppvB =
                ppvFromBayes(
                    fnr,
                    fpr,
                    baseRateB
                );

            const gap =
                Math.abs(ppvB - ppvA);

            if (gap < minimumGap) {

                minimumGap = gap;

            }

        }

    }

    return minimumGap;

}
// =======================================
// Approximate Beta(alpha, beta)
// =======================================

function betaRandom(alpha, beta) {

    const u1 = Math.random();
    const u2 = Math.random();

    const x = Math.pow(u1, 1 / alpha);
    const y = Math.pow(u2, 1 / beta);

    return x / (x + y);

}

// =======================================
// Minimum PPV Gap
// =======================================



// =======================================
// Run Analysis From Uploaded CSV
// =======================================

