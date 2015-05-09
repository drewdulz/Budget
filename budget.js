Expenses = new Mongo.Collection("expenses");

var weekTotal = [0.00, 0.00];
var monthTotal = [0.00, 0.00];
var allTimeTotal = [0.00, 0.00];
var thisWeekStart = Date.today().sunday(); //Should be one day before we want the dates to display
var thisWeekEnd = Date.today().saturday();
var thisMonthStart = Date.today().moveToFirstDayOfMonth();
var thisMonthEnd = Date.today().moveToLastDayOfMonth(); 
var mode = "week";
var weekChange; var monthChange;

var thisPeriodStart = thisWeekStart;
var thisPeriodEnd = thisWeekEnd;
var periodExpenses = [];
var expenses;

//Chart values
var ctx;
var weekChart;
var spendingColor = "#F7464A";
var foodColor = "#46BFBD";
var remainingColor = "#B4B4B4";

//Budget Values
var weekBudgetSpending = 50.00;
var weekBudgetFood = 100.00;
var monthBudgetSpending = (weekBudgetSpending / 7) * Date.getDaysInMonth(thisMonthStart.getYear(),thisMonthStart.getMonth()); // TODO: make this according to current month
var monthBudgetFood = (weekBudgetFood / 7) * Date.getDaysInMonth(thisMonthStart.getYear(),thisMonthStart.getMonth());

//Categories
var budgetCategories = ["Spending", "Food"];

var totals = [{name: "Spending"}, {name: "Food"}];

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


