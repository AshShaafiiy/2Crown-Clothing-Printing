# Domain Models

This document outlines the major TypeScript models currently defined in the application (`src/domain/models/index.ts`). These models act as the core data shape for both the frontend components and the Mock Services.

## User & Roles
- **`User`**: Represents individuals interacting with the system. Contains standard profile info (email, name, phone).
- **`Role`**: Strongly typed as `'root_super_admin' | 'super_admin' | 'admin' | 'customer'`. Dictates RBAC (Role-Based Access Control) permissions within the admin dashboard.

## Storefront Entities
- **`Category`**: Hierarchical organization for products (supports `parentId`).
- **`Product`**: The primary e-commerce entity. Defines price, stock, variants, and boolean flags (`featured`, `active`). Supports multiple `ProductType`s (`standard`, `variant`, `customizable`, `quote`).
- **`ProductVariant`**: Child entity of Product allowing multiple SKUs per item (e.g., Size/Color combinations).
- **`CustomizationField`**: Defines customer inputs required for a product. *(Note: While type `file` exists in the model, UI rules enforce that files are skipped during checkout validation and must be sent via WhatsApp)*.
- **`Promotion`**: Supports flash sales, fixed, or percentage-based discounts applicable to specific products or categories.

## Cart & Order Entities
- **`OrderItem`**: A single line item representing a product (and its chosen customization/variant) inside a Cart or Order.
- **`Order`**: The completed transaction payload. Contains the total `items`, `subtotal`, and `deliveryMethod`. 
- **`OrderStatus`**: Highly specific to 2Crown's WhatsApp-driven workflow (e.g., `'WhatsApp Pending'`, `'WhatsApp Opened'`, `'Customer Contacted'`, `'Quotation Sent'`, etc).

## Feedback & Content
- **`GalleryItem`**: Represents images showcased in the "Our Work" portfolio.
- **`Review`**: Represents customer product feedback. *(Note: Although the model contains a `comment` field, the UI enforces a strict Star-Rating-Only policy. Written reviews are disabled in the storefront)*.
- **`Testimonial`**: *(Note: This model exists in the domain definition, but the Testimonial UI was entirely removed from the customer homepage by business requirement)*.

## Business Settings
- **`BusinessSettings`**: A singleton configuration object defining the store name, contact info, and critical variables like the official `whatsappNumber`.
- **`DeliverySettings`**: Nested within Business Settings. Contains flags for enabling Pickup, Local Delivery, and Nationwide Delivery. *(Note: Local delivery fees are explicitly hidden from the customer storefront UI, as 2Crown manually calculates them via WhatsApp).*
