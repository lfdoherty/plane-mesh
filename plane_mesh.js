
const f2 = require('vectypes-float2')

module.exports = function createMesh(subdivisions){//: f2.Float2Type = f2.vec(128, 128)) {
	f2.as(subdivisions).assertInts()
	if (subdivisions.x < 1 || subdivisions.y < 1) {
		throw new Error('subdivisions must be at least 1x1');
	}


	const manyTriangles = subdivisions.x * subdivisions.y * 4;//four tris per grid square
	const manyVertices = ((subdivisions.x + 1) * (subdivisions.y + 1)) + (subdivisions.x * subdivisions.y);
	const vertices = new Float32Array(manyVertices * 3);
	const indices = new Uint16Array(manyTriangles * 3);
	//we can compute UV from the untransformed vertex positions in the vertex shader

	function computeVertexIndex(x, y){
		return (y * (subdivisions.x+1 + subdivisions.x)) + x;
	}
	function computeVertexIndexMiddle(x, y) {
		return (y * (subdivisions.x+1 + subdivisions.x)) + (subdivisions.x+1) + x;
	}

	{
		let index = 0;
		for (let y = 0; y <= subdivisions.y; ++y) {
			for (let x = 0; x <= subdivisions.x; ++x) {
				vertices[index++] = ((x / subdivisions.x) * 2) - 1;
				vertices[index++] = ((y / subdivisions.y) * 2) - 1;
				vertices[index++] = 0;
			}
			//middle row
			if (y < subdivisions.y) {
				for (let x = 0; x < subdivisions.x; ++x) {
					vertices[index++] = (((x + .5) / subdivisions.x) * 2) - 1;
					vertices[index++] = (((y + .5) / subdivisions.y) * 2) - 1;
					vertices[index++] = 0;
				}
			}
		}
		if(index !== vertices.length){
			throw new Error(`mismatch error (vertices): ${index} ${vertices.length}`);
		}
	}
	{
		let index = 0;
		for (let y = 0; y < subdivisions.y; ++y) {
			for (let x = 0; x < subdivisions.x; ++x) {

				indices[index++] = computeVertexIndex(x, y);
				indices[index++] = computeVertexIndexMiddle(x, y);
				indices[index++] = computeVertexIndex(x, y + 1);

				indices[index++] = computeVertexIndex(x, y);
				indices[index++] = computeVertexIndex(x + 1, y);
				indices[index++] = computeVertexIndexMiddle(x, y);

				indices[index++] = computeVertexIndex(x + 1, y);
				indices[index++] = computeVertexIndex(x + 1, y + 1);
				indices[index++] = computeVertexIndexMiddle(x, y);

				indices[index++] = computeVertexIndex(x, y + 1);
				indices[index++] = computeVertexIndexMiddle(x, y);
				indices[index++] = computeVertexIndex(x + 1, y + 1);
			}
		}
		if (index !== indices.length) {
			throw new Error(`mismatch error (indices): ${index} ${indices.length}`);
		}
	}

	return {
		vertices: vertices,
		indices: indices,
		manyVertices: manyVertices,
		manyTriangles: manyTriangles,
	}
}
