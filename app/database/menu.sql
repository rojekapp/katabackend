CREATE TABLE `menu` (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT,
  `tenant_id` int(11) NOT NULL,
  `menu_name` text NOT NULL,
  `price` varchar(30) NOT NULL,
  `discount` varchar(30) DEFAULT 'null',
  `order_type` varchar(20) DEFAULT 'null',
  `menu_type` varchar(20) DEFAULT 'null',
  `status` varchar(30) DEFAULT 'null',
  PRIMARY KEY (menu_id)
) 
