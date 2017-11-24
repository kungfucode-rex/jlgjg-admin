import json
def OK_Result(msg, data=[]):
    result = {
        'code': 200,
        'msg': msg,
        'data': data
    }
    return json.dumps(result)

def Error_Result(msg, data=[]):
    result = {
        'code': 0,
        'msg': msg,
        'data': data
    }
    return json.dumps(result)