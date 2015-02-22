Expenses = new Mongo.Collection("expenses");
var weekTotal = [0.00, 0.00];
var monthTotal = [0.00, 0.00];
var allTimeTotal = [0.00, 0.00];
var thisWeekStart = moment().day(0).hour(0).minute(0).second(0); //Should be one day before we want the dates to display
var thisWeekEnd = moment().day(7).hour(0).minute(0).second(0);
var thisMonthStart = moment().date(31).hour(0).minute(0).second(0).subtract(1, 'month'); //Should be one day before we want the dates to display
var thisMonthEnd = moment().date(31).hour(0).minute(0).second(0);
var allTimeStart = moment("2000-01-01"); //Should be one day before we want the dates to display
var allTimeEnd = moment("2100-01-01");
var mode = "week";
var weekChange; var monthChange;

var thisPeriodStart = thisWeekStart;
var thisPeriodEnd = thisWeekEnd;
var periodExpenses = [];

//Chart values
var ctx;
var weekChart;
var spendingColor = "#F7464A";
var foodColor = "#46BFBD";
var remainingColor = "#B4B4B4";


//Budget Values
var weekBudgetSpending = 50.00;
var weekBudgetFood = 100.00;
var monthBudgetSpending = (weekBudgetSpending / 7) * thisMonthEnd.diff(thisMonthStart, 'days');
console.log(monthBudgetSpending);
var monthBudgetFood = (weekBudgetFood / 7) * thisMonthEnd.diff(thisMonthStart, 'days');


var chartData = [
    {
        value: 0,
        color: spendingColor,
        highlight: "#FF5A5E",
        label: "Spending"
    },
    {
        value: 0,
        color: foodColor,
        highlight: "#5AD3D1",
        label: "Food"
    },
    {
        value: 100,
        color: remainingColor,
        highlight: "#C8C8C8",
        label: "Remaining"
    }
]

var chartOptions = {
  responsive: true, 
  showToolTip: false,
};


