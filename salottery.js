const numberOfRows = document.getElementById('selectRows');
const tickets = document.getElementById('tickets');
const gameLotto = document.getElementById('gameLotto');
const gamePowerball = document.getElementById('gamePowerball');

const initialSelectOptions = 30;

const generateSelectOptions = (initialSelectOptions) => {
    for(let i = 1; i <= initialSelectOptions; i++) {
        numberOfRows.innerHTML += `<option value="${i}">${i}</option>`
    }
};

const randomURL = 'https://us-central1-sa-lottery-70e5f.cloudfunctions.net/saLottery';

document.addEventListener('DOMContentLoaded', () => {
    gameLotto.checked = true;
    generateSelectOptions(initialSelectOptions);
    numberOfRows.addEventListener('change', (event) => {
        tickets.innerHTML = '';
        let rows = event.target.value;
        let game = gameLotto.checked ? 'lotto' : 'powerball';
        let data = JSON.stringify({
            game: game,
            rows: rows
        });
        fetch(randomURL, {
            method: 'POST',
            body: data,
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            let results = result.data;
            if(gameLotto.checked) {
                for(let i = 0; i < results.length; i++) {
                    let currentRow = results[i];
                    currentRow.sort((a, b) => {
                        return a - b;
                    });
                    let newTR = document.createElement('tr');
                    for(let j = 0; j < currentRow.length - 1; j++) {
                        let newTD = document.createElement('td');
                        newTD.style.borderRight = '1px dotted';
                        newTD.innerHTML = currentRow[j];
                        newTR.append(newTD);
                    }
                    let newTD = document.createElement('td');
                    newTD.innerHTML = currentRow[currentRow.length - 1];
                    newTR.append(newTD);
                    tickets.append(newTR);
                }
            } else {
                for(let i = 0; i < results.length; i += 2) {
                    let currentRow = results[i];
                    currentRow.sort((a, b) => {
                        return a - b;
                    });
                    let newTR = document.createElement('tr');
                    for(let j = 0; j < currentRow.length - 1; j++) {
                        let newTD = document.createElement('td');
                        newTD.style.borderRight = '1px dotted';
                        newTD.innerHTML = currentRow[j];
                        newTR.append(newTD);
                    }
                    let newTD = document.createElement('td');
                    newTD.innerHTML = currentRow[currentRow.length - 1];
                    newTR.append(newTD);
                    let spacerTD = document.createElement('td');
                    spacerTD.innerHTML = '-';
                    let powerBallTD = document.createElement('td');
                    powerBallTD.innerHTML = results[i + 1][0];
                    newTR.append(spacerTD, powerBallTD);
                    tickets.append(newTR);
                }
            }
        })
        .catch(error => {
            console.log(`Error: ${error}`);
        });
    });
});