var InitDemo = function () {
    loadTextResource('/shader/shader_vertex_default.glsl', function(vsErr, vsText) {
        if (vsErr) {
            alert('Fatal error getting vertex shader (see console)');
            console.error(vsErr);
        } else {
            loadTextResource('/shader/shader_fragment_default.glsl', function(fsErr, fsText) {
                if (fsErr) {
                    alert('Fatal error getting fragment shader (see console)');
                    console.error(fsErr);
                } else {
                    RunDemo(vsText, fsText);
                }
            })
        }
    })
}

var RunDemo = function (vertexShaderText, fragmentShaderText) {
    console.log('This is working');
    

    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
    }

    // set the color it is going to use to paint
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }
    

    //
    // Create buffer
    //
    var triangleVertices = triangleList;

    var triangleColorsBase = 
    [// R, G, B
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
    ];

    var triangleColors = [];

    // repeat triangleColors for 3 times using a for loop
    for (var i = 0; i < triangleVertices.length / 2; i++) {
        triangleColors = triangleColors.concat(triangleColorsBase);
    }
    
    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    var triangleColorBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.STATIC_DRAW);
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 * Float32Array.BYTES_PER_ELEMENT, // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(colorAttribLocation);
    

    gl.useProgram(program);

    var matWorldUnifromLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUnifromLocation = gl.getUniformLocation(program, 'mView');
    var matProjUnifromLocation = gl.getUniformLocation(program, 'mProj');
    
    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    // mat4.identity(viewMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -100], [0, 0, 0], [0, 1, 0]);
    // mat4.identity(projMatrix);
    mat4.ortho(projMatrix, -20, 5, -5, 20, 0.1, 1000.0);
    // mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0)

    gl.uniformMatrix4fv(matWorldUnifromLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUnifromLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUnifromLocation, gl.FALSE, projMatrix);

    //
    // Main render loop
    //
    var loop = function () {
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
        
        gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length / 2);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}