if (Meteor.isClient) { //THE ARRAY ISN'T GOING INTO THE FUNCTION PROPERLY SO THAT IT CAN ITERATE THROUGH THEM THE RIGHT WAY
// 	This code only runs on the client
  
  Template.body.helpers({
		expenses: function () {
      filterDates();
      // updateGraphs(); //update the graphs anytime the page is loaded.
      return periodExpenses;
		},
	});
  
  Template.budgetSummary.rendered = function() {
    //Initialize title
    console.log(thisPeriodStart);
    setTitleDates();
    Session.set("mode", mode);   
    
    // Render those charts
    console.log("Rendering Charts");
    // Week Chart
    ctx1 = document.getElementById("weekChart").getContext("2d");
    weekChart = new Chart(ctx1).Doughnut(chartData, chartOptions);
     var legend1 = weekChart.generateLegend();
     $('#weekChart').append(legend1);
    // Month Chart
    ctx2 = document.getElementById("monthChart").getContext("2d");
    monthChart = new Chart(ctx2).Doughnut(chartData, chartOptions);
//     var legend2 = monthChart.generateLegend();
//     $('#monthChart').append(legend2);
    updateGraphs(); //update the graphs anytime the page is loaded.
	}
  
  
  Template.budgetSummary.helpers({
		weekSpending: function () {
      return Session.get("weekSpending");
		},
		weekFood: function () {
	    return Session.get("weekFood");
		},
    monthSpending: function () {
      return Session.get("monthSpending");
		},
    monthFood: function () {
	    return Session.get("monthFood");
		},
    allTimeSpending: function () {
	    return Session.get("allTimeSpending");
		},
    allTimeFood: function () {
	    return Session.get("allTimeFood");
		},
    buttonText: function() {
      return Session.get("mode");
    },
    periodStart: function() {
      return Session.get("periodStart");
    },
    periodEnd: function() {
      return Session.get("periodEnd");
    },
    mode: function() {
      return Session.get("mode");
    },
    thisWeekStart: function() {
      return Session.get("thisWeekStart");
    },
    thisWeekEnd: function() {
      return Session.get("thisWeekEnd");
    },
    thisMonthStart: function() {
      return Session.get("thisMonthStart");
    },
    thisMonthEnd: function() {
      return Session.get("thisMonthEnd");
    },
	});
  
  Template.budgetSummary.events({
		"click #previous": function () {
      changePeriod("back");
		},	
    "click #next": function () {
      changePeriod("forward");
		},
	});
  


	Template.expenseInput.rendered = function() {
		$('#datetimepicker6').datetimepicker({
      format: 'MMM D YYYY',
      pickTime: false
    });
	}
  
  // Set the date input value to a default
  Template.expenseInput.helpers({
    // Add this in later to setup the deafult date
    defaultDate: function() {
      return Session.get("defaultDate");
    },
    
  });
  
  
  
  Template.expenseInput.events({
		"click .add-expense": function () {
			console.log("Adding Expense");
			var date = new Date(document.getElementById('datetimepicker6').value);
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
      // var expense = [{date: date, amount: amount, category: category}];      
      // console.log("Adding new expense: " + expense);
      updateGraphs();
    
		},	
	});

  	Template.dateRangeSelect.events({
		"click .thisWeek": function () {
      mode = "week";
      Session.set("mode", mode);
			thisPeriodStart = thisWeekStart;
			thisPeriodEnd = thisWeekEnd;
      setTitleDates();
			filterDates();
		},
		"click .thisMonth": function () {
      mode = "month";
      Session.set("mode", mode);
			thisPeriodStart = thisMonthStart;
			thisPeriodEnd = thisMonthEnd;
      setTitleDates();
			filterDates();
		},	
		"click .allTime": function () {
      mode = "allTime";
      Session.set("mode", mode);
			thisPeriodStart = allTimeStart;
			thisPeriodEnd = allTimeEnd;
      setTitleDates();
			filterDates();
		},		
	});

  Template.expense.events({
		"click .delete-button": function () {
			Expenses.remove(this._id);

		},	
	});

  var updateGraphs = function () {
    console.log("Updating the Graphs");
    weekTotal = [0.00, 0.00];
    monthTotal = [0.00, 0.00];
    allTimeTotal = [0.00, 0.000];
    weekChange = monthChange = false;
    var expenses = Expenses.find({}, {sort: {date: -1}})
    // console.log(expenses.fetch());
    
    // Calculate the totals for the graph
    expenses.forEach(function(expense) {
      if(isBetween(expense.date, thisWeekStart, thisWeekEnd)) {
        weekChange = true;
        if(expense.category == "Spending") {
          weekTotal[0] += parseFloat(expense.amount);
          weekTotal[0].toFixed(2);
        } else {
          weekTotal[1] += parseFloat(expense.amount);
          weekTotal[1].toFixed(2);
        }
      }

      if(isBetween(expense.date, thisMonthStart, thisMonthEnd)) {
        monthChange = true;
        if(expense.category == "Spending") {
          monthTotal[0] += parseFloat(expense.amount);
          monthTotal[0].toFixed(2);
        } else {
          monthTotal[1] += parseFloat(expense.amount);
          monthTotal[1].toFixed(2);
        }
      }

      if(expense.category == "Spending") {
        allTimeTotal[0] += parseFloat(expense.amount);
        allTimeTotal[0].toFixed(2);
      } else {
        allTimeTotal[1] += parseFloat(expense.amount);
        allTimeTotal[1].toFixed(2);
      }
    });
 
    Session.set("weekSpending", weekTotal[0]);
    Session.set("weekFood", weekTotal[1]);
    Session.set("monthSpending", monthTotal[0]);
    Session.set("monthFood", monthTotal[1]);
    Session.set("allTimeSpending", allTimeTotal[0]);
    Session.set("allTimeFood", allTimeTotal[1]);
    
    //Update the Charts
    if(weekChange) {
      if((weekTotal[0] + weekTotal[1]) > (weekBudgetSpending + weekBudgetFood)) {
        //Overbudget, do something to show it.
      }
      weekChart.segments[0].value = weekTotal[0];
      weekChart.segments[1].value = weekTotal[1];
      weekChart.segments[2].value = weekBudgetSpending + weekBudgetFood - weekTotal[0] - weekTotal[1];
      weekChart.update();
    }
    if (monthChange) {
      if((monthTotal[0] + monthTotal[1]) > (monthBudgetSpending + monthBudgetFood)) {
        //Overbudget, do something to show it.
      }
      monthChart.segments[0].value = monthTotal[0];
      monthChart.segments[1].value = monthTotal[1];
      monthChart.segments[2].value = monthBudgetSpending + monthBudgetFood - monthTotal[0] - monthTotal[1];
      monthChart.update();
    }

  };
  
  var isBetween = function(date, startDate, endDate) {
    if( moment(date).isBefore(moment(endDate)) && moment(date).isAfter(moment(startDate))) {
      return true;
    } else {
      return false;
    }
  };
  
  var filterDates = function() {
    console.log("getting the expenses in the active period");
    // Get the expenses
    var expenses = Expenses.find({}, {sort: {date: -1}})
    //TODO: this ^ can be made more efficinent now that the dates are sorted. Shouldn't have to iterate through them all. Can stop after the last one that is true.
    
    // Push all of the expenses fom the active week into an array AND format the date
    periodExpenses = [];
    expenses.forEach(function(expense) {
      if(isBetween(expense.date, thisPeriodStart, thisPeriodEnd)) {
        //Format the date first
        expense.date = moment(expense.date).format("MMM Do YYYY");

        periodExpenses.push(expense);
      }
      
    });
    Session.set("expenses", periodExpenses);
    Session.get("expenses");

    //Set the default input date
    Session.set("defaultDate", periodExpenses[0].date);
  };
  
  var setTitleDates = function() {
    //If the time period is a month, then we need to add a day to make it display properly.
    if( thisPeriodEnd.diff(thisPeriodStart, 'days') > 7 && thisPeriodEnd.diff(thisPeriodStart, 'days') < 33) {
      console.log("Month");
      Session.set("periodStart", moment(thisPeriodStart).add(1, 'day').format("MMM Do YYYY"));
      Session.set("periodEnd", moment(thisPeriodEnd).format("MMM Do YYYY"));
    } else if(mode == "allTime") {
      Session.set("periodStart", "Beginning of Time");
      Session.set("periodEnd", "End of Time");
    } else {
      Session.set("periodStart", moment(thisPeriodStart).format("MMM Do YYYY"));
      Session.set("periodEnd", moment(thisPeriodEnd).subtract(1, 'day').format("MMM Do YYYY"));
    }
    Session.set("thisWeekStart", moment(thisWeekStart).format("MMM Do YYYY"));
    Session.set("thisWeekEnd", moment(thisWeekEnd).subtract(1, 'day').format("MMM Do YYYY"));
    Session.set("thisMonthStart", moment(thisMonthStart).add(1, 'day').format("MMM Do YYYY"));
    Session.set("thisMonthEnd", moment(thisMonthEnd).format("MMM Do YYYY"));
  };
  
  var changePeriod = function(direction) {
   //Needs to be logic for when in between months.
    if(direction == "forward") {
      if(mode == "week") {
        thisWeekStart = thisWeekStart.add(7, 'day');
        thisWeekEnd = thisWeekEnd.add(7, 'day');
        setCurrentPeriod(mode);
      } else {
        thisMonthStart = thisMonthStart.add(32,'day').startOf('month').subtract(1, 'day'); 
        thisMonthEnd = thisMonthEnd.add(3, 'day').endOf('month');
        setCurrentPeriod(mode);
      }
    } else {
      if(mode == "week") {
        thisWeekStart = thisWeekStart.subtract(7, 'day');
        thisWeekEnd = thisWeekEnd.subtract(7, 'day');
        setCurrentPeriod(mode);
      } else {
        thisMonthStart = thisMonthStart.subtract(3,'day').startOf('month').subtract(1, 'day'); 
        thisMonthEnd = thisMonthEnd.subtract(32, 'day').endOf('month');
        setCurrentPeriod(mode);
      }
    }
    updateGraphs();
    setTitleDates();
    filterDates();
  }
  
  var setCurrentPeriod = function(type) {
    if(type == "week") {
      thisPeriodStart = thisWeekStart;
      thisPeriodEnd = thisWeekEnd;
    } else {
      thisPeriodStart = thisMonthStart;
      thisPeriodEnd = thisMonthEnd;    
    }
  }
  

  
}





