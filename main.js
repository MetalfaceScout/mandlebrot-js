import { initShaderProgram } from "./shader.js";
import { drawCircle, drawRectangle, drawTriangle, drawLineStrip } from "./shapes2d.js";
import { randomDouble } from "./random.js";

const INITIAL_XHIGH = .5;
const INITIAL_XLOW = -2.5;
const INITIAL_YHIGH = 1.5;
const INITIAL_YLOW = -1.5;

main();
async function main() {
	console.log('This is working');

	//
	// start gl
	// 
	const canvas = document.getElementById('glcanvas');
	const gl = canvas.getContext('webgl');
	if (!gl) {
		alert('Your browser does not support WebGL');
	}
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//
	// Create shaders
	// 
	const vertexShaderText = await(await fetch("simple.vs")).text();
	const fragmentShaderText = await(await fetch("simple.fs")).text();
	const shaderProgram = initShaderProgram(gl, vertexShaderText, fragmentShaderText);

	//
	// load a projection matrix onto the shader
	// 
	const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	const projectionMatrix = mat4.create();
	let ylow = INITIAL_YLOW
	let yhigh = INITIAL_YHIGH
	let xlow = INITIAL_XLOW
	let xhigh = INITIAL_XHIGH
	mat4.ortho(projectionMatrix, xlow, xhigh, ylow, yhigh, -1, 1);
	gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);


	//
	// Create content to display
	//


	//
	// Register Listeners
	//
	addEventListener("click", click);
	function click(event) {
		console.log("click");
		const xWorld = xlow + event.offsetX / gl.canvas.clientWidth * (xhigh - xlow);
		const yWorld = ylow + (gl.canvas.clientHeight - event.offsetY) / gl.canvas.clientHeight * (yhigh - ylow);
		// Do whatever you want here, in World Coordinates.
	}

	addEventListener("mousewheel", mousewheel);
	function mousewheel(event) {
		console.log("click");
		const xWorld = xlow + event.offsetX / gl.canvas.clientWidth * (xhigh - xlow);
		const yWorld = ylow + (gl.canvas.clientHeight - event.offsetY) / gl.canvas.clientHeight * (yhigh - ylow);
		// Do whatever you want here, in World Coordinates.
	}

	addEventListener("wheel", (event) => {
		const xWorld = xlow + event.offsetX / gl.canvas.clientWidth * (xhigh - xlow);
		const yWorld = ylow + (gl.canvas.clientHeight - event.offsetY) / gl.canvas.clientHeight * (yhigh - ylow);

		const DELTA_MODIFIER = 0.006;
		const deltaxhigh = ((xhigh - xWorld) * 0.3) * (event.wheelDelta * DELTA_MODIFIER);
		const deltaxlow = ((xlow - xWorld) * 0.3) * (event.wheelDelta * DELTA_MODIFIER);

		const deltayhigh = ((yhigh - yWorld) * 0.3) * (event.wheelDelta * DELTA_MODIFIER);
		const deltaylow = ((ylow - yWorld) * 0.3) * (event.wheelDelta * DELTA_MODIFIER);

		xlow += deltaxlow;
		xhigh += deltaxhigh;

		ylow += deltaylow;
		yhigh += deltayhigh;

		if (xlow < INITIAL_XLOW) {
			xlow = INITIAL_XLOW
		}
		if (xhigh > INITIAL_XHIGH) {
			xhigh = INITIAL_XHIGH
		}
		if (ylow < INITIAL_YLOW) {
			ylow = INITIAL_YLOW
		}
		if (yhigh > INITIAL_YHIGH) {
			yhigh = INITIAL_YHIGH
		}

		mat4.ortho(projectionMatrix, xlow, xhigh, ylow, yhigh, -1, 1);
		gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);
	})

	//
	// Main render loop
	//
	let previousTime = 0;
	function redraw(currentTime){
		currentTime *= .001; // milliseconds to seconds
		let DT = currentTime - previousTime;
		if(DT > .1)
			DT = .1;
		previousTime = currentTime;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		drawRectangle(gl, shaderProgram, xlow, ylow, xhigh, yhigh, [1,0,0,1]); // override the default color with red.
		
		requestAnimationFrame(redraw);
	}
	requestAnimationFrame(redraw);
};

