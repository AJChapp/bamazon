DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE stock (
  id INT NOT NULL AUTO_INCREMENT,
  item VARCHAR(45) NOT NULL,
  quantity INT(5) NOT NULL,
  price DECIMAL (10,2)NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO stock (item, quantity, price)
VALUES ("Tree", 50, 5.50);

INSERT INTO stock (item, quantity, price)
VALUES ("Flower", 300, 49.99);

INSERT INTO stock (item, quantity, price)
VALUES ("Bush", 100, 9.99);

INSERT INTO stock (item, quantity, price)
VALUES ("Grass", 1000, .99);


