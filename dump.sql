-- SQL Dump for Mind2025 Application
-- Contains sample data for one user and multiple products

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data
TRUNCATE TABLE `User`;
TRUNCATE TABLE `Product`;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert a sample user (password is "password123" - hashed with bcrypt)
INSERT INTO `User` (`id`, `email`, `name`, `password`, `createdAt`, `updatedAt`) VALUES
('11e5d48c-c4d0-4e8d-9677-54aeae2ca8a7', 'usuario@teste.com', 'Usuário Teste', '$2b$10$BQzeADrDl.oZd0ZhHx6h3Ol/EJFQRcN8rnFn8Y5.LOZR6EUZ6D.Gi', '2023-11-01 10:00:00', '2023-11-01 10:00:00');

-- Insert sample products (mix of income and expenses)
INSERT INTO `Product` (`id`, `name`, `description`, `quantity`, `price`, `date`, `category`, `createdAt`, `updatedAt`, `userId`) VALUES
-- Income entries (category = true)
('f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454', 'Venda de notebooks', 'Venda de notebooks para empresa XYZ', 3, 4500.00, '2023-10-15 00:00:00', true, '2023-10-15 14:30:00', '2023-10-15 14:30:00', '11e5d48c-c4d0-4e8d-9677-54aeae2ca8a7'),
('a7f9b342-3e25-4b95-9e5d-5f846c4bf611', 'Consultoria TI', 'Serviço de consultoria mensal', 1, 2000.00, '2023-10-20 00:00:00', true, '2023-10-20 09:15:00', '2023-10-20 09:15:00', '11e5d48c-c4d0-4e8d-9677-54aeae2ca8a7'),
('d1e0f45e-b67c-4eb1-8743-5d82a3953f22', 'Monitor 27 polegadas', 'Venda de monitor para cliente final', 2, 1200.00, '2023-11-02 00:00:00', true, '2023-11-02 16:45:00', '2023-11-02 16:45:00', '11e5d48c-c4d0-4e8d-9677-54aeae2ca8a7'),
('c4a9e237-f0b6-4d3a-a2e1-28f159d7230e', 'SSD 1TB', 'Venda de SSD para atualização', 5, 450.00, '2023-11-10 00:00:00', true, '2023-11-10 11:20:00', '2023-11-10 11:20:00', '11e5d48c-c4d0-4e8d-9677-54aeae2ca8a7'),

-- Expense entries (category = false)
('b3d2a7e6-8f4c-4a5b-9d0e-3f5c6a1b8c9d', 'Compra de componentes', 'Peças para manutenção', 10, 150.00, '2023-10-10 00:00:00', false, '2023-10-10 10:00:00', '2023-10-10 10:00:00', '11e5d48c-c4d0-4e8d-9677-54aeae2ca8a7'),
('e2c1b9a8-7d6e-5f4c-3b2a-1d0e9f8c7b6a', 'Aluguel escritório', 'Pagamento mensal do escritório', 1, 1800.00, '2023-10-30 00:00:00', false, '2023-10-30 09:00:00', '2023-10-30 09:00:00', '11e5d48c-c4d0-4e8d-9677-54aeae2ca8a7'),
('a9b8c7d6-e5f4-3g2h-1i0j-k9l8m7n6o5p4', 'Energia elétrica', 'Conta de luz mensal', 1, 350.00, '2023-11-05 00:00:00', false, '2023-11-05 14:00:00', '2023-11-05 14:00:00', '11e5d48c-c4d0-4e8d-9677-54aeae2ca8a7'),
('h8g7f6e5-d4c3-b2a1-9o8i-7u6y5t4r3e2w1', 'Internet', 'Serviço de internet fibra', 1, 200.00, '2023-11-08 00:00:00', false, '2023-11-08 17:30:00', '2023-11-08 17:30:00', '11e5d48c-c4d0-4e8d-9677-54aeae2ca8a7'),
('z1x2c3v4-b5n6m7-8k9j0-h1g2f3d4s5a6', 'Material de escritório', 'Compra de papelaria e suprimentos', 1, 120.00, '2023-11-12 00:00:00', false, '2023-11-12 13:45:00', '2023-11-12 13:45:00', '11e5d48c-c4d0-4e8d-9677-54aeae2ca8a7');
