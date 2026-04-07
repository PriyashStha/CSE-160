// asg0.js

// Draw a vector from canvas center
function drawVector(ctx, v, color) {
    const cx = 200;
    const cy = 200;

    const x = v.elements[0] * 20; // scale for visibility
    const y = v.elements[1] * 20;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + x, cy - y); // invert y for canvas coordinates
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Calculate angle between two vectors in degrees
function angleBetween(v1, v2) {
    const dot = Vector3.dot(v1, v2);
    const mag1 = v1.magnitude();
    const mag2 = v2.magnitude();
    const cosTheta = dot / (mag1 * mag2);
    const angleRad = Math.acos(Math.min(Math.max(cosTheta, -1), 1)); // clamp [-1,1]
    return angleRad * (180 / Math.PI); // degrees
}

// Calculate area of triangle formed by two vectors
function areaTriangle(v1, v2) {
    const cross = Vector3.cross(v1, v2);
    return 0.5 * Math.sqrt(
        cross.elements[0] ** 2 +
        cross.elements[1] ** 2 +
        cross.elements[2] ** 2
    );
}

// Draw v1 and v2 from inputs
function drawVectorsFromInputs(ctx) {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);

    // Read v1
    const x1 = parseFloat(document.getElementById('v1x').value);
    const y1 = parseFloat(document.getElementById('v1y').value);
    const v1 = new Vector3([x1, y1, 0]);
    drawVector(ctx, v1, "red");

    // Read v2
    const x2 = parseFloat(document.getElementById('v2x').value);
    const y2 = parseFloat(document.getElementById('v2y').value);
    const v2 = new Vector3([x2, y2, 0]);
    drawVector(ctx, v2, "blue");

    return { v1, v2 };
}

// Handle draw button for v1 (and optional v2)
function handleDrawVectors() {
    const canvas = document.getElementById('example');
    const ctx = canvas.getContext('2d');
    drawVectorsFromInputs(ctx);
}

// Handle vector operations
function handleDrawOperationEvent() {
    const canvas = document.getElementById('example');
    const ctx = canvas.getContext('2d');

    const { v1, v2 } = drawVectorsFromInputs(ctx);

    const op = document.getElementById('operation').value;
    const s = parseFloat(document.getElementById('scalar').value);

    if (op === "add") {
        const v3 = v1.add(v2);
        drawVector(ctx, v3, "green");
    } else if (op === "sub") {
        const v3 = v1.sub(v2);
        drawVector(ctx, v3, "green");
    } else if (op === "mul") {
        const v1m = v1.mul(s);
        const v2m = v2.mul(s);
        drawVector(ctx, v1m, "green");
        drawVector(ctx, v2m, "green");
    } else if (op === "div") {
        const v1d = v1.div(s);
        const v2d = v2.div(s);
        drawVector(ctx, v1d, "green");
        drawVector(ctx, v2d, "green");
    } else if (op === "magnitude") {
        console.log("Magnitude v1:", v1.magnitude());
        console.log("Magnitude v2:", v2.magnitude());
    } else if (op === "normalize") {
        const v1n = v1.normalize();
        const v2n = v2.normalize();
        drawVector(ctx, v1n, "green");
        drawVector(ctx, v2n, "green");
        console.log("Normalized v1:", v1n.elements);
        console.log("Normalized v2:", v2n.elements);
    } else if (op === "angle") {
        const angleDeg = angleBetween(v1, v2);
        console.log("Angle between v1 and v2:", angleDeg.toFixed(2), "degrees");
    } else if (op === "area") {
        const area = areaTriangle(v1, v2);
        console.log("Area of triangle formed by v1 and v2:", area.toFixed(2));
    }
}

// Ensure event listeners attach after page loads
window.onload = function() {
    const canvas = document.getElementById('example');
    const ctx = canvas.getContext('2d');

    // Draw initial v1
    const v1 = new Vector3([2.25, 2.25, 0]);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);
    drawVector(ctx, v1, "red");

    // Attach button listeners
    document.getElementById('drawV1').onclick = handleDrawVectors;
    document.getElementById('drawOperation').onclick = handleDrawOperationEvent;
};