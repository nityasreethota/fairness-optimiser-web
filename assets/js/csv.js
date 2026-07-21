// =======================================
// CSV LOADING
// =======================================
// pd.read_csv(...)
let uploadedData = null;

let csvLoaded = false;

let scoresA = [];
let labelsA = [];

let scoresB = [];
let labelsB = [];

function parseCSV(text) {

    const rows = text.trim().split("\n");

    const headers = rows[0]
        .split(",")
        .map(h => h.trim().toLowerCase());

    const data = [];

    for (let i = 1; i < rows.length; i++) {

        const values = rows[i].split(",");

        const row = {};

        headers.forEach((h, index) => {
            row[h] = values[index].trim();
        });

        data.push(row);
    }

    return data;

}

// function runCSVValidation(data) {

//     scoresA = [];
//     labelsA = [];

//     scoresB = [];
//     labelsB = [];

//     for (const row of data) {

//         const score = Number(row.prob);
//         const label = Number(row.true_label);
//         const group = row.group.trim().toUpperCase();

//         if (
//             Number.isNaN(score) ||
//             (label !== 0 && label !== 1) ||
//             (group !== "A" && group !== "B")
//         ) {

//             csvLoaded = false;

//             alert("Invalid CSV format.");

//             return;

//         }

//         if (group === "A") {

//             scoresA.push(score);
//             labelsA.push(label);

//         }
//         else {

//             scoresB.push(score);
//             labelsB.push(label);

//         }

//     }

//     csvLoaded = true;

//     console.log("CSV loaded successfully.");

//     console.log(scoresA.length);
//     console.log(scoresB.length);

//     alert(
//         `CSV loaded successfully

//     Group A: ${scoresA.length} records
//     Group B: ${scoresB.length} records`
//     );

// }

function runCSVValidation() {

    if (!uploadedData || uploadedData.length === 0)
        return false;

    for (const row of uploadedData) {

        if (

            Number.isNaN(row.prob) ||

            (row.true_label !== 0 &&
             row.true_label !== 1) ||

            (row.group !== "A" &&
             row.group !== "B")

        ) {

            return false;

        }

    }

    return true;

}

function loadCSV(event) {

    const file = event.target.files[0];

    if (!file)
        return;

    const reader = new FileReader();

        reader.onload = function(e) {

        const text = e.target.result;

        const data = parseCSV(text);

        prepareCSVData(data);

        if (!runCSVValidation()) {

            csvLoaded = false;

            alert("Invalid CSV.");

            return;

        }

        csvLoaded = true;

        computeResults();

    };

    // reader.onload = function(e) {

    //     const text = e.target.result;

    //     // uploadedData = parseCSV(text);
    //     const data =
    //         parseCSV(text);
    //     uploadedData = data;
    //     console.log(uploadedData[0]);

    //     prepareCSVData(data);
    //     csvLoaded = true;

    //     computeResults();

    //     console.log("CSV ready.");

    //     if (!uploadedData || uploadedData.length === 0) {

    //         csvLoaded = false;

    //         alert("CSV could not be read.");

    //         return;

    //     }

    //     runCSVValidation(uploadedData);

    // };

    reader.readAsText(file);
    

}

/////new
// =======================================
// PREPARE CSV DATA
// =======================================

// function prepareCSVData(data) {

//     scoresA = [];
//     labelsA = [];

//     scoresB = [];
//     labelsB = [];

//     const normalised = data.map(row => ({

//         prob: Number(
//             row.prob ??
//             row.risk_score
//         ),

//         true_label: Number(
//             row.true_label ??
//             row.true_outcome
//         ),

//         group: row.group.trim()

//     }));

//     data.forEach(row => {

//         // Support both CSV formats

//         const score = Number(
//             row.prob ??
//             row.risk_score
//         );

//         const label = Number(
//             row.true_label ??
//             row.true_outcome
//         );

//         const group = row.group.trim();

//         if (group === "A") {

//             scoresA.push(score);
//             labelsA.push(label);

//         }

//         else if (group === "B") {

//             scoresB.push(score);
//             labelsB.push(label);

//         }

//     });

//     csvLoaded = true;

//     console.log("CSV loaded");

//     console.log("Group A:", scoresA.length);

//     console.log("Group B:", scoresB.length);

//     console.log("First Group A score:", scoresA[0]);
// console.log("First Group B score:", scoresB[0]);
// }


function prepareCSVData(data) {
    console.log("prepareCSVData:", data);

    scoresA = [];
    labelsA = [];

    scoresB = [];
    labelsB = [];

    uploadedData = [];

    for (const row of data) {

        const score = Number(row.prob ?? row.risk_score);

        const label = Number(row.true_label ?? row.true_outcome);

        const group = row.group.trim().toUpperCase();

        uploadedData.push({
            prob: score,
            true_label: label,
            group: group
        });

        if (group === "A") {

            scoresA.push(score);
            labelsA.push(label);

        }
        else if (group === "B") {

            scoresB.push(score);
            labelsB.push(label);

        }

    }

    console.log("CSV prepared");
    console.log("Group A:", scoresA.length);
    console.log("Group B:", scoresB.length);

}



