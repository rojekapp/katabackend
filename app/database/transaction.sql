
CREATE TABLE `transaction` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `sub_total` varchar(30) NOT NULL,
  `service` varchar(30) DEFAULT 'null',
  `total` varchar(30) NOT NULL,
  `promo` varchar(30) DEFAULT 'null',
  `cash_amount` varchar(30) DEFAULT 'null',
  `card_number` varchar(100) DEFAULT 'null',
  `other_payment` varchar(30) DEFAULT 'null',
  `transaction_user_name` varchar(100) DEFAULT 'null',
  `transaction_time` varchar(50) DEFAULT 'null',
  `id_desc` varchar(50) DEFAULT 'null',
  `tax` varchar(100) DEFAULT 'null',
  `after_promo` varchar(50) DEFAULT 'null', 
  `after_service` varchar(50) DEFAULT 'null',
  `after_tax` varchar(50) DEFAULT 'null',
  `tenant_id` int(30),
  PRIMARY KEY (transaction_id)
) 