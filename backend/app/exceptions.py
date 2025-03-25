class NotFoundError(Exception):
    code = "not_found"
    msg_template = "{msg}"
