# Service Interfaces

This document outlines the strict TypeScript interfaces located in `src/services/interfaces/index.ts`. 

Components use the central `services` export. `src/services/index.ts` chooses the API implementation in normal development/production; Vitest selects mocks, and `VITE_USE_MOCK_SERVICES=true` forces mocks for local work. The backend Express routes persist data through Knex/SQLite. The public tracking service returns a minimized `PublicOrder`; authenticated admin order methods return internal order data.

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
- `getOrderByReference(reference, phone?)`: Returns a minimized public tracking DTO; phone is required for older short references.
- `updateOrderStatus(id, status)`, `updateOrderDeliveryFee(id, fee)`

### 5. `IReviewService`
Manages customer product ratings; the interface retains historical `Review` naming, but the storefront accepts stars only.
- `addReview(review)`: Submits a 1-5 star rating.
- `getRatingSummary(productId)`: Returns the aggregated `{ average, count }`.
- `getReviewsByProductId(productId)`, `approveReview(id)` remain interface methods for compatibility. The current API implementation returns an empty list and performs no approval action; neither is a maintained rating-management workflow.

### 6. `ITestimonialService`
*(Note: Interface exists in code, but the Testimonial UI was removed from the application).*
- `getTestimonials()`, `getFeaturedTestimonials()`

### 7. `ISettingsService`
Provides the centralized configuration required across the app (especially the WhatsApp number).
- `getBusinessSettings()`
- `updateBusinessSettings(settings)`

### 8. `IAuthService`
Manages admin authentication (API-backed in normal runtime).
- `getCurrentUser()`, `login(email, password)`, `logout()`

### 9. `IRBACService`
Provides administrator management methods; Express enforces authorization on every protected route.
- `getUsers()`
- `createUser`, `updateUserRole`, `updateUserStatus`, `deleteUser` accept a compatibility `currentUser` argument. Backend middleware and repository write guards enforce the hierarchy, never the frontend argument.
