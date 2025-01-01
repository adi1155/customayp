import frappe
from frappe.utils import now

def create_sales_invoice_on_purchase_order_submission(doc, method):
    """
    When a Purchase Order is submitted in GMP Foods, automatically create a corresponding Sales Invoice in AYP Group.
    """
    if doc.supplier == 'AYP Group':
        try:
            sales_invoice = frappe.get_doc({
                'doctype': 'Sales Invoice',
                'customer': 'GMP Foods',
                'posting_date': now(),
                'items': []
            })
            for item in doc.items:
                sales_invoice.append('items', {
                    'item_code': item.item_code,
                    'qty': item.qty,
                    'rate': item.rate,
                    'amount': item.amount,
                    'uom': item.uom
                })
            sales_invoice.insert(ignore_permissions=True)
            frappe.db.commit()
        except Exception as e:
            frappe.log_error(f"Error creating Sales Invoice for {doc.name}: {str(e)}")


def create_payment_entry_on_payment_entry_submission(doc, method):
    """
    When a Payment Entry is submitted in AYP Group, create a Payment Entry in GMP Foods in Draft mode.
    """
    if doc.party_type == 'Customer' and doc.party == 'GMP Foods':
        try:
            payment_entry = frappe.get_doc({
                'doctype': 'Payment Entry',
                'payment_type': 'Pay',
                'party_type': 'Supplier',
                'party': 'AYP Group',
                'posting_date': now(),
                'paid_amount': doc.paid_amount,
                'received_amount': doc.received_amount,
                'reference_no': doc.reference_no,
                'reference_date': doc.reference_date,
                'status': 'Draft',  # Set to draft status
            })
            payment_entry.insert(ignore_permissions=True)
            frappe.db.commit()
        except Exception as e:
            frappe.log_error(f"Error creating Payment Entry for {doc.name}: {str(e)}")


def on_payment_entry_approval(doc, method):
    """
    When a Payment Entry is approved in GMP Foods, impact the accounts by updating the status and creating accounting entries.
    """
    if doc.status == 'Approved':
        try:
            doc.submit()  # Submit the payment entry to impact the accounts
            frappe.db.commit()
        except Exception as e:
            frappe.log_error(f"Error approving Payment Entry for {doc.name}: {str(e)}")


def send_notification_on_pending_approval(doc, method):
    """
    Send a notification to the GMP Foods finance team when a Payment Entry is pending approval.
    """
    recipients = ["finance_team@gmpfoods.com"]  # Replace with the actual email addresses of the finance team
    subject = f"Payment Entry Pending Approval: {doc.name}"
    message = f"A payment entry for {doc.party} is pending approval. Please review and approve it as soon as possible."
    try:
        frappe.sendmail(recipients=recipients, subject=subject, message=message)
    except Exception as e:
        frappe.log_error(f"Error sending notification for Payment Entry {doc.name}: {str(e)}")


def setup_hooks():
    """
    Register hooks for intercompany transactions.
    """
    frappe.get_hooks({
        'doc_events': {
            'Purchase Order': {
                'on_submit': create_sales_invoice_on_purchase_order_submission
            },
            'Payment Entry': {
                'on_submit': create_payment_entry_on_payment_entry_submission,
                'on_update': send_notification_on_pending_approval,
                'before_save': on_payment_entry_approval
            }
        }
    })
