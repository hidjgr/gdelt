window.global ||= window;

import decompose from "rectangle-decomposition";

function isVisible(latBox: number, lngBox: number, coords: object) {
    return coords && (Math.abs(latBox-coords.lat) < 1) && (Math.abs(lngBox-coords.lng) < 1);
}


function checkPoints(gs: Function, sg: Function, boxSize: number) {
	var pixels, latBox, lngBox, col;
	
	const matrix = []

	const visible = [];
	for (var j = -(180/boxSize); j < (180/boxSize); j++) {
		col = []
		for (var i = -(90/boxSize); i < (90/boxSize); i++) {
			lngBox = (j+0.5)*boxSize;
			latBox = (i+0.5)*boxSize;
			pixels = gs(latBox, lngBox);
			if (isVisible(latBox, lngBox, sg(pixels.x, pixels.y))) {
			    col.push(1);
			} else {
				col.push(0);
			}
		}
		matrix.push(col);
		visible.push(col.includes(1));
	}

	const splits = [];

	for (j = 1; j < visible.length; j++) {
		if (!visible[j] && visible[j-1]) splits.push(j)
	}

	splits.push(visible.length);

	var start = 0;

	const zones: object[] = [];

	splits.forEach((element) => {
		zones.push({start: start, end: element});
		start = element;
	})


	return {matrix: matrix, zones: zones, visible: visible};
}

function pointsToVertices(matrix: number[][], zoneBounds: object[], visible: boolean[]) {
	var regions: object[] = [];

	var moveDir = {x: 0, y: -1}, lookDir;

	const zones = zoneBounds.map((z) => { return {blocks: matrix.slice(z.start, z.end), start: z.start, end: z.end}})

	zones.forEach((zone) => {

		const region: number[][] = [];
		const start = {x: -1, y: -1};

		zone.blocks.forEach((ej, j) => {
			if (start.x === -1)
				ej.forEach((ei, i) => {
					if ((start.x === -1) && (ei === 1)) {
						start.x = j;
						start.y = i;
						return;}})});

		var posX = start.x, posY = start.y;

		const region_not_empty = visible.slice(zone.start, zone.end).includes(true);

		while (true && region_not_empty) {


			lookDir = {x: (moveDir.x + moveDir.y - 1)/2, y: (moveDir.y - moveDir.x - 1)/2}

			while ((posX+lookDir.x === -1)
				|| (posX+lookDir.x === zone.blocks.length)
				|| (posY+lookDir.y === -1)
				|| (posY+lookDir.y === zone.blocks[0].length)
				|| (zone.blocks[posX+lookDir.x][posY+lookDir.y] != 1)
			      )
				lookDir = {x: -1-lookDir.y, y: lookDir.x};

			if ((!(region.length === 0)) && (region[0][0] === posX) && (region[0][1] === posY)) break;

			if ((moveDir.x != (lookDir.x + lookDir.y + 1)) || (moveDir.y != (lookDir.y - lookDir.x))) {
				moveDir = {x: lookDir.x + lookDir.y + 1, y: lookDir.y - lookDir.x};
				region.push([posX, posY]);
			}

			posX += moveDir.x;
			posY += moveDir.y;

		}

		if (region_not_empty) regions.push(region.map(r => [r[0]+zone.start, r[1]]));
	})

	return regions;
}

export function decomposeRegions(gs: Function, sg: Function, boxSize: number) {
	const {matrix, zones, visible} = checkPoints(gs, sg, boxSize);
	const regions = pointsToVertices(matrix, zones, visible);
	return decompose(regions).map(reg => reg.map(corner => [corner[0]*boxSize - 180, corner[1]*boxSize - 90]));
}
