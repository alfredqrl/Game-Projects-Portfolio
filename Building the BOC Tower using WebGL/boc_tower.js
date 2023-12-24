/* 
    @author: Qian Ruiling
    @date: 2023/10/5
    @description: Build the BOC tower with 22 triangles using webgl
*/
//
// create the 2D base triangle by specifying the three vertices in homogeneous coordinates
//
var createBaseTriangleVertices = function () {
    var baseTriangleVertices = [
        vec3.fromValues( 0.0, 0.0, 1.0 ), // first vertex
        vec3.fromValues( -1.0, 0.0, 1.0 ), // second vertex
        vec3.fromValues( -0.5, Math.sqrt(3)/2.0, 1.0 ) // third vertex
    ];
    return baseTriangleVertices;
}

//
// transform all three vertices of a triangle by mTrans
//
var transformTriangleVertices = function (triangleVertices, mTrans) {
    for (var i = 0; i < triangleVertices.length; i++) {
        vec3.transformMat3(triangleVertices[i], triangleVertices[i], mTrans);
    }
}

//
// convert triangle vertices (in vec3) to a list of vertices
//
var convertToList = function (triangleVertices) {
    var triangleVerticesList = [];
    for (var i = 0; i < triangleVertices.length; i++) {
        triangleVerticesList.push(triangleVertices[i][0]);
        triangleVerticesList.push(triangleVertices[i][1]);
    }
    return triangleVerticesList;
}

//
// Task 1 starts from here
// ToDo: 1. create 22 triangles by calling function createBaseTriangleVertices();
//       2. create transformation matrix for each triangle by using mat3.fromValues();
//          You can form the transformation matrix by matrix multiplication of translation, rotation, scaling and shearing matrices.
//       3. transform each triangle by using transformTriangleVertices();
//       4. concatenate all the triangles into a single list by using convertToList() for webgl to render; (already done for you)
//

//create triangle list
var triangleList = [];

//
// create first triangle (base triangle, no transformation)
//
triangleList.push(createBaseTriangleVertices());

//
// create second triangle (apply translation)
//
triangleList.push(createBaseTriangleVertices());
// create translation matrix
var vTrans = vec2.fromValues(10, 0);
var mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
//
// take care of the order, this creates the following new 3*3 matrix:
//          1  0  10
// mTrans = 0  1  0
//          0  0  1
//
// apply translation matirx
transformTriangleVertices(triangleList[0], mTrans);

//
// create third triangle (apply rotation and translation)
//
triangleList.push(createBaseTriangleVertices());
// create rotation matrix
var angle = 30.0 / 180.0 * Math.PI;
var mRot = mat3.fromValues(Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1);
// create translation matrix
var vTrans = vec2.fromValues(8, 0);
var mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
// combine rotation and translation matrices
var mTransRot = mat3.create();
mat3.multiply(mTransRot, mTrans, mRot);
// apply transformation matrix
transformTriangleVertices(triangleList[1], mTransRot);
var vTrans = vec2.fromValues(0, 10);
var mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
transformTriangleVertices(triangleList[1], mTrans);


triangleList.push([
    vec3.clone(triangleList[1][0]),
    vec3.clone(triangleList[1][1]),
    vec3.clone(triangleList[1][2])
]);
console.log(triangleList);
var vTrans2 = vec2.fromValues(0, 1);
var mTrans2 = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans2[0], vTrans2[1], 1);
transformTriangleVertices(triangleList[3], mTrans2);
console.log(triangleList[3] == triangleList[1]);

angle = 60.0 / 180.0 * Math.PI;
mRot = mat3.fromValues(Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1);
vTrans = vec2.fromValues(-6.39, 10.94);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
mTransRot = mat3.create();
mat3.multiply(mTransRot, mTrans, mRot);
transformTriangleVertices(triangleList[3], mTransRot);

triangleList.push([
    vec3.clone(triangleList[1][0]),
    vec3.clone(triangleList[1][1]),
    vec3.clone(triangleList[1][2])
]);
// move down for 10 unit
vTrans = vec2.fromValues(0, -1);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
transformTriangleVertices(triangleList[4], mTrans);

triangleList.push([
    vec3.clone(triangleList[3][0]),
    vec3.clone(triangleList[3][1]),
    vec3.clone(triangleList[3][2])
]);
// move down for 1 unit
vTrans = vec2.fromValues(0, -1);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
transformTriangleVertices(triangleList[5], mTrans);

triangleList.push([
    vec3.clone(triangleList[1][0]),
    vec3.clone(triangleList[1][1]),
    vec3.clone(triangleList[1][2])
]);
vTrans = vec2.fromValues(0, -2);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
transformTriangleVertices(triangleList[6], mTrans);

triangleList.push([
    vec3.clone(triangleList[3][0]),
    vec3.clone(triangleList[3][1]),
    vec3.clone(triangleList[3][2])
]);
vTrans = vec2.fromValues(0, -2);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
transformTriangleVertices(triangleList[7], mTrans);

triangleList.push([
    vec3.clone(triangleList[1][0]),
    vec3.clone(triangleList[1][1]),
    vec3.clone(triangleList[1][2])
]);
vTrans = vec2.fromValues(0, -3);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
transformTriangleVertices(triangleList[8], mTrans);

