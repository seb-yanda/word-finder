const Grid = require('../models/Grid');
const _ = require('lodash');

/**
 * @desc - generates and returns a new grid
 * @method - GET
 */
exports.newGrid = (req, res) => {
	try {

		const startTime = Date.now()

		let words = null;
		if(req.body.words) {
			words = req.body.words.map( w => w.string );
		}
		const grid = new Grid(+req.query.width,null,words);

		const gridIn2D = grid.getGridIn2D()
		const afterGrid = Date.now()

		console.log( "Grid generated in ", (afterGrid - startTime) / 1000, " seconds")

		return res.send({
			words: _.map(grid.words, (word) => ({
				isSelected: false,
				string: word,
				fromCell: null,
				toCell: null,
			})),
			grid: {
				width: grid.width,
				size: grid.size,
				gridIn2D: gridIn2D,
			},
		});
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

/**
 * @desc - checks if the selection is valid and a word is found
 * @method - POST
 */
exports.selectWord = (req, res) => {
	try {
		const { fromCell, toCell } = req.body.selection;
		const words = req.body.words;
		const grid = new Grid(
			+req.body.grid.width,
			req.body.grid.gridIn2D,
			words
		);

		if (!grid.isValidSelection(fromCell, toCell)) {
			return res.send({
				isValidWord: false,
				message:
					'Invalid selection direction. Selection line must be green.',
			});
		}

		const selectedString = grid
			.getWordBetweenIndexes(fromCell, toCell)
			.join('');

		console.log(selectedString)
		console.log(words.map( (w) => w.string));

		if (_.find(words, (word) => word.string === selectedString)) {
			return res.send({
				isValidWord: true,
				words: _.map(words, (word) => {
					if (word.string === selectedString) {
						word.isSelected = true;
						word.fromCell = fromCell;
						word.toCell = toCell;
					}

					return word;
				}),
			});
		} else {
			return res.send({
				isValidWord: false,
				message: 'The selected word is not in the list. Try again!',
			});
		}
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};
