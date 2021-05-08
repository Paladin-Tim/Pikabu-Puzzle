'use strict';

const field = document.querySelector('.field');
let fieldWidth = window.getComputedStyle(field).width;
fieldWidth = parseInt(fieldWidth.substr(0, fieldWidth.length - 2));
const range = document.getElementById("size");

let cellSize = 0;
let rows = 0;
let grid = 0;

let empty = {
    top: 0,
    left: 0,
    value: 0
};

let cells = [];

function resize() {
    rows = parseInt(range.value);
    cellSize = fieldWidth / range.value;
    grid = rows * rows - 1;

    let elements = [...Array(rows * rows).keys()];
    let excludePool = [0];
    let filteredPool = [];

    for (let i = 0; i < elements.length; i++) {
        if (excludePool.indexOf(elements[i]) === -1) {
            filteredPool.push(elements[i]);
        }
    }
    init();
    render(filteredPool);
    sleep(1000)
        .then(() => init())
        .then(() => filteredPool.sort(() => Math.random() - 0.5))
        .then(() => render(filteredPool));
};

document.addEventListener("DOMContentLoaded", resize);

range.onchange = resize;

function moveCell(index) {
    let cell = cells[index];
    let leftDiv = Math.abs(empty.left - cell.left);
    let topDiv = Math.abs(empty.top - cell.top);

    if (leftDiv + topDiv > 1) {
        cell.element.classList.add('shake');
        sleep(600)
            .then(() => cell.element.classList.remove('shake'));
        return;
    }

    cell.element.style.left = `${empty.left * cellSize}px`;
    cell.element.style.top = `${empty.top * cellSize}px`;

    let emptyLeft = empty.left;
    let emptyTop = empty.top;

    empty.left = cell.left;
    empty.top = cell.top;
    cell.left = emptyLeft;
    cell.top = emptyTop;

    let isFinished = cells.every(cell => {
        return cell.value === cell.top * rows + cell.left;
    });

    if (isFinished) {
        alert('You win!');
    }
};

function init() {
    field.innerHTML = '';

    empty = {
        top: 0,
        left: 0,
        value: 0
    };

    cells = [];
    cells.push(empty);

    for (let i = 1; i <= grid; i++) {

        let cell = document.createElement('div');
        /* let value = elements[i - 1] + 1; */
        let value = i;

        cell.classList.add('cell');

        let left = i % rows;
        let top = (i - left) / rows;

        let cellX = (0 + left) * cellSize;
        let cellY = (0 + top) * cellSize;
        let cellBgPosition = '-' + `${cellX}px` + ' ' + '-' + `${cellY}px`;

        cells.push({
            left: left,
            top: top,
            value: value,
            element: cell,
            position: cellBgPosition
        });

        cell.style.left = `${left * cellSize}px`;
        cell.style.top = `${top * cellSize}px`;
        cell.style.width = `${cellSize - 2}px`;
        cell.style.height = `${cellSize - 2}px`;
        cell.style.backgroundPosition = cellBgPosition;
        cell.style.backgroundSize = `${fieldWidth}px`;

    };
}

function render(elements) {
    for (let i = 1; i < cells.length; i++) {
        let cellLocal = cells[i];
        let newI = elements[i - 1];

        if (newI !== 0) {
            /* cellLocal.element.classList.add(newI); */

            cellLocal.left = newI % rows;
            cellLocal.top = (newI - cellLocal.left) / rows;

            cellLocal.element.style.left = `${cellLocal.left * cellSize}px`;
            cellLocal.element.style.top = `${cellLocal.top * cellSize}px`;

            field.append(cellLocal.element);
        }

        cellLocal.element.addEventListener('click', () => {
            moveCell(i);
        })
    };
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};