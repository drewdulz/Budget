Expenses = new Mongo.Collection("expenses");
var weeklyExpenses = 0;
var thisWeekStart = moment().day(1).hour(0).minute(0).second(0);
console.log(thisWeekStart);
var thisWeekEnd = moment().day(7).hour(0).minute(0).second(0);
console.log(thisWeekEnd);


if (Meteor.isClient) {
	// This code only runs on the client
	Template.body.helpers({
		expenses: function () {
			var expenses = Expenses.find({});
			expenses.forEach(function(expense) {
				console.log(expense.date);
				if( moment(expense.date).isBetween('2015-01-01', '2015-02-25')) {
					console.log("Between");
				}
		    });
		}
	});

	Template.expenseInput.rendered = function() {
		$('#datetimepicker6').datetimepicker({
      format: 'MMM D YYYY',
      pickTime: false
      
    });
	}

  	Template.expenseInput.events({
		"click .add-expense": function () {
			console.log("Adding Expense");
			var date = document.getElementById('datetimepicker6').value;
			var store = document.getElementById('store').value;
			var desc = document.getElementById('description').value;
			var amount = document.getElementById('amount').value;
			var category = document.getElementById('category').value;

			Expenses.insert({
				date: date,
				store: store,
				description: desc,
				amount: amount,
				category: category
		    });
			// Clear all the inputs
			$('input').val('');

			// Update the Graphs
			updateGraphs();
		},	
	});

  	Template.expense.events({
		"click .delete-button": function () {
			Expenses.remove(this._id);

		},	
	});

	var updateGraphs = function () {
		weeklyExpenses = 0;
		var expenseArray = Expenses.find().fetch();
		expenseArray.forEach(function(expense) {
			weeklyExpenses += parseFloat(expense.amount);
	    });
	    console.log(weeklyExpenses);
	};
}




