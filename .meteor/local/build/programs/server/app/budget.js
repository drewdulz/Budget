(function(){Expenses = new Mongo.Collection("expenses");
var weeklyExpenses = 0;
var thisPeriodStart = moment().day(0).hour(0).minute(0).second(0); //Should be one day before we want the dates to display
var thisPeriodEnd = moment().day(7).hour(0).minute(0).second(0);
var periodExpenses = [];



if (Meteor.isClient) {
	// This code only runs on the client
	
  //document.getElementById("datetimepicker6").innerHTML = "Johnny Bravo";
  
  Template.body.helpers({
		expenses: function () {
	      filterDates();
	      return periodExpenses;
		}
	});
  


	Template.expenseInput.rendered = function() {
		$('#datetimepicker6').datetimepicker({
      format: 'MMM D YYYY',
      pickTime: false
    });
	}

  // Set the date input value to a default
  Template.expenseInput.helpers({
    date: function () {
      return Session.get("defaultDate");
    }
  });
  Session.set("defaultDate", "Eastasia");
  
  
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
			// Clear all the input
			$('input').val('');

			// Update the Graphs
			updateGraphs();
		},	
	});

  	Template.dateRangeSelect.events({
		"click .thisWeek": function () {
			thisPeriodStart = moment().day(0).hour(0).minute(0).second(0); //Should be one day before we want the dates to display
			thisPeriodEnd = moment().day(7).hour(0).minute(0).second(0);
			filterDates();
		},
		"click .thisMonth": function () {
			thisPeriodStart = moment().date(31).hour(0).minute(0).second(0).subtract(1, 'month'); //Should be one day before we want the dates to display
			// console.log(thisPeriodStart);
			thisPeriodEnd = moment().date(31).hour(0).minute(0).second(0);
			// console.log(thisPeriodEnd);
			filterDates();
		},	
		"click .allTime": function () {
			thisPeriodStart = moment("2000-01-01"); //Should be one day before we want the dates to display
			// console.log(thisPeriodStart);
			thisPeriodEnd = moment("2100-01-01");
			// console.log(thisPeriodEnd);
			filterDates();
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
  
  var filterDates = function() {
    // Get the expenses
    var expenses = Expenses.find({});
    // Push all of the expenses fom the active week into an array
    periodExpenses = [];
    expenses.forEach(function(expense) {
      // console.log(expense.date);
      var isBefore = moment(expense.date).isBefore(thisPeriodStart);
      var isAfter = moment(expense.date).isAfter(thisPeriodEnd);
      // console.log(isBefore);
      // console.log(isAfter);
      if( !isBefore && !isAfter) {
        periodExpenses.push(expense);
      }
    });
    Session.set("expenses", periodExpenses);
    Session.get("expenses");
  }
  
}






})();
