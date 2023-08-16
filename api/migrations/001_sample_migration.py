steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE accounts (
            id SERIAL NOT NULL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            username VARCHAR(100) NOT NULL UNIQUE,
            hashed_password TEXT NOT NULL,
            phone BIGINT,
            zip INT NOT NULL
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE accounts;
        """,
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE pets (
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            pet_name VARCHAR(100) NOT NULL,
            picture TEXT,
            age SMALLINT,
            species VARCHAR(100),
            breed VARCHAR(100),
            color VARCHAR(100),
            weight INTEGER,
            disease TEXT,
            medication TEXT,
            allergy TEXT,
            dietary_restriction TEXT,
            description TEXT,
            owner_id INTEGER REFERENCES accounts("id") ON DELETE CASCADE
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE pets;
        """,
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE donations (
            id SERIAL NOT NULL PRIMARY KEY,
            item_name VARCHAR(100) NOT NULL,
            description TEXT,
            date DATE NOT NULL,
            picture TEXT,
            category VARCHAR(100) NOT NULL,
            claimed BOOLEAN NOT NULL,
            owner_id INTEGER NOT NULL REFERENCES accounts("id") ON DELETE CASCADE
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE donations;
        """,
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE vaccines (
            id SERIAL NOT NULL PRIMARY KEY,
            pet_id INTEGER NOT NULL REFERENCES pets("id") ON DELETE CASCADE,
            vaccine_name VARCHAR(100) NOT NULL,
            clinic TEXT,
            received_date DATE,
            due_date DATE
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE vaccines;
        """,
    ],
]
