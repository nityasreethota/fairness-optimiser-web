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

function runCSVValidation(data) {

    scoresA = [];
    labelsA = [];

    scoresB = [];
    labelsB = [];

    for (const row of data) {

        const score = Number(row.prob);
        const label = Number(row.true_label);
        const group = row.group.trim().toUpperCase();

        if (
            Number.isNaN(score) ||
            (label !== 0 && label !== 1) ||
            (group !== "A" && group !== "B")
        ) {

            csvLoaded = false;

            alert("Invalid CSV format.");

            return;

        }

        if (group === "A") {

            scoresA.push(score);
            labelsA.push(label);

        }
        else {

            scoresB.push(score);
            labelsB.push(label);

        }

    }

    csvLoaded = true;

    console.log("CSV loaded successfully.");

    console.log(scoresA.length);
    console.log(scoresB.length);

    alert(
        `CSV loaded successfully

    Group A: ${scoresA.length} records
    Group B: ${scoresB.length} records`
    );

}

function loadCSV(event) {

    const file = event.target.files[0];

    if (!file)
        return;

    const reader = new FileReader();

    reader.onload = function(e) {

        const text = e.target.result;

        uploadedData = parseCSV(text);

        if (!uploadedData || uploadedData.length === 0) {

            csvLoaded = false;

            alert("CSV could not be read.");

            return;

        }

        runCSVValidation(uploadedData);

    };

    reader.readAsText(file);

}

