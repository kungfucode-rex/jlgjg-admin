import time
from ORM import Model, IntegerField, StringField, BooleanField, FloatField, TextField

class User(Model):
    __table__ = 'user'
    id = IntegerField(primary_key=True)
    name = StringField()
    cnname = StringField()
    password = StringField(ddl='varchar(50)')
