create database cadastro default character set utf8 default collate utf8_general_ci;
use cadastro;
create table usuario(
 id int not null auto_increment,
 nome varchar (30) not null default '',
 email varchar (50) not null default '',
 cpf char not null,
 nascimento date not null default '1800-12-30',
 sexo enum('M','F'),
 nacionalidade varchar(30) default 'Brasil',
 primary key (id)
) default charset utf8;