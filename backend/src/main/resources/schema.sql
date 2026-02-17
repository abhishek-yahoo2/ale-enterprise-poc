-- Document Tracker Schema
-- H2 Database initialization script
-- Automatically executed on application startup

-- Create document_tracker table
CREATE TABLE IF NOT EXISTS document_tracker (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    gen_id VARCHAR(255) NOT NULL UNIQUE,
    document_name VARCHAR(255),
    document_date DATE,
    document_type VARCHAR(255),
    client_name VARCHAR(255),
    ale_gen_id VARCHAR(255),
    account_number VARCHAR(255),
    security_number VARCHAR(255),
    status VARCHAR(100),
    current_location VARCHAR(255),
    business_unit VARCHAR(255),
    link VARCHAR(1000),
    received_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    modified_at TIMESTAMP,
    modified_by VARCHAR(255)
);

-- Create sub_document table with foreign key to document_tracker
CREATE TABLE IF NOT EXISTS sub_document (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    gen_id BIGINT NOT NULL,
    sub_id VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    status_message VARCHAR(500),
    processed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    modified_at TIMESTAMP,
    modified_by VARCHAR(255),
    FOREIGN KEY (gen_id) REFERENCES document_tracker(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_document_tracker_gen_id ON document_tracker(gen_id);
CREATE INDEX IF NOT EXISTS idx_document_tracker_created_by ON document_tracker(created_by);
CREATE INDEX IF NOT EXISTS idx_document_tracker_document_type ON document_tracker(document_type);
CREATE INDEX IF NOT EXISTS idx_document_tracker_status ON document_tracker(status);
CREATE INDEX IF NOT EXISTS idx_document_tracker_client_name ON document_tracker(client_name);
CREATE INDEX IF NOT EXISTS idx_document_tracker_business_unit ON document_tracker(business_unit);
CREATE INDEX IF NOT EXISTS idx_sub_document_gen_id ON sub_document(gen_id);
CREATE INDEX IF NOT EXISTS idx_sub_document_status ON sub_document(status);
-- Create capital_call table
CREATE TABLE IF NOT EXISTS capital_call (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ale_batch_id VARCHAR(255) NOT NULL UNIQUE,
    from_date DATE,
    to_date DATE,
    day_type VARCHAR(100),
    total_amount DECIMAL(19, 2) NOT NULL,
    workflow_status VARCHAR(50) NOT NULL,
    queue VARCHAR(50) NOT NULL,
    locked_by VARCHAR(255),
    locked_at TIMESTAMP,
    client_name VARCHAR(255),
    asset_description VARCHAR(500),
    is_sensitive BOOLEAN,
    toe_reference VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    modified_at TIMESTAMP,
    modified_by VARCHAR(255),
    version INT DEFAULT 0
);

-- Create capital_call_breakdown table
CREATE TABLE IF NOT EXISTS capital_call_breakdown (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    capital_call_id BIGINT NOT NULL,
    portfolio_name VARCHAR(255) NOT NULL,
    currency_code VARCHAR(10) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    FOREIGN KEY (capital_call_id) REFERENCES capital_call(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_capital_call_ale_batch_id ON capital_call(ale_batch_id);
CREATE INDEX IF NOT EXISTS idx_capital_call_workflow_status ON capital_call(workflow_status);
CREATE INDEX IF NOT EXISTS idx_capital_call_queue ON capital_call(queue);
CREATE INDEX IF NOT EXISTS idx_capital_call_created_by ON capital_call(created_by);
CREATE INDEX IF NOT EXISTS idx_capital_call_from_date ON capital_call(from_date);
CREATE INDEX IF NOT EXISTS idx_capital_call_to_date ON capital_call(to_date);
CREATE INDEX IF NOT EXISTS idx_capital_call_breakdown_id ON capital_call_breakdown(capital_call_id);