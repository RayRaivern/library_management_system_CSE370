# SQL Create Table commands

Database name: **LibraryDB**

## Database Creation

```sql
CREATE DATABASE LibraryDB;
```

## 1. Membership Table

```sql
CREATE TABLE Membership_Tiers (
    tier_name VARCHAR(50) PRIMARY KEY,
    borrow_limit INT,
    reservation_limit INT
);
```

## 2. User Table

```sql
CREATE TABLE User (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN DEFAULT FALSE,
    contact_number VARCHAR(20),
    address TEXT,
    join_date DATE,
    fine_amount DECIMAL(10, 2) DEFAULT 0.00,
    membership_tier VARCHAR(50),
    FOREIGN KEY (membership_tier) REFERENCES Membership_Tiers(tier_name)
);
```

## 3. Book Table

```sql
CREATE TABLE Book (
    ISBN VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    price DECIMAL(10, 2),
    language VARCHAR(50),
    times_borrowed INT DEFAULT 0
);
```

## 4. Book_Categories Table

```sql
CREATE TABLE Book_Categories (
    ISBN VARCHAR(20),
    category_type VARCHAR(50),
    value VARCHAR(100),
    PRIMARY KEY (ISBN, category_type),
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN) ON DELETE CASCADE
);
```

## 5. Book_Tags Table

```sql
CREATE TABLE Book_Tags (
    ISBN VARCHAR(20),
    tag VARCHAR(50),
    PRIMARY KEY (ISBN, tag),
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN) ON DELETE CASCADE
);
```

## 6. Copy Table

```sql
CREATE TABLE Copy (
    ISBN VARCHAR(20),
    barcode VARCHAR(50) PRIMARY KEY,
    status VARCHAR(20),
    `condition` VARCHAR(50),
    acquisition_date DATE,
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN) ON DELETE CASCADE
);
```

## 7. Review Table

```sql
CREATE TABLE Review (
    ISBN VARCHAR(20),
    user_id INT,
    date_and_time DATETIME,
    last_edit_date DATETIME,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    PRIMARY KEY (ISBN, date_and_time),
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN),
    FOREIGN KEY (user_id) REFERENCES User(id)
);
```

## 8. Reservations Table

```sql
CREATE TABLE Reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    ISBN VARCHAR(20),
    user_id INT,
    reserve_date DATE,
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN),
    FOREIGN KEY (user_id) REFERENCES User(id)
);
```

## 9. Loans Table

```sql
CREATE TABLE Loans (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(50),
    user_id INT,
    borrow_date DATE,
    due_date DATE,
    return_date DATE NULL,
    FOREIGN KEY (barcode) REFERENCES Copy(barcode),
    FOREIGN KEY (user_id) REFERENCES User(id)
);
```
