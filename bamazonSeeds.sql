DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
    item_id INT(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50),
    price DECIMAL(10, 2),
    stock_quantity INT(10),

    PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("bike", "sports", 85, 4), 
        ("basketball", "sports", 23.23, 10),
        ("paperbags", "packing", 3.30, 50),
        ("tylenol", "pharmacy", 2.15, 10),
        ("hats", "men", 6, 12),
        ("hats", "women", 8, 32),
        ("hats", "children", 10.25, 10),
        ("footwear", "men", 8, 19),
        ("footwear", "women", 6, 15),
        ("footwear", "children", 5.25, 30)