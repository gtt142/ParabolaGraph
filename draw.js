let A = 1;
let B = 0;
let C = 0;

let xGridCount = 10;
let yGridCount = 10;


let myCanvas = document.getElementById("canvas");
let ctx = myCanvas.getContext("2d");
let canvasDefaultWidth = parseInt(myCanvas.style.width);

myCanvas.width = 1000;
myCanvas.height = 1000;

let canvasBorder = 30;
let canvasW = myCanvas.width;
let canvasH = myCanvas.height;

let X0 = Math.round(canvasW/2);
let Y0 = Math.round(canvasH/2);


let leftX = -5;
let rightX = 5;
let pointsCount = 100;
let deltaY = 10
let yMin = -5;
let yMax = yMin+deltaY;



function f(x) {
    return A*x**2 + B*x + C;
}

function drawLine(ctx, startX, startY, endX, endY,color){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.restore();
}

function drawAxis() {
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(canvasBorder, canvasBorder);
    ctx.lineTo(canvasBorder,canvasH-canvasBorder);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(canvasBorder, canvasH-canvasBorder);
    ctx.lineTo(canvasW-canvasBorder,canvasH-canvasBorder);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.font = "italic 16pt Arial";
    let xStepPlot = (rightX - leftX) / xGridCount;
    let xCoordPlot = leftX;
    let xStep = (canvasW - 2* canvasBorder)/xGridCount;
    let xCoord = canvasBorder;
    for (let i = 0; i < xGridCount+1; i++) {
        ctx.moveTo(xCoord, canvasH-canvasBorder);
        ctx.lineTo(xCoord, canvasH-canvasBorder+30);
        ctx.fillText(xCoordPlot.toFixed(2), xCoord + 3, canvasH-canvasBorder+30);
        xCoord += xStep;
        xCoordPlot += xStepPlot;
    }
    let yStepPlot = (yMax - yMin) / yGridCount;
    let yCoordPlot = yMin;
    let yStep = (canvasH - 2* canvasBorder)/yGridCount;
    let yCoord = canvasH-canvasBorder;
    for (let i = 0; i < yGridCount+1; i++) {
        ctx.moveTo(canvasBorder, yCoord);
        ctx.lineTo(canvasBorder-30, yCoord);
        ctx.fillText(yCoordPlot.toFixed(2), canvasBorder-30, yCoord-3);
        yCoord -= yStep;
        yCoordPlot += yStepPlot
    }
    ctx.stroke();


    ctx.save();
    ctx.strokeStyle = 'gray';
    ctx.setLineDash([3, 5])
    ctx.beginPath();
    xCoord = canvasBorder + xStep;
    for (let i = 1; i < xGridCount+1; i++) {
        ctx.moveTo(xCoord, canvasH-canvasBorder);
        ctx.lineTo(xCoord, canvasBorder);
        xCoord += xStep;
    }
    yCoord = canvasH-canvasBorder - yStep;
    for (let i = 1; i < yGridCount+1; i++) {
        ctx.moveTo(canvasBorder, yCoord);
        ctx.lineTo(canvasW - canvasBorder, yCoord);
        yCoord -= yStep;
    }
    ctx.stroke();
    ctx.restore();

    if (leftX < 0 && rightX > 0) {
        let xZero = (canvasW - 2*canvasBorder) * (-1*leftX)/(rightX-leftX) + canvasBorder;
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(xZero, canvasBorder);
        ctx.lineTo(xZero, canvasH-canvasBorder);            
        ctx.stroke();
        ctx.restore();
    }
    if (yMin < 0 && yMax > 0) {
        let yZero = (canvasH - 2*canvasBorder) * (yMax)/(yMax-yMin) + canvasBorder;
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(canvasBorder, yZero);
        ctx.lineTo(canvasW-canvasBorder, yZero);            
        ctx.stroke();
        ctx.restore();
    }
}


