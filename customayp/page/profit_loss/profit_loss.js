frappe.pages['profit_loss'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Profit & Loss Dashboard',
		single_column: true
	});
}