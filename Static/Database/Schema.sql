CREATE TABLE User
    User_ID INT PRIMARY KEY AUTO_INCREMENT,
    Cocktail_ID INT AUTO_INCREMENT,
    Username CHAR NOT NULL,
    Mail CHAR,

CREATE TABLE Cocktail_ID
    Cocktail_ID INT PRIMARY KEY AUTO_INCREMENT,
    Cocktailname CHAR NOT NULL,
    Ingrédient list,
    Ingrédient_ID INT AUTO_INCREMENT,
    Description Text,
    Recette_ID INT AUTO_INCREMENT,
    User_ID INT AUTO_INCREMENT,

CREATE TABLE Ingrédient
    Ingrédient_ID INT PRIMARY KEY AUTO_INCREMENT,
    Cocktail_ID INT AUTO_INCREMENT,
    Ingrédientname CHAR NOT NULL,
    Ingrédient_type CHAR NOT NULL,

CREATE TABLE Recette_ID
    Recette_ID INT PRIMARY KEY AUTO_INCREMENT,
    Recette VARCHAR(255) NOT NULL,
    Cocktail_ID INT AUTO_INCREMENT,
    Recette_QTE list,