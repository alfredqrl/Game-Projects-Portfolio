var render_teapot = function (gl, model, program, angle, offset) {
    //
    //  Specify Shder Program
    //
    gl.useProgram(program);

    //
    // Create buffer
    //
    var meshVertices = model.meshes[0].vertices;
	var meshIndices = [].concat.apply([], model.meshes[0].faces);
	var meshNormals = model.meshes[0].normals;
    
    //
    // Transfer data to buffer/GPU
    //
    var vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshVertices), gl.STATIC_DRAW);

    var indexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(meshIndices), gl.STATIC_DRAW);

    var normalBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshNormals), gl.STATIC_DRAW);


    //
    // Specify how to interpret buffer data
    //
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    if (positionAttribLocation >= 0) {
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(positionAttribLocation);    
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject);
    var normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
    if (normalAttribLocation >= 0) {
        gl.vertexAttribPointer(
            normalAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.TRUE,
            3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(normalAttribLocation);
    }
        
    //
    // Create MVP matrix
    //
    var matModelUnifromLocation = gl.getUniformLocation(program, 'mModel');
    var matViewUnifromLocation = gl.getUniformLocation(program, 'mView');
    var matProjUnifromLocation = gl.getUniformLocation(program, 'mProj');
    
    // Model matrix
    var modelMatrix= mat4.create();
    var translate = mat4.create();
    mat4.fromTranslation(translate, [offset, -3, 0]);
    var rotate = mat4.create();
    mat4.rotate(rotate, rotate, 0.01*angle, [0.1, 1, 0]);
    mat4.multiply(modelMatrix, rotate, modelMatrix);
    mat4.multiply(modelMatrix, translate, modelMatrix);
    
    //console.log(document.getElementById('target').textContent)
    
    let resultArray = []; // 初始化结果数组

    try {
        let textContent = document.getElementById('target').textContent;

    // 使用 split 将字符串分割为数组，并移除空字符串元素
        let splitContent = textContent.split(',').filter(Boolean);

        
      
        resultArray = splitContent.map(Number);
    
    } catch (error) {
    // 处理任何错误，比如无法找到元素
        console.error("An error occurred: ", error);
    }



    console.log(resultArray); // 输出结果数组
        
    // View matrix
    var cameraPos = [0, 5, -25];
    var cameraLookAtPoint = [0, 0, 0];
    var cameraUp = resultArray;
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, cameraPos, cameraLookAtPoint, cameraUp);

    
    
    // Projection matrix
    var canvas = document.getElementById('game-surface');
    var projMatrix = mat4.create();
    mat4.perspective(projMatrix, glMatrix.toRadian(30), canvas.width / canvas.height, 0.1, 1000.0)


    gl.uniformMatrix4fv(matModelUnifromLocation, gl.FALSE, modelMatrix);
    gl.uniformMatrix4fv(matViewUnifromLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUnifromLocation, gl.FALSE, projMatrix);

    //
    // Lighting information
    //
    var KaUniformLocation = gl.getUniformLocation(program, 'light.Ka');
    var KdUniformLocation = gl.getUniformLocation(program, 'light.Kd');
    var KsUniformLocation = gl.getUniformLocation(program, 'light.Ks');
    var shininessValUniformLocation = gl.getUniformLocation(program, 'light.shininessVal');
    var ambientColorUniformLocation = gl.getUniformLocation(program, 'light.ambientColor');
    var diffuseColorUniformLocation = gl.getUniformLocation(program, 'light.diffuseColor');
    var specularColorUniformLocation = gl.getUniformLocation(program, 'light.specularColor');
    var lightPositionUniformLocation = gl.getUniformLocation(program, 'light.lightPos');
    var cameraPosUniformLocation = gl.getUniformLocation(program, 'cameraPos');

    gl.uniform1f(KaUniformLocation, 0.15);
    gl.uniform1f(KdUniformLocation, 1.0);
    gl.uniform1f(KsUniformLocation, 0.5);
    gl.uniform1f(shininessValUniformLocation, 70.0);
    gl.uniform3f(ambientColorUniformLocation, 1.0, 0.2, 0.2);
    gl.uniform3f(diffuseColorUniformLocation, 0.5, 0.5, 0.5);
    gl.uniform3f(specularColorUniformLocation, 1.0, 1.0, 1.0);
    gl.uniform3f(lightPositionUniformLocation, 0.0, 20.0, -20.0);
    gl.uniform3f(cameraPosUniformLocation, cameraPos[0], cameraPos[1], cameraPos[2]);
    
    //
    // Draw teapot
    //
    gl.drawElements(gl.TRIANGLES, meshIndices.length, gl.UNSIGNED_SHORT, 0);
}