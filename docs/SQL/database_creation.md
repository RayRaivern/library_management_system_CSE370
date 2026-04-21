# SQL Create Table commands
(Finish creating the database after making the normalized schema diagram.)

## User Table
```sql
CREATE TABLE User (
    id INT PRIMARY KEY,
    admin BOOLEAN DEFAULT FALSE,
    contact_number VARCHAR(20),
    address TEXT,
    join_date DATE,
    fine_amount DECIMAL(10, 2) DEFAULT 0.00,
    reservation_limit INT,
    borrow_limit INT,
    membership_tier VARCHAR(50)
);
```
