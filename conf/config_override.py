configs = {}
try:
    import sae.const
    configs['db'] = {
        'host': sae.const.MYSQL_HOST,
        'port': 3306,
        'db': sae.const.MYSQL_DB,
        'user': sae.const.MYSQL_USER,
        'passwd': sae.const.MYSQL_PASS
    }
except ImportError:
    pass
