"""
General utility functions to be used by the services
"""

def page_to_query(page_num, post_per_page):
	"""
	Take a page number and the number/page and turn it into a limit/offset. For translating from
	a notation that is easy for clients (page) to the notation used by SQL. Page numbers start at 1
	instead of 0, so any number below 1 will just be 1.

	Returns the offset (i.e. the number to be used in the OFFSET command)
	"""
	if page_num < 1:
		page_num = 1

	return (page_num - 1) * post_per_page