
class Node {
	constructor(cells, isMax, slots, move, depth, token) {
		this.utility = 0;
		this.cells = cells;
		this.isMax = isMax;
		this.slots = slots;
		this.move = move;
		this.depth = depth;
		this.token = token;
		this.enemyToken = token == 'X'? 'O' : 'X';
	}

	makeDescendants() {
		let children = new Array();
		let totalChildren = this.slots.length;
		
		// if(Util.isSymmetric(this.cells))
		// 	totalChildren = 4;
		
		for(let i = 0; i < totalChildren; i++) {
			if(this.slots[i] < this.cells.length) {
				let temp = [];
				for (let j = 0; j < this.cells.length; j++)
					temp[j] = this.cells[j].slice();

				let temp_2 = this.slots.slice(); //copy of array
				temp_2[i]++;
				if(this.isMax)
					temp[this.slots[i]][i] = this.token;
				else
					temp[this.slots[i]][i] = this.enemyToken;
				children.push(new Node(temp, !this.isMax, temp_2, i, new Number(this.depth + 1), new String(this.token)));
			}
		}
		
		return children;
	}


	compareTo(other) {
		if(this.utility > other.utility)
			return 1;
		else if(this.utility == other.utility) {
			return 0;
		}
		else
			return -1;			
	}

	getMove() { return this.move; }
	getDepth() { return this.depth; }
	getToken() { return this.token; }
	getEnemyToken() { return this.enemyToken; }
}
