DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iid` text NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `ip` int(11) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `token` varchar(600) DEFAULT NULL,
  `picture` text,
  `time_created` bigint(20) DEFAULT NULL,
  `time_updated` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `notifications`;

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  `title` text,
  `from` varchar(100) DEFAULT NULL,
  `to_phone` varchar(300) DEFAULT NULL,
  `to_email` varchar(300) DEFAULT NULL,
  `msg` text,
  `severity` int(11) DEFAULT NULL,
  `cc` varchar(45) DEFAULT NULL,
  `sent` tinyint(4) DEFAULT '0',
  `date_created` timestamp(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8;

