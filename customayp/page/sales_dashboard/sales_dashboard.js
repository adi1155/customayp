frappe.pages['sales_dashboard'].on_page_load = function(wrapper) {
    new PageContent(wrapper); 
}

PageContent = Class.extend({
    init: function(wrapper){
        this.page = frappe.ui.make_app_page({
            parent: wrapper,
            title: 'Sales Dashboard',
            single_column: true
        });

        this.make();
    },

    make: function () {
        let htmlContent = `
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <style>
        /* Container styling */
        .row {
            margin-top: 20px;
        }

        /* Card Styling */
        .card {
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        /* Card hover effect */
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        /* Card Header */
        .card-header {
            background: linear-gradient(45deg, #4e73df, #1cc88a);
            color: white;
            font-weight: bold;
            font-size: 1.2rem;
            padding: 12px;
            text-align: center;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }

        /* Card Body */
        .card-body {
            background-color: #f8f9fc;
            padding: 20px;
            text-align: center;
            
        }

        /* Title Styling */
        .card-title {
            font-size: 20px;
            font-weight: 700;
            color: #333;
        }

        /* Loading Text */
        #today-expense, #yesterday-expense, #expense-difference {
            color: #888;
            font-style: italic;
        }
        fieldset {
        border: 2px solid #ccc; /* Set the border color and thickness */
        padding: 10px;
        border-radius: 8px; /* Optional: rounded corners */
    }

    legend {
        font-weight: bold;
        color: #333; /* Customize legend color */
        padding: 0 5px; /* Add padding for better appearance */
    }

        /* Responsive Text */
        @media (max-width: 768px) {
            .card-title {
                font-size: 1.5rem;
            }
        }
    </style>

    <div class="row">
                <!-- Add a dropdown for Company selection -->
                <div class="col-md-12">
                    <label for="company-select">Select Company:</label>
                    <select id="company-select" class="form-control">
                        <option value="all">All Companies</option>
                    </select>
                </div>
            </div>
    <fieldset>
    <legend>Day Wise Sales Comparison:</legend>
    <div class="row">
        <div class="col-md-2">
            <div class="card">
                <div class="card-header text-center">
                    Today's
                </div>
                <div class="card-body text-center">
                    <h5 id="today-expense" class="card-title">0</h5>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <div class="card">
                <div class="card-header text-center">
                    Yesterday's 
                </div>
                <div class="card-body text-center">
                    <h5 id="yesterday-expense" class="card-title">0</h5>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <div class="card">
                <div class="card-header text-center">
                    Difference
                </div>
                <div class="card-body text-center">
                    <h5 id="expense-difference" class="card-title">0</h5>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <canvas id="todayExpenseChart" style="width:100%; height:200px;"></canvas>
        </div>
         <div class="col-md-3">
           <canvas id="todayExpensePieChart" style="width:100%; height:200px;"></canvas>
        </div>
    </div>
</fieldset>

<fieldset>
    <legend>Week Wise Sales Comparison:</legend>
    <div class="row">
        <div class="col-md-2">
            <div class="card">
                <div class="card-header text-center">
                    Current Week
                </div>
                <div class="card-body text-center">
                    <h5 id="currentweek-expense" class="card-title">0</h5>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <div class="card">
                <div class="card-header text-center">
                    Last week 
                </div>
                <div class="card-body text-center">
                    <h5 id="lastweek-expense" class="card-title">0</h5>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <div class="card">
                <div class="card-header text-center">
                    Difference
                </div>
                <div class="card-body text-center">
                    <h5 id="week-difference" class="card-title">0</h5>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <canvas id="weekExpenseChart" style="width:100%; height:200px;"></canvas>
        </div>
         <div class="col-md-3">
           <canvas id="weekExpensePieChart" style="width:100%; height:200px;"></canvas>
        </div>
    </div>
</fieldset>


 <fieldset>
    <legend>Month Wise Sales Comparison:</legend>  
    <div class="row">
        <div class="col-md-2">
            <div class="card">
                <div class="card-header">
                    Current Month
                </div>
                <div class="card-body">
                    <h5 id="currentmonth-expense" class="card-title">0</h5>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <div class="card">
                <div class="card-header">
                    Last Month
                </div>
                <div class="card-body">
                    <h5 id="lastmonth-expense" class="card-title">0</h5>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <div class="card">
                <div class="card-header">
                    Difference
                </div>
                <div class="card-body">
                    <h5 id="month-difference" class="card-title">0</h5>
                </div>
            </div>
        </div>
         <div class="col-md-3">
            <canvas id="monthExpenseChart" style="width:100%; height:200px;"></canvas>
        </div>
        <div class="col-md-3">
            <canvas id="monthlyExpensePieChart" style="width:100%; height:200px;"></canvas>
        </div>
    </div>
 </fieldset>

 <fieldset>
    <legend>Year Wise Sales Comparison:</legend>  
    <div class="row">
        <div class="col-md-2">
            <div class="card">
                <div class="card-header">
                    Current Year
                </div>
                <div class="card-body">
                    <h5 id="currentyear-expense" class="card-title">0</h5>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <div class="card">
                <div class="card-header">
                    Last Year
                </div>
                <div class="card-body">
                    <h5 id="lastyear-expense" class="card-title">0</h5>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <div class="card">
                <div class="card-header">
                    Difference
                </div>
                <div class="card-body">
                    <h5 id="year-difference" class="card-title">0</h5>
                </div>
            </div>
        </div>
         <div class="col-md-3">
            <canvas id="yearExpenseChart" style="width:100%; height:200px;"></canvas>
        </div>
        <div class="col-md-3">
            <canvas id="yearExpensePieChart" style="width:100%; height:200px;"></canvas>
        </div>
    </div>
 </fieldset>  
        `;
        
                // Append the HTML content to the main page
                $(htmlContent).appendTo(this.page.main);

                this.loadCompanyOptions(); // Load available companies into dropdown
                this.bindEvents(); // Bind change event for dropdown

                // Fetch expenses and update the UI
            //     this.fetchExpenses();
            // this.getTodayExpanse();
            // this.getMonthlyExpanse();
   },

    // fetchExpenses: function() {
    //     frappe.call({
    //         method: "get_expenses", // Name of the server script
    //         callback: function(r) {
    //             if (r.message) {
    //                 // Update the tiles with fetched values
    //                 $("#today-expense").text(r.message.today_expense);
    //                 $("#yesterday-expense").text(r.message.yesterday_expense);
    //                 $("#expense-difference").text(r.message.difference);
    //             }
    //         }
    //     });
    // }
    loadCompanyOptions: function() {
		frappe.call({
			method: "customayp.customayp.page.sales_dashboard.sales_dashboard.get_user_companies",
			callback: function(r) {
				if (r.message) {
					const companies = r.message.companies;
					const defaultCompany = r.message.default_company;
					const showAllOption = r.message.show_all_option;
	
					// Clear the select element before appending options
					$('#company-select').empty();
	
					// If only one company is available, automatically select it and hide the select dropdown
					if (companies.length === 1) {
						$('#company-select').hide();  // Optionally hide the dropdown if only one company is available
						this.getTodaySales(companies[0]);  // Automatically fetch data for the single company
						this.getWeeklySales(companies[0]);
						this.getMonthlySales(companies[0]);
						this.getYearSales(companies[0]);
					} else {
						$('#company-select').show();  // Show the dropdown if more than one company is available
	
						// If multiple companies are available and "all" option is enabled, add it as the first option
						if (showAllOption) {
							$('#company-select').append('<option value="all">All Companies</option>');
						}
	
						// Add each company to the dropdown
						companies.forEach(company => {
							$('#company-select').append(`<option value="${company}">${company}</option>`);
						});
	
						// Set the default company if only one is available
						if (defaultCompany) {
							$('#company-select').val(defaultCompany);
						}
					}
				}
			}.bind(this)  // Bind the callback to the current context
		});
	},

    bindEvents: function() {
        let me = this;
        $('#company-select').on('change', function() {
            let selectedCompany = $(this).val();
            me.getTodaySales(selectedCompany);
            me.getWeeklySales(selectedCompany);
            me.getMonthlySales(selectedCompany);
            me.getYearSales(selectedCompany);
        });
    },


    getTodaySales: function(company) {
		if (!company || company === "all") {
			return;  // Skip if no company is selected
		}
	
		frappe.call({
			method: "customayp.customayp.page.sales_dashboard.sales_dashboard.get_today_sales",
			args: { company: company },
			callback: function(r) {
				if (r.message) {
					// Updating UI
					$("#today-expense").text(r.message[0].today_sales);
					$("#yesterday-expense").text(r.message[0].yesterday_sales);
					$("#expense-difference").text(r.message[0].difference);
	
					// Re-initialize or update the bar chart
					var chartStatus = Chart.getChart("todayExpenseChart");
					if (chartStatus != undefined) {
						chartStatus.destroy(); // Destroy previous chart if it exists
					}
	
					todayExpChart = new Chart(document.getElementById('todayExpenseChart'), {
						type: 'bar',
						data: {
							labels: ['Today', 'Yesterday', 'Difference'],
							datasets: [{
								label: 'Expense',
								data: [r.message[0].today_sales, r.message[0].yesterday_sales, r.message[0].difference],
								backgroundColor: ['#4e73df', '#1cc88a', '#1cc88a']
							}]
						},
						options: {
							responsive: true,
							scales: { y: { beginAtZero: true } }
						}
					});
	
					// Pie chart initialization
					var pieChartStatus = Chart.getChart("todayExpensePieChart");
					if (pieChartStatus != undefined) {
						pieChartStatus.destroy(); // Destroy previous chart if it exists
					}
	
					todayExpPieChart = new Chart(document.getElementById('todayExpensePieChart'), {
						type: 'pie',
						data: {
							labels: ['Today', 'Yesterday', 'Difference'],
							datasets: [{
								label: 'Expense',
								data: [r.message[0].today_sales, r.message[0].yesterday_sales, r.message[0].difference],
								backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc']
							}]
						},
						options: { responsive: true }
					});
				}
			}
		});
	},
  
    getWeeklySales: function(company) {
        frappe.call({
            method: "customayp.customayp.page.sales_dashboard.sales_dashboard.get_weekly_sales",
            args: { company: company },
            callback: function(r) {
                if (r.message) {
                    $("#currentweek-expense").text(r.message[0].current_week_sales);
                    $("#lastweek-expense").text(r.message[0].last_week_sales);
                    $("#week-difference").text(r.message[0].difference);
                   
                    var chartStatus = Chart.getChart("weekExpenseChart"); // <canvas> id
                    if (chartStatus != undefined) {
                        chartStatus.destroy();
                    }

                    // Create bar chart for today's and yesterday's expenses
                    todayExpChart = new Chart(document.getElementById('weekExpenseChart'), {
                        type: 'bar',
                        data: {
                            labels: ['Current Week', 'Last Week','Differnce'],
                            datasets: [{
                                label: 'Expense',
                                data: [r.message[0].current_week_sales, r.message[0].last_week_sales,r.message[0].difference],
                                // data: [25000, 2000,500],
                                backgroundColor: ['#4e73df', '#1cc88a', '#1cc88a']
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: { beginAtZero: true }
                            }
                        }
                    });

                    var chartStatus = Chart.getChart("weekExpensePieChart"); // <canvas> id
                    if (chartStatus != undefined) {
                        chartStatus.destroy();
                    }

                    // Initialize Pie Chart
                    todayExpPieChart = new Chart(document.getElementById('weekExpensePieChart'), {
                        type: 'pie',
                        data: {
                            labels: ['Current Week', 'Last Week', 'Difference'],
                            datasets: [{
                                label: 'Expense',
                                data: [r.message[0].current_week_sales, r.message[0].last_week_sales,r.message[0].difference],
                                // data: [25000, 2000,500],
                                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc']
                            }]
                        },
                        options: {
                            responsive: true
                        }
                    });
                
                }
            }
        });
    },

    getMonthlySales: function(company) {
        frappe.call({
            method: "customayp.customayp.page.sales_dashboard.sales_dashboard.get_monthly_sales",
            args: { company: company },
            callback: function(r) {
                if (r.message) {
                    $("#currentmonth-expense").text(r.message[0].current_month_sales);
                    $("#lastmonth-expense").text(r.message[0].last_month_sales);
                    $("#month-difference").text(r.message[0].difference);

                    var chartStatus = Chart.getChart("monthExpenseChart"); // <canvas> id
                    if (chartStatus != undefined) {
                        chartStatus.destroy();
                    }

                    // Create bar chart for today's and yesterday's expenses
                    monthlyExpChart = new Chart(document.getElementById('monthExpenseChart'), {
                        type: 'bar',
                        data: {
                            labels: ['Current Month', 'Last Month','Differnce'],
                            datasets: [{
                                label: 'Expense',
                                data: [r.message[0].current_month_sales, r.message[0].last_month_sales,r.message[0].difference],
                                // data: [25000, 2000,500],
                                backgroundColor: ['#4e73df', '#1cc88a', '#1cc88a']
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: { beginAtZero: true }
                            }
                        }
                    });
                
                    var chartStatus = Chart.getChart("monthlyExpensePieChart"); // <canvas> id
                    if (chartStatus != undefined) {
                        chartStatus.destroy();
                    }

                    // Initialize Pie Chart
                    monthlyExpPieChart = new Chart(document.getElementById('monthlyExpensePieChart'), {
                        type: 'pie',
                        data: {
                            labels: ['Current Month', 'Last Month', 'Difference'],
                            datasets: [{
                                label: 'Expense',
                                // data: [todayExpense, yesterdayExpense, difference],
                                data: [r.message[0].current_month_sales, r.message[0].last_month_sales,r.message[0].difference],
                                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc']
                            }]
                        },
                        options: {
                            responsive: true
                        }
                    });
                }
            }
        });
    },
    getYearSales: function(company) {
        frappe.call({
            method: "customayp.customayp.page.sales_dashboard.sales_dashboard.get_yearly_sales",
            args: { company: company },
            callback: function(r) {
                if (r.message) {
                    $("#currentyear-expense").text(r.message[0].current_year_sales);
                    $("#lastyear-expense").text(r.message[0].last_year_sales);
                    $("#year-difference").text(r.message[0].difference);

                    var chartStatus = Chart.getChart("yearExpenseChart"); // <canvas> id
                    if (chartStatus != undefined) {
                        chartStatus.destroy();
                    }

                    // Create bar chart for today's and yesterday's expenses
                    monthlyExpChart = new Chart(document.getElementById('yearExpenseChart'), {
                        type: 'bar',
                        data: {
                            labels: ['Current Year', 'Last Year','Differnce'],
                            datasets: [{
                                label: 'Expense',
                                data: [r.message[0].current_year_sales, r.message[0].last_year_sales,r.message[0].difference],
                                // data: [25000, 2000,500],
                                backgroundColor: ['#4e73df', '#1cc88a', '#1cc88a']
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: { beginAtZero: true }
                            }
                        }
                    });
                
                    var chartStatus = Chart.getChart("yearExpensePieChart"); // <canvas> id
                    if (chartStatus != undefined) {
                        chartStatus.destroy();
                    }

                    // Initialize Pie Chart
                    monthlyExpPieChart = new Chart(document.getElementById('yearExpensePieChart'), {
                        type: 'pie',
                        data: {
                            labels: ['Current Year', 'Last Year', 'Difference'],
                            datasets: [{
                                label: 'Expense',
                                // data: [todayExpense, yesterdayExpense, difference],
                                data: [r.message[0].current_year_sales, r.message[0].last_year_sales,r.message[0].difference],
                                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc']
                            }]
                        },
                        options: {
                            responsive: true
                        }
                    });
                }
            }
        });
    }

});
