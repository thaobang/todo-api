var express = require('express');
var bodyparser = require('body-parser');;
var _ = require('underscore');
var app = express();

var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyparser.json());

app.get('/', function (req, res) {
	res.send('Todo Root App !');
});

app.get('/todos', function (req, res) {
	res.json(todos);
});

app.get('/todos/:id', function (req, res) {

	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if(matchedTodo){
			res.json(matchedTodo);
		} else {
			res.status(404).send();
		}
});

app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if(_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}

	body.description = body.description.trim();
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

// Delete
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if(!matchedTodo){
		res.status(400).json("error no item was found with that id");
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

// Put
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var validAttribute = {};

	if(!matchedTodo) {
		return res.status(400).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttribute.completed = body.completed;
	} else if (body.hasOwnProperty('completed')){
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) || body.description.trim().length > 0){
		validAttribute.description = body.description;
	} else if (body.hasOwnProperty('description')){
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttribute);
	res.json(matchedTodo);

	
});

app.listen(PORT, function () {
	console.log('Express is listening on port:' + PORT + '...');
});