if (Meteor.isClient) {
  
  //-------------------------------------//
  //              Renderers              //
  //-------------------------------------//

  Template.budgetSummary.rendered = function() {
    //Initialize title
    setTitleDates();
    Session.set("mode", mode); 
    Session.set("weekOverBudget", false);
    Session.set("monthOverBudget", false);
    
    // Render the charts
    // Week Chart
    ctx1 = document.getElementById("weekChart").getContext("2d");
    weekChart = new Chart(ctx1).Doughnut(chartData, chartOptions);
    var legend1 = weekChart.generateLegend();
    $('#weekChart').append(legend1);
    // Month Chart
    ctx2 = document.getElementById("monthChart").getContext("2d");
    monthChart = new Chart(ctx2).Doughnut(chartData, chartOptions);

    getExpenses(thisMonthStart, thisMonthEnd, "month") // Get the expenses for the month and plot that chart.
    getExpenses(thisPeriodStart, thisPeriodEnd) //get the expenses and update the graphs anytime the page is loaded.
	}

  //Initialize the Datepicker
  Template.expenseInput.rendered = function() {
    $('#datetimepicker').datetimepicker({format: "ddd MMM DD YYYY"});
  }


  //-------------------------------------//
  //              Helpers                //
  //-------------------------------------//
  
  Template.expensesGroup.helpers({
    expenses: function () {
      return Session.get("expenses");
    }
  });

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
    weekOverBudget: function() {
      return Session.get("weekOverBudget");
    },
    monthOverBudget: function() {
      return Session.get("monthOverBudget");
    },
    weeklyTotals: function() {
      return Session.get("weeklyTotals");
    },
    monthlyTotals: function() {
      return Session.get("monthlyTotals");
    },
	});
  
  // Set the date input value to a default
  Template.expenseInput.helpers({
    defaultDate: function() {
      return Session.get("defaultDate");
    },
    
  });
  

  //-------------------------------------//
  //                Events               //
  //-------------------------------------//
  
  
  Template.expenseInput.events({
    "blur #datetimepicker": function () {
      Session.set("defaultDate", $('#datetimepicker').val().toString("ddd MMM dd YYYY"));
    },

		"click #prev-day": function () {
      var currentDefault = Session.get("defaultDate");
      currentDefault = Date.parse(currentDefault).addDays(-1);
      Session.set("defaultDate", currentDefault.toString("ddd MMM dd yyyy"));
    },

    "click #next-day": function () {
      var currentDefault = Session.get("defaultDate");
      currentDefault = Date.parse(currentDefault).addDays(1);
      Session.set("defaultDate", currentDefault.toString("ddd MMM dd yyyy"));
    },

    "click #add-expense": function () {
      // Get all the data from the form and input into database.
			var date = new Date(document.getElementById('datetimepicker').value);
			var store = document.getElementById('store').value;
			var desc = document.getElementById('description').value;
      var amount = document.getElementById('amount').value;
			var category = document.getElementById('category').value;

      // If the adding was succesfull, clear all the inputs.
			Meteor.call("addExpense", date, store, desc, amount, category); 
      // TODO: Need some front end form validation here.
      getExpenses(thisPeriodStart, thisPeriodEnd);
      
		},	
	});

  Template.budgetSummary.events({
		"click .thisWeek": function () {
      mode = "week";
      Session.set("mode", mode);
			thisPeriodStart = thisWeekStart;
			thisPeriodEnd = thisWeekEnd;
      //Show this section as active
      $(".summary-box").removeClass("active");
      $("#weekBox").addClass("active");
      setTitleDates();
      getExpenses(thisPeriodStart, thisPeriodEnd);
		},
		"click .thisMonth": function () {
      mode = "month";
      Session.set("mode", mode);
			thisPeriodStart = thisMonthStart;
			thisPeriodEnd = thisMonthEnd;
      //Show this section as active
      $(".summary-box").removeClass("active");
      $("#monthBox").addClass("active");
      setTitleDates();
      getExpenses(thisPeriodStart, thisPeriodEnd);
		},	
    "click #previous": function () {
      changePeriod("back");
    },  
    "click #next": function () {
      changePeriod("forward");
    },	
	});

  Template.expense.events({
		"click .delete-button": function () {
      Meteor.call("deleteExpense", this._id); 
      getExpenses(thisPeriodStart, thisPeriodEnd);
		},	
	});



  //-------------------------------------//
  //              Functions              //
  //-------------------------------------//


  //TODO, this can be refacotred becasue we know the mode and have all expenses from that mode.
  var updateCharts = function (expenses, mode) {
    total = Array.apply(null, new Array(budgetCategories.length)).map(Number.prototype.valueOf,0);

    //Look at the current mode and go through each expense and classify it, then update the graph for that mode.
    expenses.forEach(function(expense) {
      for(var i = 0; i < budgetCategories.length; i++) {
        if(expense.category == budgetCategories[i]) {
          total[i] += parseFloat(expense.amount);
        }
      }
    }); 

    totals[0].amount = total[0];
    totals[1].amount = total[1];

    // Update the week charts
    if(mode == "week") {
      Session.set("weekOverBudget", false);
			Session.set("weeklyTotals", totals);

      if((total[0] + total[1]) > (weekBudgetSpending + weekBudgetFood)) {
        //Overbudget
        weekChart.segments[0].value = total[0] / (total[0] + total[1]);
        weekChart.segments[1].value = total[1] / (total[0] + total[1]);
        weekChart.segments[2].value = 0;
        Session.set("weekOverBudget", total[0] + total[1] - weekBudgetSpending - weekBudgetFood);

      } else {
        weekChart.segments[0].value = total[0];
        weekChart.segments[1].value = total[1];
        weekChart.segments[2].value = weekBudgetSpending + weekBudgetFood - total[0] - total[1];
      }
      
      weekChart.update();
    } else {
      Session.set("monthOverBudget", false);
			Session.set("monthlyTotals", totals);
      // Update the month charts
      if((total[0] + total[1]) > (monthBudgetSpending + monthBudgetFood)) {
        //Overbudget
        monthChart.segments[0].value = total[0] / (total[0] + total[1]);
        monthChart.segments[1].value = total[1] / (total[0] + total[1]);
        monthChart.segments[2].value = 0;
        Session.set("monthOverBudget", total[0] + total[1] - monthBudgetSpending - monthBudgetFood);

      } else {
        monthChart.segments[0].value = total[0];
        monthChart.segments[1].value = total[1];
        monthChart.segments[2].value = monthBudgetSpending + monthBudgetFood - total[0] - total[1];
      }
      
      monthChart.update();
    }

  };
  
  var isBetween = function(date, startDate, endDate) {
    date.between(startDate, endDate);
  };
  
  var setTitleDates = function() {
    // Month
    if( mode == "month") {
      Session.set("periodStart", thisPeriodStart.toString("ddd MMM dd, yyyy"));
      Session.set("periodEnd", thisPeriodEnd.toString("ddd MMM dd, yyyy"));
    // Week
    } else {
      Session.set("periodStart", thisWeekStart.toString("ddd MMM dd, yyyy"));
      Session.set("periodEnd", thisPeriodEnd.toString("ddd MMM dd, yyyy"));
    }
    Session.set("thisWeekStart", thisWeekStart.toString("ddd MMM dd, yyyy"));
    Session.set("thisWeekEnd", thisWeekEnd.toString("ddd MMM dd, yyyy"));
    Session.set("thisMonthStart", thisMonthStart.toString("ddd MMM dd, yyyy"));
    Session.set("thisMonthEnd", thisMonthEnd.toString("ddd MMM dd, yyyy"));
  };
  
  //Takes in the direction of where we want to go, and depending if we are looking at weeks or months it changes the current period
  //and gets the expenses for that period.
  var changePeriod = function(direction) {
    if(direction == "forward") {
      if(mode == "week") {
        thisWeekStart = thisWeekStart.addDays(7);
        thisWeekEnd = thisWeekEnd.addDays(7);
        setCurrentPeriod(thisWeekStart, thisWeekEnd);
      } else {
        thisMonthStart = thisMonthStart.addMonths(1);
        thisMonthEnd = thisMonthEnd.addMonths(1).moveToLastDayOfMonth();
        setCurrentPeriod(thisMonthStart, thisMonthEnd);
      }
    } else {
      if(mode == "week") {
        thisWeekStart = thisWeekStart.addDays(-7);
        thisWeekEnd = thisWeekEnd.addDays(-7);
        setCurrentPeriod(thisWeekStart, thisWeekEnd);
      } else {
        thisMonthStart = thisMonthStart.addMonths(-1);
        thisMonthEnd = thisMonthEnd.addMonths(-1).moveToLastDayOfMonth();
        setCurrentPeriod(thisMonthStart, thisMonthEnd);
      }
    }
    setTitleDates();
    getExpenses(thisPeriodStart, thisPeriodEnd);
  }
  
  var setCurrentPeriod = function(startDate, endDate) {
      thisPeriodStart = startDate;
      thisPeriodEnd = endDate;  
  }
  
  // Accepts a array of expenses and return the default date to use for those expenses
  var setDefaultDate = function(expenses) {
    //Set the default input date
    if(typeof expenses[0] != 'undefined' || expenses[0] != null) {
      return expenses[0].date.toString("ddd MMM dd yyyy");
    } else {
      return thisPeriodStart.toString("ddd MMM dd yyyy");
    }
  }

  // Gets expense from the database that are between the start Date and the end date. Dates must be JS.
  // Then it sets the current expenses for the session. Also sets the defualt date.
  // If a mode is given as argument, it will update the charts for that mode. Otherwise it will fall back on the globally defined mode.
  var getExpenses = function (startDate, endDate, forceMode) {
    var expenses = [];
    var formattedExpenses = [];


    
    if(mode == "week") {
      // Update the month chart
      var monthExpenses = Expenses.find({ date: { $gte:thisMonthStart, $lte:thisMonthEnd } }, {sort: {date: -1}});
      updateCharts(monthExpenses, "month");

      expenses = Expenses.find({ date: { $gte:thisWeekStart, $lte:thisWeekEnd } }, {sort: {date: -1}});
    } else {
      // Update the week chart
      var weekExpenses = Expenses.find({ date: { $gte:thisWeekStart, $lte:thisWeekEnd } }, {sort: {date: -1}});
      updateCharts(weekExpenses, "week");

      expenses = Expenses.find({ date: { $gte:thisMonthStart, $lte:thisMonthEnd } }, {sort: {date: -1}});
    }

    //Format the dates nicely.
    expenses.forEach(function(expense) {
      expense.date = expense.date.toString("ddd MMM dd yyyy");
      formattedExpenses.push(expense);
    });
    // Set the expenses
    Session.set("expenses", formattedExpenses);
    // Update the graphs
    updateCharts(formattedExpenses, forceMode || mode);
    // Set the defualt date in the datepicker
    Session.set("defaultDate", setDefaultDate(formattedExpenses));

  }
}

  //-------------------------------------//
  //          Meteor Methods             //
  //-------------------------------------//

Meteor.methods({
  deleteExpense: function (expenseId) {
    Expenses.remove(expenseId);
    getExpenses(thisPeriodStart, thisPeriodEnd);
  },

  // Adds an expense to the database. Returns true if added successfully, and false if there are issues.
  addExpense: function (date, store, desc, amount, category) {
    var data = {};
    var valid = true;

    //Validate the data
    if(date instanceof Date && date != '') { 
      data.date = date;
    } else {
      alert("please enter a valid date");
      valid = false;
    }
    if(typeof store == 'string' && store != '') {
      data.store = store;
    } else {
      alert("please enter a valid store");
      valid = false;
    }
    if(typeof desc == 'string' && desc != ''){
      data.description = desc;
    } else {
      alert("please enter a valid description"); 
      valid = false;
    }
    if(!isNaN(amount) && amount != ''){ 
      data.amount = amount;
    } else {
      alert("please enter a valid amount");
      valid = false;
    };
    if(typeof category == 'string' && category != '') {
      data.category = category;
    } else {
      alert("please enter a valid category");
      valid = false;
    };
    
    // Insert the data and clear the form.
    if(valid == true) {
      Expenses.insert(data);
      $('.clear').val('');
    }
  }

});





