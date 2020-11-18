
CREATE TABLE `tenant` (
  `tenant_id` int(11) NOT NULL AUTO_INCREMENT,
  `tenant_name` varchar(100) NOT NULL,
  `tenant_status` varchar(100) DEFAULT 'null',
  `presentase_bagi_hasil` varchar(100) NOT NULL,
  `message_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
   `user_tenant` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (tenant_id)
) 