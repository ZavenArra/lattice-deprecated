
CREATE TABLE IF NOT EXISTS `schema_migrations` (
  `version` varchar(255) DEFAULT NULL,
  UNIQUE KEY `idx_schema_migrations_version` (`version`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `schema_migrations`
-- ----------------------------
INSERT INTO `schema_migrations` VALUES ('20120204023751_');


 CREATE TABLE `objecttypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `objecttypename` varchar(50) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `contenttable` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `nodeType` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `contentType` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `sort_order` smallint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `activity` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


insert into `languages` ( `code`, `fullname`, `activity`) values ('en', 'English', NULL);
insert into `languages` ( `code`, `fullname`, `activity`) values ('es', 'Spanish', 'D');
insert into `languages` ( `code`, `fullname`, `activity`) values ('br', 'Portugese', 'D');

CREATE TABLE `rosettas` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `objects` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`objecttype_id` int(11) NOT NULL DEFAULT '0',
	`parentid` int(11) DEFAULT NULL,
	`language_id` int(11) DEFAULT NULL,
	`rosetta_id` int(11) DEFAULT NULL,
	`slug` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
	`decoupleSlugTitle` tinyint(4) DEFAULT '0',
	`dateadded` timestamp NULL DEFAULT NULL,
	`lastmodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`published` tinyint(1) NOT NULL DEFAULT '0',
	`activity` char(1) CHARACTER SET utf8 DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `identifier` (`slug`,`language_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `objectmaps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `objecttype_id` int(11) NOT NULL,
  `type` enum('field','flag','file','object') CHARACTER SET utf8 NOT NULL,
  `index` int(11) NOT NULL,
  `column` varchar(100) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `contents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object_id` int(11) NOT NULL DEFAULT '0',
  `title` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `field1` text CHARACTER SET utf8,
  `field2` text CHARACTER SET utf8,
  `field3` text CHARACTER SET utf8,
  `field4` text CHARACTER SET utf8,
  `field5` text CHARACTER SET utf8,
  `field6` text CHARACTER SET utf8,
  `field7` text CHARACTER SET utf8,
  `field8` text CHARACTER SET utf8,
  `field9` text CHARACTER SET utf8,
  `field10` text CHARACTER SET utf8,
  `field11` text CHARACTER SET utf8,
  `field12` text CHARACTER SET utf8,
  `field13` text CHARACTER SET utf8,
  `field14` text CHARACTER SET utf8,
  `field15` text CHARACTER SET utf8,
  `field16` text CHARACTER SET utf8,
  `field17` text CHARACTER SET utf8,
  `field18` text CHARACTER SET utf8,
  `field19` text CHARACTER SET utf8,
  `field20` text CHARACTER SET utf8,
  `field21` text CHARACTER SET utf8,
  `field22` text CHARACTER SET utf8,
  `field23` text CHARACTER SET utf8,
  `field24` text CHARACTER SET utf8,
  `field25` text CHARACTER SET utf8,
  `field26` text CHARACTER SET utf8,
  `field27` text CHARACTER SET utf8,
  `field28` text CHARACTER SET utf8,
  `field29` text CHARACTER SET utf8,
  `field30` text CHARACTER SET utf8,
  `field31` text CHARACTER SET utf8,
  `field32` text CHARACTER SET utf8,
  `field33` text CHARACTER SET utf8,
  `field34` text CHARACTER SET utf8,
  `field35` text CHARACTER SET utf8,
  `field36` text CHARACTER SET utf8,
  `field37` text CHARACTER SET utf8,
  `field38` text CHARACTER SET utf8,
  `field39` text CHARACTER SET utf8,
  `field40` text CHARACTER SET utf8,
  `field41` text CHARACTER SET utf8,
  `field42` text CHARACTER SET utf8,
  `field43` text CHARACTER SET utf8,
  `field44` text CHARACTER SET utf8,
  `field45` text CHARACTER SET utf8,
  `field46` text CHARACTER SET utf8,
  `field47` text CHARACTER SET utf8,
  `field48` text CHARACTER SET utf8,
  `field49` text CHARACTER SET utf8,
  `field50` text CHARACTER SET utf8,
  `field51` text CHARACTER SET utf8,
  `field52` text CHARACTER SET utf8,
  `field53` text CHARACTER SET utf8,
  `field54` text CHARACTER SET utf8,
  `field55` text CHARACTER SET utf8,
  `field56` text CHARACTER SET utf8,
  `field57` text CHARACTER SET utf8,
  `field58` text CHARACTER SET utf8,
  `field59` text CHARACTER SET utf8,
  `field60` text CHARACTER SET utf8,
  `field61` text CHARACTER SET utf8,
  `field62` text CHARACTER SET utf8,
  `field63` text CHARACTER SET utf8,
  `field64` text CHARACTER SET utf8,
  `field65` text CHARACTER SET utf8,
  `field66` text CHARACTER SET utf8,
  `field67` text CHARACTER SET utf8,
  `field68` text CHARACTER SET utf8,
  `field69` text CHARACTER SET utf8,
  `field70` text CHARACTER SET utf8,
  `field71` text CHARACTER SET utf8,
  `field72` text CHARACTER SET utf8,
  `field73` text CHARACTER SET utf8,
  `field74` text CHARACTER SET utf8,
  `field75` text CHARACTER SET utf8,
  `field76` text CHARACTER SET utf8,
  `field77` text CHARACTER SET utf8,
  `field78` text CHARACTER SET utf8,
  `field79` text CHARACTER SET utf8,
  `field80` text CHARACTER SET utf8,
  `field81` text CHARACTER SET utf8,
  `field82` text CHARACTER SET utf8,
  `field83` text CHARACTER SET utf8,
  `field84` text CHARACTER SET utf8,
  `field85` text CHARACTER SET utf8,
  `field86` text CHARACTER SET utf8,
  `field87` text CHARACTER SET utf8,
  `field88` text CHARACTER SET utf8,
  `field89` text CHARACTER SET utf8,
  `field90` text CHARACTER SET utf8,
  `field91` text CHARACTER SET utf8,
  `field92` text CHARACTER SET utf8,
  `field93` text CHARACTER SET utf8,
  `field94` text CHARACTER SET utf8,
  `field95` text CHARACTER SET utf8,
  `field96` text CHARACTER SET utf8,
  `field97` text CHARACTER SET utf8,
  `field98` text CHARACTER SET utf8,
  `field99` text CHARACTER SET utf8,
  `field100` text CHARACTER SET utf8,
  `file1` text CHARACTER SET utf8,
  `file2` text CHARACTER SET utf8,
  `file3` text CHARACTER SET utf8,
  `file4` text CHARACTER SET utf8,
  `file5` text CHARACTER SET utf8,
  `file6` text CHARACTER SET utf8,
  `file7` text CHARACTER SET utf8,
  `file8` text CHARACTER SET utf8,
  `file9` text CHARACTER SET utf8,
  `file10` text CHARACTER SET utf8,
  `file11` text CHARACTER SET utf8,
  `file12` text CHARACTER SET utf8,
  `file13` text CHARACTER SET utf8,
  `file14` text CHARACTER SET utf8,
  `file15` text CHARACTER SET utf8,
  `file16` text CHARACTER SET utf8,
  `file17` text CHARACTER SET utf8,
  `file18` text CHARACTER SET utf8,
  `file19` text CHARACTER SET utf8,
  `file20` text CHARACTER SET utf8,
  `file21` text CHARACTER SET utf8,
  `file22` text CHARACTER SET utf8,
  `file23` text CHARACTER SET utf8,
  `file24` text CHARACTER SET utf8,
  `file25` text CHARACTER SET utf8,
  `file26` text CHARACTER SET utf8,
  `file27` text CHARACTER SET utf8,
  `file28` text CHARACTER SET utf8,
  `file29` text CHARACTER SET utf8,
  `file30` text CHARACTER SET utf8,
  `file31` text CHARACTER SET utf8,
  `file32` text CHARACTER SET utf8,
  `file33` text CHARACTER SET utf8,
  `file34` text CHARACTER SET utf8,
  `file35` text CHARACTER SET utf8,
  `file36` text CHARACTER SET utf8,
  `file37` text CHARACTER SET utf8,
  `file38` text CHARACTER SET utf8,
  `file39` text CHARACTER SET utf8,
  `file40` text CHARACTER SET utf8,
  `file41` text CHARACTER SET utf8,
  `file42` text CHARACTER SET utf8,
  `file43` text CHARACTER SET utf8,
  `file44` text CHARACTER SET utf8,
  `file45` text CHARACTER SET utf8,
  `file46` text CHARACTER SET utf8,
  `file47` text CHARACTER SET utf8,
  `file48` text CHARACTER SET utf8,
  `file49` text CHARACTER SET utf8,
  `file50` text CHARACTER SET utf8,
  `file51` text CHARACTER SET utf8,
  `file52` text CHARACTER SET utf8,
  `file53` text CHARACTER SET utf8,
  `file54` text CHARACTER SET utf8,
  `file55` text CHARACTER SET utf8,
  `file56` text CHARACTER SET utf8,
  `file57` text CHARACTER SET utf8,
  `file58` text CHARACTER SET utf8,
  `file59` text CHARACTER SET utf8,
  `file60` text CHARACTER SET utf8,
  `file61` text CHARACTER SET utf8,
  `file62` text CHARACTER SET utf8,
  `file63` text CHARACTER SET utf8,
  `file64` text CHARACTER SET utf8,
  `file65` text CHARACTER SET utf8,
  `file66` text CHARACTER SET utf8,
  `file67` text CHARACTER SET utf8,
  `file68` text CHARACTER SET utf8,
  `file69` text CHARACTER SET utf8,
  `file71` text CHARACTER SET utf8,
  `file72` text CHARACTER SET utf8,
  `file73` text CHARACTER SET utf8,
  `file74` text CHARACTER SET utf8,
  `file75` text CHARACTER SET utf8,
  `file76` text CHARACTER SET utf8,
  `file77` text CHARACTER SET utf8,
  `file78` text CHARACTER SET utf8,
  `file79` text CHARACTER SET utf8,
  `file80` text CHARACTER SET utf8,
  `file81` text CHARACTER SET utf8,
  `file82` text CHARACTER SET utf8,
  `file83` text CHARACTER SET utf8,
  `file84` text CHARACTER SET utf8,
  `file85` text CHARACTER SET utf8,
  `file86` text CHARACTER SET utf8,
  `file87` text CHARACTER SET utf8,
  `file88` text CHARACTER SET utf8,
  `file89` text CHARACTER SET utf8,
  `file90` text CHARACTER SET utf8,
  `file91` text CHARACTER SET utf8,
  `file92` text CHARACTER SET utf8,
  `file93` text CHARACTER SET utf8,
  `file94` text CHARACTER SET utf8,
  `file95` text CHARACTER SET utf8,
  `file96` text CHARACTER SET utf8,
  `file97` text CHARACTER SET utf8,
  `file98` text CHARACTER SET utf8,
  `file99` text CHARACTER SET utf8,
  `file100` text CHARACTER SET utf8,
  `flag1` text CHARACTER SET utf8,
  `flag2` text CHARACTER SET utf8,
  `flag3` text CHARACTER SET utf8,
  `flag4` text CHARACTER SET utf8,
  `flag5` text CHARACTER SET utf8,
  `flag6` text CHARACTER SET utf8,
  `flag7` text CHARACTER SET utf8,
  `flag8` text CHARACTER SET utf8,
  `flag9` text CHARACTER SET utf8,
  `flag10` text CHARACTER SET utf8,
  `flag11` text CHARACTER SET utf8,
  `flag12` text CHARACTER SET utf8,
  `flag13` text CHARACTER SET utf8,
  `flag14` text CHARACTER SET utf8,
  `flag15` text CHARACTER SET utf8,
  `flag16` text CHARACTER SET utf8,
  `flag17` text CHARACTER SET utf8,
  `flag18` text CHARACTER SET utf8,
  `flag19` text CHARACTER SET utf8,
  `flag20` text CHARACTER SET utf8,
  `flag21` text CHARACTER SET utf8,
  `flag22` text CHARACTER SET utf8,
  `flag23` text CHARACTER SET utf8,
  `flag24` text CHARACTER SET utf8,
  `flag25` text CHARACTER SET utf8,
  `flag26` text CHARACTER SET utf8,
  `flag27` text CHARACTER SET utf8,
  `flag28` text CHARACTER SET utf8,
  `flag29` text CHARACTER SET utf8,
  `flag30` text CHARACTER SET utf8,
  `flag31` text CHARACTER SET utf8,
  `flag32` text CHARACTER SET utf8,
  `flag33` text CHARACTER SET utf8,
  `flag34` text CHARACTER SET utf8,
  `flag35` text CHARACTER SET utf8,
  `flag36` text CHARACTER SET utf8,
  `flag37` text CHARACTER SET utf8,
  `flag38` text CHARACTER SET utf8,
  `flag39` text CHARACTER SET utf8,
  `flag40` text CHARACTER SET utf8,
  `flag41` text CHARACTER SET utf8,
  `flag42` text CHARACTER SET utf8,
  `flag43` text CHARACTER SET utf8,
  `flag44` text CHARACTER SET utf8,
  `flag45` text CHARACTER SET utf8,
  `flag46` text CHARACTER SET utf8,
  `flag47` text CHARACTER SET utf8,
  `flag48` text CHARACTER SET utf8,
  `flag49` text CHARACTER SET utf8,
  `flag50` text CHARACTER SET utf8,
  `flag51` text CHARACTER SET utf8,
  `flag52` text CHARACTER SET utf8,
  `flag53` text CHARACTER SET utf8,
  `flag54` text CHARACTER SET utf8,
  `flag55` text CHARACTER SET utf8,
  `flag56` text CHARACTER SET utf8,
  `flag57` text CHARACTER SET utf8,
  `flag58` text CHARACTER SET utf8,
  `flag59` text CHARACTER SET utf8,
  `flag60` text CHARACTER SET utf8,
  `flag61` text CHARACTER SET utf8,
  `flag62` text CHARACTER SET utf8,
  `flag63` text CHARACTER SET utf8,
  `flag64` text CHARACTER SET utf8,
  `flag65` text CHARACTER SET utf8,
  `flag66` text CHARACTER SET utf8,
  `flag67` text CHARACTER SET utf8,
  `flag68` text CHARACTER SET utf8,
  `flag69` text CHARACTER SET utf8,
  `flag70` text CHARACTER SET utf8,
  `flag71` text CHARACTER SET utf8,
  `flag72` text CHARACTER SET utf8,
  `flag73` text CHARACTER SET utf8,
  `flag74` text CHARACTER SET utf8,
  `flag75` text CHARACTER SET utf8,
  `flag76` text CHARACTER SET utf8,
  `flag77` text CHARACTER SET utf8,
  `flag78` text CHARACTER SET utf8,
  `flag79` text CHARACTER SET utf8,
  `flag80` text CHARACTER SET utf8,
  `flag81` text CHARACTER SET utf8,
  `flag82` text CHARACTER SET utf8,
  `flag83` text CHARACTER SET utf8,
  `flag84` text CHARACTER SET utf8,
  `flag85` text CHARACTER SET utf8,
  `flag86` text CHARACTER SET utf8,
  `flag87` text CHARACTER SET utf8,
  `flag88` text CHARACTER SET utf8,
  `flag89` text CHARACTER SET utf8,
  `flag90` text CHARACTER SET utf8,
  `flag91` text CHARACTER SET utf8,
  `flag92` text CHARACTER SET utf8,
  `flag93` text CHARACTER SET utf8,
  `flag94` text CHARACTER SET utf8,
  `flag95` text CHARACTER SET utf8,
  `flag96` text CHARACTER SET utf8,
  `flag97` text CHARACTER SET utf8,
  `flag98` text CHARACTER SET utf8,
  `flag99` text CHARACTER SET utf8,
  `flag100` text CHARACTER SET utf8,
  `activity` char(1) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`object_id`),
  KEY `id` (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(100) DEFAULT NULL,
  `mime` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `objectrelationships` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`lattice_id` int(11) NOT NULL,
	`object_id` int(11) NOT NULL,
	`connectedobject_id` int(11) NOT NULL,
	`sortorder` int(11) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `objectelementrelationships` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object_id` int(11) NOT NULL,
  `elementobject_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `lattices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(200) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT into `lattices` (`id`, `name`) values (1, 'lattice');

CREATE TABLE `objects_roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `object_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=575 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag` varchar(255) NOT NULL,
	`language_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `objects_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `tagbuckets` (
	`id` int(11) NOT NULL,
	`name` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `tags_tagbuckets` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`tag_id` int(11) NOT NULL,
	`tagbucket_id` int(11) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `tagbucket_id` (`tagbucket_id`),
	KEY `tag_id` (`tag_id`),
	CONSTRAINT `tags_tagbuckets_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`),
	CONSTRAINT `tags_tagbuckets_tagbucket_id_fk` FOREIGN KEY (`tagbucket_id`) REFERENCES `tagbuckets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