triangleList.push([
    vec3.clone(triangleList[3][0]),
    vec3.clone(triangleList[3][1]),
    vec3.clone(triangleList[3][2])
]);
vTrans = vec2.fromValues(0, -3);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
transformTriangleVertices(triangleList[9], mTrans);

triangleList.push([
    vec3.clone(triangleList[1][0]),
    vec3.clone(triangleList[1][1]),
    vec3.clone(triangleList[1][2])
]);
vTrans = vec2.fromValues(0, -4);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
transformTriangleVertices(triangleList[10], mTrans);

triangleList.push([
    vec3.clone(triangleList[3][0]),
    vec3.clone(triangleList[3][1]),
    vec3.clone(triangleList[3][2])
]);
// move down for 1 unit
vTrans = vec2.fromValues(0, -4);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1], 1);
transformTriangleVertices(triangleList[11], mTrans);

triangleList.push([
    vec3.clone(triangleList[3][0]),
    vec3.clone(triangleList[3][1]),
    vec3.clone(triangleList[3][2])
]);
// move left for 1 unit
vTrans = vec2.fromValues(0.88, -1.5);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[12], mTrans);

triangleList.push([
    vec3.clone(triangleList[1][0]),
    vec3.clone(triangleList[1][1]),
    vec3.clone(triangleList[1][2])
]);
// move left for 1 unit
vTrans = vec2.fromValues(0.88, -2.5);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[13], mTrans);

triangleList.push([
    vec3.clone(triangleList[3][0]),
    vec3.clone(triangleList[3][1]),
    vec3.clone(triangleList[3][2])
]);
// move left for 1 unit
vTrans = vec2.fromValues(0.88, -2.5);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[14], mTrans);

triangleList.push([
    vec3.clone(triangleList[1][0]),
    vec3.clone(triangleList[1][1]),
    vec3.clone(triangleList[1][2])
]);
// move left for 1 unit
vTrans = vec2.fromValues(0.88, -3.5);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[15], mTrans);

triangleList.push([
    vec3.clone(triangleList[3][0]),
    vec3.clone(triangleList[3][1]),
    vec3.clone(triangleList[3][2])
]);
// move left for 1 unit
vTrans = vec2.fromValues(0.88, -3.5);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[16], mTrans);

triangleList.push([
    vec3.clone(triangleList[1][0]),
    vec3.clone(triangleList[1][1]),
    vec3.clone(triangleList[1][2])
]);
// move left for 1 unit
vTrans = vec2.fromValues(0.88, -4.5);
mTrans = mat3.fromValues(1, 0, 0, 0, 1, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[17], mTrans);

// triangle 17 which is 0.9 times of before triangles
triangleList.push([
    vec3.clone(triangleList[3][0]),
    vec3.clone(triangleList[3][1]),
    vec3.clone(triangleList[3][2])
]);
vTrans = vec2.fromValues(0.9, -3.46);
mTrans = mat3.fromValues(1, 0, 0, 0, 0.9, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[18], mTrans);

triangleList.push([
    vec3.clone(triangleList[1][0]),
    vec3.clone(triangleList[1][1]),
    vec3.clone(triangleList[1][2])
]);
// move left for 1 unit
vTrans = vec2.fromValues(-0, -3.9);
mTrans = mat3.fromValues(1, 0, 0, 0, 0.9, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[19], mTrans);

triangleList.push([
    vec3.clone(triangleList[3][0]),
    vec3.clone(triangleList[3][1]),
    vec3.clone(triangleList[3][2])
]);
vTrans = vec2.fromValues(0.74, -2.9);
// narrower than triangle 17 and 18
mTrans = mat3.fromValues(0.9, 0, 0, 0, 0.8, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[20], mTrans);

triangleList.push([
    vec3.clone(triangleList[1][0]),
    vec3.clone(triangleList[1][1]),
    vec3.clone(triangleList[1][2])
]);
// move left for 1 unit
vTrans = vec2.fromValues(1.7, -3.3);
mTrans = mat3.fromValues(0.9, 0, 0, 0, 0.8, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[21], mTrans);


// bottom right 90 degrees triangle
triangleList.push([
    vec3.clone(triangleList[1][0]),
    vec3.clone(triangleList[1][1]),
    vec3.clone(triangleList[1][2])
]);
vTrans = vec2.fromValues(0, -7.35);
mTrans = mat3.fromValues(1, 0.5, 0, 0, 0.8, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[22], mTrans);

// bottom left 90 degrees triangle
triangleList.push([
    vec3.clone(triangleList[3][0]),
    vec3.clone(triangleList[3][1]),
    vec3.clone(triangleList[3][2])
])
vTrans = vec2.fromValues(0.9, 0.625);
mTrans = mat3.fromValues(1, -0.5, 0, 0, 0.8, 0, vTrans[0], vTrans[1],1);
transformTriangleVertices(triangleList[23], mTrans);

// convert trianlgeList to 1d array for webgl to render
triangleList = triangleList.map(convertToList);
triangleList = triangleList.reduce(function(a, b) {
    return a.concat(b);
}, []);