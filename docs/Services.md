# Service Interfaces

This document outlines the strict TypeScript interfaces located in `src/services/interfaces/index.ts`. 

Because 2Crown uses a decoupled architecture, the React components ONLY communicate with these interfaces. Currently, they are satisfied by the Mock Services. In **Phase 4 (Real Backend)**, these precise interfaces must be implemented by the new API client layer to ensure a seamless transition without breaking the frontend.

## Existing Service Interfaces

### 1. `IProductService`
Handles the e-commerce storefront catalog.
- `getProducts(filters?)`
- `getProductById(id)` / `getProductBySlug(slug)`
- `getFeaturedProducts()`
- `createProduct`, `updateProduct`, `deleteProduct` (Admin)

### 2. `ICategoryService`
Manages product categorization hierarchy.
- `getCategories()`
- `getCategoryById(id)` / `getCategoryBySlug(slug)`
- `createCategory`, `updateCategory`, `deleteCategory`

### 3. `IPromotionService`
Manages discounts and sales.
- `getPromotions()`, `getActivePromotions()`, `getFlashSales()`

### 4. `IOrderService`
Manages the creation and tracking of customer orders.
- `createOrder(order)`: Generates the order payload (which is then passed to the WhatsApp generator).
- `getOrders(filters?)`: Used by the Admin dashboard.
- `getOrderByReference(reference)`: Used by the public "Track Order" page.
- `updateOrderStatus(id, status)`

### 5. `IGalleryService`
Manages portfolio images for the "Our Work" section.
- `getGalleryItems(categoryId?)`

### 6. `IReviewService`
Manages customer product ratings.
- `addReview(review)`: Submits a 1-5 star rating.
- `getRatingSummary(productId)`: Returns the aggregated `{ average, count }`.
- `getReviewsByProductId(productId)`, `approveReview(id)`

### 7. `ITestimonialService`
*(Note: Interface exists in code, but the Testimonial UI was removed from the application).*
- `getTestimonials()`, `getFeaturedTestimonials()`

### 8. `ISettingsService`
Provides the centralized configuration required across the app (especially the WhatsApp number).
- `getBusinessSettings()`
- `updateBusinessSettings(settings)`

### 9. `IAuthService`
Manages admin authentication (Currently mocked).
- `getCurrentUser()`, `login(email, password)`, `logout()`

### 10. `IRBACService`
Enforces Role-Based Access Control logic for admin user management.
- `getUsers()`
- `createUser`, `updateUserRole`, `deleteUser` (Requires passing the `currentUser` to enforce strictly typed hierarchy rules, e.g., an Admin cannot delete a Super Admin).
