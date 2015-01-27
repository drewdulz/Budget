Expenses = new Mongo.Collection("expenses");
var weekTotal = [0, 0];
var monthTotal = [0, 0];
var allTimeTotal = [0, 0];
var thisWeekStart = moment().day(0).hour(0).minute(0).second(0); //Should be one day before we want the dates to display
var thisWeekEnd = moment().day(7).hour(0).minute(0).second(0);
var thisMonthStart = moment().date(31).hour(0).minute(0).second(0).subtract(1, 'month'); //Should be one day before we want the dates to display
var thisMonthEnd = moment().date(31).hour(0).minute(0).second(0);
var allTimeStart = moment("2000-01-01"); //Should be one day before we want the dates to display
var allTimeEnd = moment("2100-01-01");
var mode = "week";

var thisPeriodStart = thisWeekStart;
var thisPeriodEnd = thisWeekEnd;
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
  
  Template.budgetSummary.helpers({
		weekSpending: function () {
      return weekTotal[0];
		},
		weekFood: function () {
	      return weekTotal[1];
		},
    buttonText: function() {
        return mode;
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
			thisPeriodStart = thisWeekStart;
			thisPeriodEnd = thisWeekEnd;
			filterDates();
		},
		"click .thisMonth": function () {
			thisPeriodStart = thisMonthStart;
			// console.log(thisPeriodStart);
			thisPeriodEnd = thisMonthEnd;
			// console.log(thisPeriodEnd);
			filterDates();
		},	
		"click .allTime": function () {
			thisPeriodStart = allTimeStart;
			// console.log(thisPeriodStart);
			thisPeriodEnd = allTimeEnd;
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
  
  var isBetween = function(date, startDate, endDate) {
    if( moment(date).isBefore(moment(endDate)) && moment(date).isAfter(moment(startDate))) {
      return true;
    } else {
      return false;
    }
  };
  
  var filterDates = function() {
    // Get the expenses
    var expenses = Expenses.find({});
    // Push all of the expenses fom the active week into an array
    periodExpenses = [];
    expenses.forEach(function(expense) {
      // console.log(expense.date);
      if(isBetween(expense.date, thisPeriodStart, thisPeriodEnd)) {
        periodExpenses.push(expense);
      }
      
      // Calculate the totals for the graph
      if(isBetween(expense.date, thisWeekStart, thisWeekEnd)) {
        if(expense.category = "Spending") {
          weekTotal[0] += parseInt(expense.amount);
        } else {
          weekTotal[1] += parseInt(expense.amount);
        }
      }
      
      if(isBetween(expense.date, thisMonthStart, thisMonthEnd)) {
        if(expense.category = "Spending") {
          monthTotal[0] += parseInt(expense.amount);
        } else {
          monthTotal[1] += parseInt(expense.amount);
        }
      }
      
      if(isBetween(expense.date, allTimeStart, allTimeEnd)) {
        if(expense.category = "Spending") {
          allTimeTotal[0] += parseInt(expense.amount);
        } else {
          allTimeTotal[1] += parseInt(expense.amount);
        }
      }
      
      //sort the rest of the graph and shit
    });
    Session.set("expenses", periodExpenses);
    Session.get("expenses");
  };
  
}





