app_name = "customayp"
app_title = "customayp"
app_publisher = "adnan"
app_description = "Custom App for AYP"
app_email = "adi619261@gmail.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "customayp",
# 		"logo": "/assets/customayp/logo.png",
# 		"title": "customayp",
# 		"route": "/customayp",
# 		"has_permission": "customayp.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/customayp/css/customayp.css"
# app_include_js = "/assets/customayp/js/customayp.js"

# include js, css files in header of web template
# web_include_css = "/assets/customayp/css/customayp.css"
# web_include_js = "/assets/customayp/js/customayp.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "customayp/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "customayp/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "customayp.utils.jinja_methods",
# 	"filters": "customayp.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "customayp.install.before_install"
# after_install = "customayp.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "customayp.uninstall.before_uninstall"
# after_uninstall = "customayp.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "customayp.utils.before_app_install"
# after_app_install = "customayp.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "customayp.utils.before_app_uninstall"
# after_app_uninstall = "customayp.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "customayp.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"customayp.tasks.all"
# 	],
# 	"daily": [
# 		"customayp.tasks.daily"
# 	],
# 	"hourly": [
# 		"customayp.tasks.hourly"
# 	],
# 	"weekly": [
# 		"customayp.tasks.weekly"
# 	],
# 	"monthly": [
# 		"customayp.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "customayp.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "customayp.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "customayp.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["customayp.utils.before_request"]
# after_request = ["customayp.utils.after_request"]

# Job Events
# ----------
# before_job = ["customayp.utils.before_job"]
# after_job = ["customayp.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"customayp.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }
doc_events = {
    'Purchase Order': {
        'on_submit': 'customayp.intercompany_sync.create_sales_invoice_on_purchase_order_submission'
    },
    'Payment Entry': {
        'on_submit': 'customayp.intercompany_sync.create_payment_entry_on_payment_entry_submission',
        'on_update': 'customayp.intercompany_sync.send_notification_on_pending_approval',
        'before_save': 'customayp.intercompany_sync.on_payment_entry_approval'
    }
}

