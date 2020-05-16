let morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb+srv://sanj_31:sanjpal@todo-mqzgw.mongodb.net/test?retryWrites=true&w=majority',
{ useNewUrlParser: true , useUnifiedTopology: true });

//create a schema 
var todoSchema = new mongoose.Schema({
	name: String,
	item: String
});

//todo model

var Todo = mongoose.model('Todo', todoSchema);

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

	app.use(morgan("dev"));

	app.get('/todo', function(req, res){

		//get data from mongoose and pass it to view
		
		Todo.find({}, function(err, data){
			if(err) throw err;
			res.render('todo', {todos: data})
		});		

	});

	app.post('/todo', urlencodedParser, function(req, res){

		//get data from view and add to mongodb
		console.log(req.body);
		var newTodo = Todo(req.body).save(function(err,data){
			if(err) throw err;
			res.json(data);
		});
	});


	app.delete('/todo/:id', function(req, res){

		//delete the required item from mongodb
		console.log(req.params.id)
		Todo.find({_id: req.params.id.replace(/\-/g, " ")}).remove(function(err, data){
			if(err) throw err;
			res.json(data);
		});
		
	});
}
