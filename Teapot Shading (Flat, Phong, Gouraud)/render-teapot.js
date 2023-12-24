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
    var modelMatrix = mat4.create();

    var translate = mat4.create();
    //
    // Task 2.1.1 Implement Model Translation Matrix
    // uncomment the following line and fill in the blank to form a translation matrix
    //   that can translate the teapot along the x-axis by offset units
    // Do not use mat4.fromTranslation() or other functions, please set the matrix manually
    // The desired effect is the same as uncomment the following line of code
    // mat4.fromTranslation(translate, [offset, 0, 0]);
    //
    // Your code start from here: (see https://glmatrix.net/docs/module-mat4.html)
    // mat4.set(translate, ......)
    mat4.set(translate,
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        offset, 0, 0, 1
    );


    var rotate = mat4.create();
    //
    // 2.1.2 Implement Model Rotation Matrix
    // uncomment the following line and fill in the blank to form a rotation matrix
    //   that can rotate the teapot around y-axis by 0.01*angle radians
    // Do not use mat4.rotate() or other functions, please set the matrix manually
    // The desired effect is the same as uncomment the following line of code
    // mat4.rotate(rotate, rotate, 0.01*angle, [0, 1, 0]);
    //
    // Your code start from here: (see https://glmatrix.net/docs/module-mat4.html)
    // mat4.set(rotate, ......)

    mat4.set(rotate,
        Math.cos(0.01 * angle), 0, Math.sin(0.01 * angle), 0,
        0, 1, 0, 0,
        -Math.sin(0.01 * angle), 0, Math.cos(0.01 * angle), 0,
        0, 0, 0, 1
    );
    //
    // 2.1.3 Matrix Transformation Order Matters!
    // Combine translation and rotation by matrix multiplication
    // Try to change the order of the following two lines and see what happens
    //

    mat4.multiply(modelMatrix, rotate, modelMatrix);
    mat4.multiply(modelMatrix, translate, modelMatrix);

    // View matrix
    var cameraPos = [0, 8, -25];
    var cameraLookAtPoint = [0, 3, 0];
    var cameraUp = [0, 1, 0];
    var viewMatrix = mat4.create();
    //
    // 2.1.4 Implement View Matrix
    // Please comment the following line and set the View matrix manually
    // Camera parameters are defined above
    //mat4.lookAt(viewMatrix, cameraPos, cameraLookAtPoint, cameraUp);
    // Your could start from here: (please comment the above line)
    // mat4.set(viewMatrix, ......)
    // Calculate the view matrix manually
    var forward = vec3.create();
    vec3.subtract(forward, cameraLookAtPoint, cameraPos);
    vec3.normalize(forward, forward);

    var right = vec3.create();
    vec3.cross(right, forward, cameraUp);
    vec3.normalize(right, right);

    var up = vec3.create();
    vec3.cross(up, right, forward);
    vec3.normalize(up, up);

    viewMatrix[0] = right[0];
    viewMatrix[1] = up[0];
    viewMatrix[2] = -forward[0];
    viewMatrix[3] = 0.0;

    viewMatrix[4] = right[1];
    viewMatrix[5] = up[1];
    viewMatrix[6] = -forward[1];
    viewMatrix[7] = 0.0;

    viewMatrix[8] = right[2];
    viewMatrix[9] = up[2];
    viewMatrix[10] = -forward[2];
    viewMatrix[11] = 0.0;

    viewMatrix[12] = -vec3.dot(right, cameraPos);
    viewMatrix[13] = -vec3.dot(up, cameraPos);
    viewMatrix[14] = vec3.dot(forward, cameraPos);
    viewMatrix[15] = 1.0;


    // Projection matrix
    var canvas = document.getElementById('demo-surface');
    var zNear = 0.1;
    var zFar = 1000.0;
    var fovy = 30.0 / 180.0 * Math.PI;
    var aspectRito = canvas.width / canvas.height;
    var projMatrix = mat4.create();
    //
    // 2.1.5 Implement Projection Matrix
    // Please comment the following line and set the Projection matrix manually
    // projection parameters are defined above
    //mat4.perspective(projMatrix, fovy, aspectRito, zNear, zFar)
    // Your could start from here: (please comment the above line)
    // mat4.set(projMatrix, ......)
    mat4.set(
        projMatrix,
        1 / (aspectRito * Math.tan(fovy / 2)), 0, 0, 0,
        0, 1 / Math.tan(fovy / 2), 0, 0,
        0, 0, -(zFar + zNear) / (zFar - zNear), -1,
        0, 0, -(2 * zFar * zNear) / (zFar - zNear), 0
      );

    // transfer MVP matrix to shader
    gl.uniformMatrix4fv(matModelUnifromLocation, gl.FALSE, modelMatrix);
    gl.uniformMatrix4fv(matViewUnifromLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUnifromLocation, gl.FALSE, projMatrix);

    //
    // Lighting Parameters
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

    // transfer lighting parameters to shader
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