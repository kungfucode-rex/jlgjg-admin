import time
from ORM import Model, IntegerField, StringField, BooleanField, FloatField, TextField

class User(Model):
    __table__ = 'user'
    id = IntegerField(primary_key=True)
    name = StringField()
    cnname = StringField()
    password = StringField(ddl='varchar(50)')

class Provider(Model):
    __table__ = 'provider'
    id = StringField(primary_key=True)
    no = StringField()
    name = StringField()
    code = StringField()
    shuiwu = StringField()
    person = StringField()
    phone = StringField()
    mobile = StringField()
    address = StringField()
    email = StringField()
    url = StringField()
    postcode = StringField()
    fax = StringField()
    comment = StringField()
    creater = StringField()
    createtime = IntegerField()

class Customer(Model):
    __table__ = 'customer'
    id = StringField(primary_key=True)
    no = StringField()
    name = StringField()
    code = StringField()
    shuiwu = StringField()
    person = StringField()
    phone = StringField()
    mobile = StringField()
    address = StringField()
    email = StringField()
    bank = StringField()
    bank_no = StringField()
    postcode = StringField()
    fax = StringField()
    comment = StringField()
    creater = StringField()
    createtime = IntegerField()

class Goods(Model):
    __table__ = 'goods'
    id = StringField(primary_key=True)
    no = StringField()
    name = StringField()
    guige = StringField()
    unit = StringField()
    conversion = StringField()
    quantity = FloatField()
    aprice = FloatField()
    money = FloatField()

class Buy(Model):
    __table__ = 'buy'
    id = StringField(primary_key=True)
    no = StringField()
    provider_no = StringField()
    provider_name = StringField()
    goods_no = StringField()
    goods_name = StringField()
    goods_guige = StringField()
    goods_unit = StringField()
    quantity = FloatField()
    price = FloatField()
    money = FloatField()
    aprice_before = FloatField()
    aprice_after = FloatField()
    creater = StringField()
    creater_name = StringField()
    createtime = IntegerField()

class Sale(Model):
    __table__ = 'sale'
    id = StringField(primary_key=True)
    no = StringField()
    customer_no = StringField()
    customer_name = StringField()
    goods_no = StringField()
    goods_name = StringField()
    goods_guige = StringField()
    goods_unit = StringField()
    quantity = FloatField()
    price = FloatField()
    money = FloatField()
    aprice_before = FloatField()
    aprice_after = FloatField()
    creater = StringField()
    creater_name = StringField()
    createtime = IntegerField()


class Taizhang(Model):
    __table__ = 'taizhang'
    id = StringField(primary_key=True)
    no = StringField()
    time = StringField()
    deal_no = StringField()
    goods_no = StringField()
    goods_name = StringField()
    goods_guige = StringField()
    buy_quantity = IntegerField()
    buy_price = FloatField()
    buy_money = FloatField()
    sale_quantity = FloatField()
    sale_price = FloatField()
    sale_money = FloatField()
    store_quantity = FloatField()
    store_money = FloatField()
    store_aprice = FloatField()
    comment = StringField()
