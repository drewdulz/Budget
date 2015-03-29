Expenses = new Mongo.Collection("expenses");

var weekTotal = [0.00, 0.00];
var monthTotal = [0.00, 0.00];
var allTimeTotal = [0.00, 0.00];
var thisWeekStart = moment().day(0).hour(0).minute(0).second(0).subtract(1, 'day'); //Should be one day before we want the dates to display
var thisWeekEnd = moment().day(6).hour(0).minute(0).second(0);
var thisMonthStart = moment().date(31).hour(0).minute(0).second(0).subtract(1, 'month'); //Should be one day before we want the dates to display
var thisMonthEnd = moment().date(31).hour(0).minute(0).second(0);
var allTimeStart = moment("2000-01-01"); //Should be one day before we want the dates to display
var allTimeEnd = moment("2100-01-01");
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
var monthBudgetSpending = (weekBudgetSpending / 7) * thisMonthEnd.diff(thisMonthStart, 'days');
var monthBudgetFood = (weekBudgetFood / 7) * thisMonthEnd.diff(thisMonthStart, 'days');

//Categories
var budgetCategories = ["Spending", "Food"];

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

    getExpenses(thisPeriodStart, thisPeriodEnd) //get the expenses and update the graphs anytime the page is loaded.
	}

  //Initialize the Datepicker
  Template.expenseInput.rendered = function() {
    $('#datetimepicker6').datetimepicker({format: 'MMM D YYYY'});
  }
  

  //-------------------------------------//
  //              Helpers                //
  //-------------------------------------//
  
  Template.body.helpers({
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
    "blur #datetimepicker6": function () {
      Session.set("defaultDate", moment($('#datetimepicker6').val()));
    },

		"click #prev-day": function () {
      var currentDefault = Session.get("defaultDate");
      currentDefault = moment(currentDefault, "MMM D YYYY").subtract(1,'day').format("MMM D YYYY");
      Session.set("defaultDate", currentDefault);
    },

    "click #next-day": function () {
      var currentDefault = Session.get("defaultDate");
      currentDefault = moment(currentDefault, "MMM D YYYY").add(1,'day').format("MMM D YYYY");
      Session.set("defaultDate", currentDefault);
    },

    "click #add-expense": function () {
      // Get all the data from the form and input into database.
			var date = new Date(document.getElementById('datetimepicker6').value);
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
  var updateCharts = function (expenses) {
    console.log("updateGraphs");
    total = Array.apply(null, new Array(budgetCategories.length)).map(Number.prototype.valueOf,0);
    Session.set("weekOverBudget", false);
    Session.set("monthOverBudget", false);

    //Look at the current mode and go through each expense and classify it, then update the graph for that mode.
    expenses.forEach(function(expense) {
      for(var i = 0; i < budgetCategories.length; i++) {
        if(expense.category == budgetCategories[i]) {
          total[i] += parseFloat(expense.amount);
        }
      }
    }); 

    //Update the Charts
    if(mode == "week") {
      console.log("week");
      if((total[0] + total[1]) > (weekBudgetSpending + weekBudgetFood)) {
        console.log(total[0]);
        console.log(total[1]);
        //Overbudget
        weekChart.segments[0].value = total[0] / (total[0] + total[1]);
        weekChart.segments[1].value = total[1] / (total[0] + total[1]);
        weekChart.segments[2].value = 0;
        Session.set("weekOverBudget", true);
console.log("week over budget");
      } else {
        console.log(total[0]);
        weekChart.segments[0].value = total[0];
        weekChart.segments[1].value = total[1];
        weekChart.segments[2].value = weekBudgetSpending + weekBudgetFood - total[0] - total[1];
      }
      
      weekChart.update();
    } else {
      if((total[0] + total[1]) > (monthBudgetSpending + monthBudgetFood)) {
        //Overbudget
        monthChart.segments[0].value = total[0] / (total[0] + total[1]);
        monthChart.segments[1].value = total[1] / (total[0] + total[1]);
        monthChart.segments[2].value = 0;
        Session.set("monthOverBudget", true);
console.log("month over budget");
      } else {
        monthChart.segments[0].value = total[0];
        monthChart.segments[1].value = total[1];
        monthChart.segments[2].value = monthBudgetSpending + monthBudgetFood - total[0] - total[1];
      }
      
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
  
  var setTitleDates = function() {
    //If the time period is a month, then we need to add a day to make it display properly.
    // Month
    if( thisPeriodEnd.diff(thisPeriodStart, 'days') > 7 && thisPeriodEnd.diff(thisPeriodStart, 'days') < 33) {
      Session.set("periodStart", moment(thisPeriodStart).add(1, 'day').format("MMM D YYYY"));
      Session.set("periodEnd", moment(thisPeriodEnd).format("MMM D YYYY"));
    // All Time 
    } else if(mode == "allTime") {
      Session.set("periodStart", "Beginning of Time");
      Session.set("periodEnd", "End of Time");
    // Week
    } else {
      Session.set("periodStart", moment(thisPeriodStart).add(1, 'day').format("MMM D YYYY"));
      Session.set("periodEnd", moment(thisPeriodEnd).format("MMM D YYYY"));
    }
    Session.set("thisWeekStart", moment(thisWeekStart).add(1,'day').format("MMM D YYYY"));
    Session.set("thisWeekEnd", moment(thisWeekEnd).format("MMM D YYYY"));
    Session.set("thisMonthStart", moment(thisMonthStart).add(1, 'day').format("MMM D YYYY"));
    Session.set("thisMonthEnd", moment(thisMonthEnd).format("MMM D YYYY"));
  };
  
  //Takes in the direction of where we want to go, and depending if we are looking at weeks or months it changes the current period
  //and gets the expenses for that period.
  var changePeriod = function(direction) {
    if(direction == "forward") {
      if(mode == "week") {
        thisWeekStart = thisWeekStart.add(7, 'day');
        thisWeekEnd = thisWeekEnd.add(7, 'day');
        setCurrentPeriod(thisWeekStart, thisWeekEnd);
      } else {
        thisMonthStart = thisMonthStart.add(32,'day').startOf('month').subtract(1, 'day'); 
        thisMonthEnd = thisMonthEnd.add(3, 'day').endOf('month');
        setCurrentPeriod(thisMonthStart, thisMonthEnd);
      }
    } else {
      if(mode == "week") {
        thisWeekStart = thisWeekStart.subtract(7, 'day');
        thisWeekEnd = thisWeekEnd.subtract(7, 'day');
        setCurrentPeriod(thisWeekStart, thisWeekEnd);
      } else {
        thisMonthStart = thisMonthStart.subtract(3,'day').startOf('month').subtract(1, 'day'); 
        thisMonthEnd = thisMonthEnd.subtract(32, 'day').endOf('month');
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
  

  var setDefaultDate = function() {
    //Set the default input date
    if(typeof periodExpenses[0] != 'undefined' || periodExpenses[0] != null) {
      Session.set("defaultDate", periodExpenses[0].date);
    } else if(mode == 'month'){
      Session.set("defaultDate", thisPeriodStart.add(1, 'day').format("MMM D YYYY"));
    } else {
      Session.set("defaultDate", thisPeriodStart.format("MMM D YYYY"));
    }
  }

  // Gets expense from the database that are between the start Date and the end date. Dates must be JS.
  // Then it sets the current expenses for the session.
  var getExpenses = function (startDate, endDate) {
    var expenses = [];
    var formattedExpenses = [];

    // Set the dates to be JS date format.
    startDate = startDate.toDate();
    endDate = endDate.toDate()
    expenses = Expenses.find({ date: { $gte:startDate, $lte:endDate } }, {sort: {date: -1}});

    //Format the dates nicely.
    expenses.forEach(function(expense) {
      expense.date = moment(expense.date).format("MMM D YYYY");
      formattedExpenses.push(expense);
    });

    Session.set("expenses", formattedExpenses);

    //Update the graphs
    updateCharts(formattedExpenses);
  }
}

  //-------------------------------------//
  //          Meteor Methods             //
  //-------------------------------------//

Meteor.methods({
  deleteExpense: function (expenseId) {
    Expenses.remove(expenseId);
  },

  // Adds an expense to the database. Returns true if added successfully, and false if there are issues.
  addExpense: function (date, store, desc, amount, category) {
    var data = {};
    var valid = true;
    //Validate the data
    if(date instanceof Date && date != '') { 
      data.date = date
    } else {
      alert("please enter a valid date");
      valid = false
    }
    console.log(date);
    if(typeof store == 'string' && store != '') {
      data.store = store
    } else {
      alert("please enter a valid store");
      valid = false
    }
    if(typeof desc == 'string' && desc != ''){
      data.description = desc
    } else {
      alert("please enter a valid description"); 
      valid = false
    }
    if(!isNaN(amount) && amount != ''){ 
      data.amount = amount
    } else {
      alert("please enter a valid amount");
      valid = false
    };
    if(typeof category == 'string' && category != '') {
      data.category = category
    } else {
      alert("please enter a valid category");
      valid = false
    };
    
    // Insert the data and clear the form.
    if(valid == true) {
      Expenses.insert(data);
      $('.clear').val('');
    }
  }

});





