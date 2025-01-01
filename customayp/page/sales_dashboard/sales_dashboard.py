import frappe

@frappe.whitelist()
def get_user_companies():
    user = frappe.session.user

    # Fetch only companies that the logged-in user has permission to access
    allowed_companies = frappe.get_all(
        "User Permission",
        filters={"user": user, "allow": "Company"},
        fields=["for_value"]
    )

    # Extract company names from permissions
    company_list = [permission['for_value'] for permission in allowed_companies]
    
    # If only one company is allowed, return it directly
    if len(company_list) == 1:
        return {
            "companies": company_list,
            "default_company": company_list[0],
            "show_all_option": False
        }
    
    # If multiple companies are allowed, add an "all" option
    return {
        "companies": company_list,
        "default_company": None,
        "show_all_option": True
    }

@frappe.whitelist()
def get_today_sales(company=None):
    company_filter = ""
    args = []
    
    if company and company != "all":
        company_filter = "AND si.company = %s"
        args.append(company)

    query = f"""
        SELECT 
            COALESCE(SUM(CASE 
                WHEN DATE(si.posting_date) = DATE(SUBDATE(CURDATE(), 1))
                THEN si.grand_total 
                ELSE 0 
            END), 0) as yesterday_sales,
            
            COALESCE(SUM(CASE 
                WHEN DATE(si.posting_date) = CURDATE()
                THEN si.grand_total 
                ELSE 0 
            END), 0) as today_sales,
            
            COALESCE(SUM(CASE 
                WHEN DATE(si.posting_date) = CURDATE()
                THEN si.grand_total 
                ELSE 0 
            END), 0) - 
            COALESCE(SUM(CASE 
                WHEN DATE(si.posting_date) = DATE(SUBDATE(CURDATE(), 1))
                THEN si.grand_total 
                ELSE 0 
            END), 0) as difference
        FROM `tabSales Invoice` si
        WHERE 
            DATE(si.posting_date) >= DATE(SUBDATE(CURDATE(), 1))
            AND DATE(si.posting_date) <= CURDATE()
            AND si.docstatus = 1
            {company_filter}
    """
    return frappe.db.sql(query, tuple(args), as_dict=True)

@frappe.whitelist()
def get_weekly_sales(company=None):
    company_filter = ""
    args = []
    
    if company and company != "all":
        company_filter = "AND si.company = %s"
        args.append(company)

    query = f"""
        SELECT 
            COALESCE(SUM(CASE 
                WHEN YEARWEEK(si.posting_date, 1) = YEARWEEK(CURDATE(), 1) 
                THEN si.grand_total 
                ELSE 0 
            END), 0) as current_week_sales,
            
            COALESCE(SUM(CASE 
                WHEN YEARWEEK(si.posting_date, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
                THEN si.grand_total 
                ELSE 0 
            END), 0) as last_week_sales,
            
            COALESCE(SUM(CASE 
                WHEN YEARWEEK(si.posting_date, 1) = YEARWEEK(CURDATE(), 1) 
                THEN si.grand_total 
                ELSE 0 
            END), 0) - 
            COALESCE(SUM(CASE 
                WHEN YEARWEEK(si.posting_date, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
                THEN si.grand_total 
                ELSE 0 
            END), 0) as difference
        FROM `tabSales Invoice` si
        WHERE 
            YEARWEEK(si.posting_date, 1) >= YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
            AND si.docstatus = 1
            {company_filter}
    """
    return frappe.db.sql(query, tuple(args), as_dict=True)


@frappe.whitelist()
def get_monthly_sales(company=None):
    company_filter = ""
    args = []
    
    if company and company != "all":
        company_filter = "AND si.company = %s"
        args.append(company)

    query = f"""
        SELECT 
            COALESCE(SUM(CASE 
                WHEN MONTH(si.posting_date) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
                AND YEAR(si.posting_date) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
                THEN si.grand_total 
                ELSE 0 
            END), 0) as last_month_sales,
            
            COALESCE(SUM(CASE 
                WHEN MONTH(si.posting_date) = MONTH(CURRENT_DATE)
                AND YEAR(si.posting_date) = YEAR(CURRENT_DATE)
                THEN si.grand_total 
                ELSE 0 
            END), 0) as current_month_sales,
            
            COALESCE(SUM(CASE 
                WHEN MONTH(si.posting_date) = MONTH(CURRENT_DATE)
                AND YEAR(si.posting_date) = YEAR(CURRENT_DATE)
                THEN si.grand_total 
                ELSE 0 
            END), 0) - 
            COALESCE(SUM(CASE 
                WHEN MONTH(si.posting_date) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
                AND YEAR(si.posting_date) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
                THEN si.grand_total 
                ELSE 0 
            END), 0) as difference
        FROM `tabSales Invoice` si
        WHERE 
            si.posting_date >= DATE_SUB(DATE_SUB(CURDATE(), INTERVAL DAY(CURDATE()) - 1 DAY), INTERVAL 1 MONTH)
            AND si.posting_date <= LAST_DAY(CURDATE())
            AND si.docstatus = 1
            {company_filter}
    """
    return frappe.db.sql(query, tuple(args), as_dict=True)

@frappe.whitelist()
def get_yearly_sales(company=None):
    company_filter = ""
    args = []
    
    if company and company != "all":
        company_filter = "AND si.company = %s"
        args.append(company)

    query = f"""
        SELECT 
            COALESCE(SUM(CASE 
                WHEN YEAR(si.posting_date) = YEAR(CURDATE())
                THEN si.grand_total 
                ELSE 0 
            END), 0) as current_year_sales,
            
            COALESCE(SUM(CASE 
                WHEN YEAR(si.posting_date) = YEAR(CURDATE()) - 1
                THEN si.grand_total 
                ELSE 0 
            END), 0) as last_year_sales,
            
            COALESCE(SUM(CASE 
                WHEN YEAR(si.posting_date) = YEAR(CURDATE())
                THEN si.grand_total 
                ELSE 0 
            END), 0) - 
            COALESCE(SUM(CASE 
                WHEN YEAR(si.posting_date) = YEAR(CURDATE()) - 1
                THEN si.grand_total 
                ELSE 0 
            END), 0) as yearly_difference
        FROM `tabSales Invoice` si
        WHERE 
            (YEAR(si.posting_date) = YEAR(CURDATE()) OR YEAR(si.posting_date) = YEAR(CURDATE()) - 1)
            AND si.docstatus = 1
            {company_filter}
    """
    return frappe.db.sql(query, tuple(args), as_dict=True)