function drawParabola() {
    let plotStep = (rightX - leftX) / pointsCount;
    let step = (canvasW-2*canvasBorder) / pointsCount;
    let yScale = (canvasH-2*canvasBorder)/(yMax-yMin);
    let xScale = (canvasW-2*canvasBorder)/(rightX-leftX);
    let curPlotX = leftX;
    let curPlotY = f(curPlotX);
    let curX = canvasBorder;
    let curY = canvasH-canvasBorder-(curPlotY-yMin)*yScale;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2.5;
    ctx.moveTo(curX,curY);

    curPlotX += plotStep;
    curX += step;
    while (curPlotX <= rightX) {
        curPlotY = f(curPlotX);
        curY = canvasH-canvasBorder-(curPlotY-yMin)*yScale;
        ctx.lineTo((curX),curY);
        curPlotX += plotStep;
        curX += step;
    }
    ctx.stroke();
    ctx.restore();

}

function preparePlot() {
    if (A == 0) {
        if(B > 0) {
            yMin = f(leftX);
            yMax = yMin+deltaY;
        } else if(B < 0) {
            yMin = f(rightX);
            yMax = yMin+deltaY;
        } else {
            yMin = C - deltaY/2;
            yMax = C + deltaY/2;
        }
    }
    let extrX = -1*B/(2*A);
    if(A > 0) {
        if(extrX <= leftX) {
            yMin = f(leftX);
            yMax = yMin+deltaY;
        } else if(extrX >= rightX) {
            yMin = f(rightX);
            yMax = yMin+deltaY;
        } else {
            yMin = f(extrX);
            yMax = yMin + deltaY;
        }
    }
    if (A < 0) {
        if(extrX <= leftX) {
            yMax = f(leftX);
            yMin = yMax - deltaY;
        } else if(extrX >= rightX) {
            yMax = f(rightX);
            yMin = yMax - deltaY;
        } else {
            yMax = f(extrX);
            yMin = yMax - deltaY;
        }
    }
}

// drawLine(ctx, 100, 100, 400, 120, 'red');

preparePlot();
drawAxis();
drawParabola();

document.addEventListener('DOMContentLoaded', () => {
    let inputF = document.getElementById("inputField");
    let li = document.getElementById("leftX");
    let ri = document.getElementById("rightX");
    let dY = document.getElementById("deltaY");
    let gY = document.getElementById("yGrids");
    let gX = document.getElementById("xGrids");
    let minY = document.getElementById("yMin");
    let maxY = document.getElementById("yMax");
    let coefA = document.getElementById("A");
    let coefB = document.getElementById("B");
    let coefC = document.getElementById("C");
    let autoY = document.getElementById("autoY");
    let scaler = document.getElementById("canvasScale");

    scaler.addEventListener('input', () => {
        let val = Number(scaler.value);
        if (!isNaN(val)) {
            myCanvas.style.width = canvasDefaultWidth*val + 'px';
            console.log(canvasDefaultWidth)
            console.log(val)
        }
    })

    inputF.addEventListener("input", () => {
        let val;
        val = Number(li.value);
        if (!isNaN(val)) {
            leftX = val;
        }
        val = Number(ri.value);
        if (!isNaN(val)) {
            rightX = val;
        }
        val = Number(dY.value);
        if (!isNaN(val)) {
            deltaY = val;
        }
        val = Number(gX.value);
        if (!isNaN(val)) {
            xGridCount = val;
        }
        val = Number(gY.value);
        if (!isNaN(val)) {
            yGridCount = val;
        }
        val = Number(coefA.value);
        if (!isNaN(val)) {
            A = val;
        }
        val = Number(coefB.value);
        if (!isNaN(val)) {
            B = val;
        }
        val = Number(coefC.value);
        if (!isNaN(val)) {
            C = val;
        }
        val = Number(minY.value);
        if (!isNaN(val)) {
            yMin = val;
        }
        val = Number(maxY.value);
        if (!isNaN(val)) {
            yMax = val;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(autoY.checked)
            preparePlot();
        drawAxis();
        drawParabola();
    });

    
});