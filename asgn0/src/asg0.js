// asg0.js

function main() {
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    var ctx = canvas.getContext('2d');

    // Fill canvas black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initial vector
    var v1 = new Vector3([2.25, 2.25, 0]);
    drawVector(ctx, v1, "red");
}

// Draw a vector from canvas center
function drawVector(ctx, v, color) {
    var cx = 200;
    var cy = 200;

    var x = v.elements[0] * 20; // scale for visibility
    var y = v.elements[1] * 20;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + x, cy - y); // invert y for canvas coordinates
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Calculate angle between two vectors in degrees
function angleBetween(v1, v2) {
    var dot = Vector3.dot(v1, v2);
    var mag1 = v1.magnitude();
    var mag2 = v2.magnitude();
    var cosTheta = dot / (mag1 * mag2);
    var angleRad = Math.acos(Math.min(Math.max(cosTheta, -1), 1)); // clamp to [-1,1]
    return angleRad * (180 / Math.PI); // convert to degrees
}

// Calculate area of triangle formed by two vectors
function areaTriangle(v1, v2) {
    var cross = Vector3.cross(v1, v2);
    return 0.5 * Math.sqrt(
        cross.elements[0] ** 2 + cross.elements[1] ** 2 + cross.elements[2] ** 2
    );
}

// Handle all vector operations
function handleDrawOperationEvent() {
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Read v1 and v2
    var x1 = parseFloat(document.getElementById('v1x').value);
    var y1 = parseFloat(document.getElementById('v1y').value);
    var v1 = new Vector3([x1, y1, 0]);
    drawVector(ctx, v1, "red");

    var x2 = parseFloat(document.getElementById('v2x').value);
    var y2 = parseFloat(document.getElementById('v2y').value);
    var v2 = new Vector3([x2, y2, 0]);
    drawVector(ctx, v2, "blue");

    // Read operation and scalar
    var op = document.getElementById('operation').value;
    var s = parseFloat(document.getElementById('scalar').value);

    if (op === "add") {
        var v3 = new Vector3([v1.elements[0], v1.elements[1], 0]).add(v2);
        drawVector(ctx, v3, "green");
    } else if (op === "sub") {
        var v3 = new Vector3([v1.elements[0], v1.elements[1], 0]).sub(v2);
        drawVector(ctx, v3, "green");
    } else if (op === "mul") {
        var v1m = new Vector3([v1.elements[0], v1.elements[1], 0]).mul(s);
        var v2m = new Vector3([v2.elements[0], v2.elements[1], 0]).mul(s);
        drawVector(ctx, v1m, "green");
        drawVector(ctx, v2m, "green");
    } else if (op === "div") {
        var v1d = new Vector3([v1.elements[0], v1.elements[1], 0]).div(s);
        var v2d = new Vector3([v2.elements[0], v2.elements[1], 0]).div(s);
        drawVector(ctx, v1d, "green");
        drawVector(ctx, v2d, "green");
    } else if (op === "magnitude") {
        console.log("Magnitude v1:", v1.magnitude());
        console.log("Magnitude v2:", v2.magnitude());
    } else if (op === "normalize") {
        var v1n = new Vector3([v1.elements[0], v1.elements[1], 0]).normalize();
        var v2n = new Vector3([v2.elements[0], v2.elements[1], 0]).normalize();
        drawVector(ctx, v1n, "green");
        drawVector(ctx, v2n, "green");
        console.log("Normalized v1:", v1n.elements);
        console.log("Normalized v2:", v2n.elements);
    } else if (op === "angle") {
        var angleDeg = angleBetween(v1, v2);
        console.log("Angle between v1 and v2:", angleDeg.toFixed(2), "degrees");
    } else if (op === "area") {
        var area = areaTriangle(v1, v2);
        console.log("Area of triangle formed by v1 and v2:", area.toFixed(2));
    }
}

// Attach event listener
document.getElementById('drawOperation').onclick = handleDrawOperationEvent;