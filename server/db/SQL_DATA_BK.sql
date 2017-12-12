INSERT INTO user (id, name, cnname, password) VALUES ('1', 'admin', '管理员', '21232f297a57a5a743894a0e4a801fc3');

INSERT INTO customer (id, no, name, code, shuiwu, person, phone, mobile, address, email, bank, bank_no, postcode, fax, comment, creater, createtime) VALUES ('001512807586021a5f0f3fb43af4c728ee2047bf7f5e928000', 'K00002', '客户一', '12344', '1', '赵武', '78451587458', '', '', '', '', '', '', '', '', '', 1512807580522);
INSERT INTO customer (id, no, name, code, shuiwu, person, phone, mobile, address, email, bank, bank_no, postcode, fax, comment, creater, createtime) VALUES ('0015128254795945ceb32a47ac341bbb1856bb7b2853f47000', 'K00003', '客户03', '', '1', '老大', '15424874512', '', '', '', '', '', '', '', '', '1', 1512825479612);

INSERT INTO goods (id, no, name, guige, unit, conversion, quantity, money, aprice) VALUES ('001512997938522135923b9ae0541b2977c3a8d9e05ae7d000', 'S0001', '商品1', '111111111111', 'ton', '', 1, 139, 139);
INSERT INTO goods (id, no, name, guige, unit, conversion, quantity, money, aprice) VALUES ('001512997986876d8142bf8039e454b9ffd9a556b2fcc7b000', 'S0002', '商品2', '2222222222', 'ton', '', 1, 40, 40);

INSERT INTO provider (id, no, name, code, shuiwu, person, phone, mobile, address, email, url, postcode, fax, comment, creater, createtime) VALUES ('001512804219506f59304ebb6344e9ead2ca267cd46d65d000', 'G0001', '供应商1', '12344', '2', '李四', '0265948745', '', '', '', '', '', '', '', '', 1512804219334);
INSERT INTO provider (id, no, name, code, shuiwu, person, phone, mobile, address, email, url, postcode, fax, comment, creater, createtime) VALUES ('001512824366569ea6f7ef6bd2243d3be99991bcebfd939000', 'G0002', '供应商２', '3414132431', '2', '查三', '123414', '123432144', 'asfeef', 'wer', 'qwer', 'asfd', 'asdf', 'asdfae', '1', 1512824366584);