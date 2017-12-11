create table buy
(
	id varchar(50) not null
		primary key,
	no varchar(20) null comment '购货单号',
	provider_no varchar(20) null comment '供应商编号',
	provider_name varchar(100) null comment '供应商名称',
	goods_no varchar(20) null comment '商品编号',
	goods_name varchar(100) null comment '商品名称',
	goods_guige varchar(50) null comment '商品规格',
	goods_unit varchar(10) null comment '商品单位',
	quantity float null comment '购买数量',
	price float null comment '单价',
	money float null comment '数量',
	aprice_after float null comment '买后加权平均单价',
	aprice_before float null comment '买前加权平均单价',
	creater varchar(50) null comment '购买人',
	creater_name varchar(50) null,
	createtime bigint null comment '购买时间'
)
comment '购货清单表' engine=InnoDB
;

create table customer
(
	id varchar(50) not null comment '主键'
		primary key,
	no varchar(20) null comment '客户编号',
	name varchar(100) not null comment '客户名称',
	code varchar(20) null comment '信用代码',
	shuiwu varchar(10) null comment '税务类型',
	person varchar(10) null comment '联系人',
	phone varchar(20) null comment '电话',
	mobile varchar(20) null comment '手机',
	address varchar(200) null comment '地址',
	email varchar(50) null comment '邮箱',
	bank varchar(100) null comment '开户行',
	bank_no varchar(50) null comment '卡号',
	postcode varchar(10) null comment '邮编',
	fax varchar(20) null comment '传真',
	comment varchar(100) null comment '备注',
	creater varchar(50) null comment '创建人',
	createtime bigint not null comment '创建时间'
)
comment '客户表' engine=InnoDB
;

create table goods
(
	id varchar(50) not null
		primary key,
	no varchar(20) null comment '商品编号',
	name varchar(100) null comment '商品名称',
	guige varchar(50) null comment '商品规格',
	unit varchar(10) null comment '计量单位',
	conversion varchar(200) null comment '计量单位换算',
	quantity float null comment '库存',
	money float null comment '累计金额',
	aprice float null comment '加权平均单价'
)
comment '商品表' engine=InnoDB
;

create table provider
(
	id varchar(50) not null
		primary key,
	no varchar(20) not null comment '供应商编号',
	name varchar(100) not null comment '供应商名称',
	code varchar(20) null comment '信用代码',
	shuiwu varchar(10) null comment '税务登记类型',
	person varchar(10) null comment '联系人',
	phone varchar(20) null comment '电话',
	mobile varchar(20) null comment '手机',
	address varchar(200) null comment '地址',
	email varchar(50) null comment '邮箱',
	url varchar(100) null comment '网址',
	postcode varchar(10) null comment '邮编',
	fax varchar(20) null comment '传真',
	comment varchar(100) null comment '备注',
	creater varchar(50) null comment '创建人',
	createtime bigint not null comment '创建时间',
	constraint provider_no_uindex
		unique (no)
)
comment '供应商表' engine=InnoDB
;

create table sale
(
	id varchar(50) not null
		primary key,
	no varchar(20) null comment '销货单号',
	customer_no varchar(20) null comment '客户编号',
	customer_name varchar(100) null comment '客户名称',
	goods_no varchar(20) null comment '商品编号',
	goods_name varchar(100) null comment '商品名称',
	goods_guige varchar(50) null comment '商品规格',
	goods_unit varchar(10) null comment '商品单位',
	quantity float null comment '销售数量',
	price float null comment '单价',
	money float null comment '数量',
	aprice_after float null comment '售后加权平均单价',
	aprice_before float null comment '售前加权平均单价',
	creater varchar(50) null comment '销售人',
	creater_name varchar(50) null,
	createtime bigint null comment '销售时间'
)
comment '销货清单表' engine=InnoDB
;

create table sessions
(
	session_id char(128) not null,
	atime timestamp default CURRENT_TIMESTAMP not null,
	data text null,
	constraint session_id
		unique (session_id)
)
engine=InnoDB
;

create table taizhang
(
	id varchar(50) not null
		primary key,
	no varchar(20) null comment '编号',
	time bigint not null comment '进销货时间',
	deal_no varchar(20) null comment '进/销货单编号',
	goods_no varchar(20) null comment '商品编号',
	goods_name varchar(100) null comment '商品名称',
	goods_guige varchar(50) null comment '商品规格',
	buy_quantity float null comment '购货数量',
	buy_price float null comment '购货单价',
	buy_money float null comment '购货金额',
	sale_quantity float null comment '销货数量',
	sale_price float null comment '销货单价',
	sale_money float null comment '销货金额',
	store_quantity float null comment '累计数量',
	store_money float null comment '累计金额',
	store_aprice float null comment '加权平均进货单价',
	comment varchar(100) null comment '备注'
)
comment '台账表' engine=InnoDB
;

create table user
(
	id varchar(50) not null
		primary key,
	name varchar(20) not null,
	cnname varchar(20) not null,
	password varchar(50) not null,
	constraint user_name_uindex
		unique (name)
)
engine=InnoDB
;

