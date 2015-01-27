(function(){
Template.body.addContent((function() {
  var view = this;
  return HTML.DIV({
    "class": "container-fluid"
  }, HTML.Raw('\n		<div class="row top-bar">\n			<!-- this will be a template with the date and stuff -->\n			<h1 class="title">Test</h1>\n		</div>\n\n		<div class="row">\n			<div class="col-sm-4">\n				<div class="summary-box">\n					<div class="summary-box-top"><div class="summary-box-title">This Week</div></div>\n					<div class="summary-box-content"></div>\n				</div>\n			</div>\n\n			<div class="col-sm-4">\n				<div class="summary-box">\n					<div class="summary-box-top"><div class="summary-box-title">This Month</div></div>\n					<div class="summary-box-content"></div>\n				</div>\n			</div>\n\n			<div class="col-sm-4">\n				<div class="summary-box">\n					<div class="summary-box-top"><div class="summary-box-title">Term to Date</div></div>\n					<div class="summary-box-content"></div>\n				</div>\n			</div>\n		</div>\n\n    '), Spacebars.include(view.lookupTemplate("dateRangeSelect")), "\n    \n		", HTML.DIV({
    "class": "table-section"
  }, "\n			", HTML.TABLE({
    "class": "table table-hover table-responsive"
  }, "\n				", HTML.THEAD("\n					", HTML.TR("\n						", HTML.TH({
    "class": "date-col"
  }, "Date"), "\n						", HTML.TH({
    "class": "store-col"
  }, "Store"), "\n						", HTML.TH({
    "class": "desc-col"
  }, "Description"), "\n						", HTML.TH({
    "class": "amount-col"
  }, "Amount"), "\n						", HTML.TH({
    "class": "category-col"
  }, "Category"), "\n						", HTML.TH({
    "class": "edit-col"
  }, "Edit"), "\n					"), "\n				"), "\n				", HTML.TBODY("\n					", Spacebars.include(view.lookupTemplate("expenseInput")), "\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("expenses"));
  }, function() {
    return [ "\n				        ", Spacebars.include(view.lookupTemplate("expense")), "\n				    " ];
  }), "\n			    "), "\n\n\n			"), "\n		"), "\n	");
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("expense");
Template["expense"] = new Template("Template.expense", (function() {
  var view = this;
  return HTML.TR("\n		", HTML.TD(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("date"));
  })), "\n		", HTML.TD(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("store"));
  })), "\n		", HTML.TD(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("description"));
  })), "\n		", HTML.TD("$", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("amount"));
  })), "\n		", HTML.TD(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("category"));
  })), HTML.Raw('\n		<td><span class="glyphicon glyphicon-remove-circle delete-button" aria-hidden="true"></span></td>\n	'));
}));

Template.__checkName("expenseInput");
Template["expenseInput"] = new Template("Template.expenseInput", (function() {
  var view = this;
  return HTML.TR("\n		", HTML.TD(HTML.INPUT({
    type: "text",
    "class": "form-control",
    id: "datetimepicker6",
    placeholder: "Date",
    value: function() {
      return Spacebars.mustache(view.lookup("defaultDate"));
    }
  })), HTML.Raw('\n		<td><input type="text" class="form-control" id="store" placeholder="Store"></td>\n		<td><input type="text" class="form-control" id="description" placeholder="Description"></td>\n		<td><div class="input-group"><div class="input-group-addon">$</div><input type="text" class="form-control" id="amount" placeholder="Amount"></div></td>\n		<td><select class="form-control" id="category"><option>Spending</option><option>Food</option></select></td>\n		<td><button type="button" class="btn btn-success add-expense">Submit</button></td>\n	'));
}));

Template.__checkName("dateRangeSelect");
Template["dateRangeSelect"] = new Template("Template.dateRangeSelect", (function() {
  var view = this;
  return HTML.Raw('<div class="row">\n    <div class="col-md-4 col-md-offset-4 text-center">\n      <h3>Show me transactions from: </h3>\n      <div class="btn-group date-range-buttons" data-toggle="buttons">\n        <label class="btn btn-default active thisWeek">\n          <input type="radio" name="options" id="thisWeek" autocomplete="off" checked=""> This Week\n        </label>\n        <label class="btn btn-default thisMonth">\n          <input type="radio" name="options" id="thisMonth" autocomplete="off"> This Month\n        </label>\n        <label class="btn btn-default allTime">\n          <input type="radio" name="options" id="allTime" autocomplete="off"> All Time\n        </label>\n      </div>\n    </div>\n  </div>');
}));

})();
