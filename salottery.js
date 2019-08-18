const numberOfRows = document.getElementById('selectRows');
const tbl = document.getElementById('results-table');
const gameLotto = document.getElementById('gameLotto');
const gamePowerball = document.getElementById('gamePowerball');

let initialSelectOptions = 30;

const generateSelectOptions = (initialSelectOptions) => {
    for(let i = 1; i <= initialSelectOptions; i++) {
        numberOfRows.innerHTML += `<option value="${i}">${i}</option>`
    }
};

const randomURL = 'https://api.random.org/json-rpc/2/invoke';

document.addEventListener('DOMContentLoaded', () => {
    gameLotto.checked = true;
    generateSelectOptions(initialSelectOptions);
    numberOfRows.addEventListener('change', (event) => {
        tbl.innerHTML = '';
        let rows = event.target.value;
        let length = null;
        let min = null;
        let max = null;
        let replacement = null;
        let base = null;
        if (gameLotto.checked) {
            length = 6;
            min = 1;
            max = 52;
            replacement = false;
            base = 10
        } else if (gamePowerball.checked) {
            rows *= 2;
            length = [5,1];
            min = [1,1];
            max = [50,20];
            replacement = [false,false];
            base = [10,10];
            for(let i = 0; i < (rows / 2) - 1; i++) {
                length.push(5, 1);
                min.push(1, 1);
                max.push(50, 20);
                replacement.push(false, false);
                base.push(10, 10);
            }
        };
        let randomSequences = {
            "jsonrpc": "2.0",
            "method": "generateIntegerSequences",
            "params": {
                "apiKey": "e2cc8eb5-4971-42cb-acce-dcc5b5e2050f",
                "n": rows,
                "length": length,
                "min": min,
                "max": max,
                "replacement": replacement,
                "base": base
            },
            "id": 45673
        };
        fetch(randomURL, {
            method: 'POST',
            body: JSON.stringify(randomSequences),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            let results = result.result.random.data;
            for(let i = 0; i < results.length; i++) {
                let currentRow = results[i];
                currentRow.sort((a, b) => {
                    return a - b;
                });
                let newTR = document.createElement('tr');
                for(let j = 0; j < currentRow.length; j++) {
                    let newTD = document.createElement('td');
                    newTD.innerHTML = currentRow[j];
                    newTR.append(newTD);
                }
                tbl.append(newTR);
            }
        });
    });
});