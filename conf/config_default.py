config = {
    'db': {
        'host': '',
        'port': '',
        'db': '',
        'user': '',
        'passwd': ''
    }
}
try:
    import sae.const

    config['db'] = {
        'host': sae.const.MYSQL_HOST,
        'port': 3306,
        'db': sae.const.MYSQL_DB,
        'user': sae.const.MYSQL_USER,
        'passwd': sae.const.MYSQL_PASS
    }
except ImportError:
    pass
