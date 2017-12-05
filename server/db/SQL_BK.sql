create table sessions
(
	session_id char(128) not null,
	atime timestamp default CURRENT_TIMESTAMP not null,
	data text null,
	constraint session_id
		unique (session_id)
)
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
;