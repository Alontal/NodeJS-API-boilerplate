
-- run this script to build sys_users table
DROP TABLE IF EXISTS `sys_users`;
CREATE TABLE `sys_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iid` text NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone` int(11) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `ip` int(11) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `token` varchar(600) DEFAULT NULL,
  `picture` text,
  `time_created` bigint(20) DEFAULT NULL,
  `time_updated` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
)
