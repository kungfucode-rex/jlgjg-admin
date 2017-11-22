import mysql.connector
def application(environ, start_response):
    start_response('200 ok', [('content-type', 'text/plain')])
    conn = mysql.connector.connect(user='2on5klom4y', password='54hzmw13z21yk5kmwzmm2wwl0mji42jly1j3llih', use_unicode=True)
    cursor = conn.cursor()
    cursor.execute('select * from jlgjg.taizhang')
    values = cursor.fetchall()
    print values
    cursor.close()
    conn.close()

    return str(values)